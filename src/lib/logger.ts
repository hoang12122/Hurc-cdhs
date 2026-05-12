/**
 * Logger with dynamic imports to prevent Webpack from bundling 
 * native modules (snappy, etc.) into client bundles.
 */
export async function logToFullStack(level: 'info' | 'warn' | 'error' | 'critical', message: string, meta?: any) {
    if (typeof window !== 'undefined') return; // Ensure it never runs on client

    try {
        const winston = await import('winston');
        const LokiTransport = (await import('winston-loki')).default;

        // Normalize level for Winston
        const normalizedLevel = (level || 'info').toLowerCase();
        let winstonLevel: string = normalizedLevel;
        
        if (normalizedLevel === 'warning') winstonLevel = 'warn';
        if (normalizedLevel === 'critical') winstonLevel = 'error';
        
        // Create logger instance locally to avoid static import issues
        const logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                }),
                new LokiTransport({
                    host: process.env.LOKI_URL || 'http://loki:3100',
                    labels: { app: 'hurc-crm', env: process.env.NODE_ENV || 'development' },
                    json: true,
                    // Use a simple error handler
                })
            ]
        });

        logger.log(winstonLevel, message, { ...meta, level_original: level });
    } catch (err) {
        console.error('Loki logging system error:', err);
    }
}
