import * as snmp from 'net-snmp';
import { metroDb, IS_DATABASE_OFFLINE } from '../prisma';

async function pollDevice(config: {
    ip: string;
    community: string;
    oid: string;
    assetId: string;
    metricName: string;
}): Promise<number | null> {
    return new Promise((resolve) => {
        const session = snmp.createSession(config.ip, config.community, { timeout: 2000, version: snmp.Version2c });
        
        session.get([config.oid], (error: any, varbinds: any) => {
            if (error) {
                console.error(`SNMP Poll Error [${config.ip}]:`, error);
                session.close();
                return resolve(null);
            }

            const vb = varbinds[0];
            if (snmp.isVarbindError(vb)) {
                console.error(`SNMP Varbind Error [${config.ip}]:`, snmp.varbindError(vb));
                session.close();
                return resolve(null);
            }

            const value = vb.value;
            session.close();
            
            // Handle numeric values
            if (typeof value === 'number') resolve(value);
            else if (typeof value === 'bigint') resolve(Number(value));
            else if (typeof value === 'string') resolve(parseFloat(value) || 0);
            else resolve(0);
        });
    });
}

export async function runTelemetryPoller() {
    if (IS_DATABASE_OFFLINE) {
        // Skip background polling in offline mode to avoid errors and db.json bloat
        return;
    }
    console.log("Starting Telemetry Poller...");
    const now = new Date();
    
    // Get all configs that are due for polling
    const configs = await metroDb.snmpConfig.findMany();
    
    const polls = configs.filter((config: any) => {
        if (!config.lastPolled) return true;
        const secondsSinceLastPoll = (now.getTime() - config.lastPolled.getTime()) / 1000;
        return secondsSinceLastPoll >= config.intervalSeconds;
    });

    console.log(`Poller: Processing ${polls.length} devices.`);

    for (const config of polls) {
        try {
            const value = await pollDevice({
                ip: config.ip,
                community: config.community,
                oid: config.oid,
                assetId: config.assetId,
                metricName: config.metricName
            });

            if (value !== null) {
                // Direct DB write to avoid importing Server Actions into a Service
                await metroDb.telemetryReading.create({
                    data: {
                        assetId: config.assetId,
                        metric: config.metricName,
                        value: value,
                        unit: ''
                    }
                });
                
                await metroDb.snmpConfig.update({
                    where: { id: config.id },
                    data: { lastPolled: new Date() }
                });
                console.log(`Poller: Successfully polled ${config.metricName} for Asset ${config.assetId}`);
            }
        } catch (e) {
            console.error(`Poller failure for config ${config.id}:`, e);
        }
    }
}
