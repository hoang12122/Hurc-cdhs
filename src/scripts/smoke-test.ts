/**
 * HURC1 SMOKE TEST (Post-Deployment Validation)
 * Verifies that the deployed system is actually alive and responsive.
 */
import http from 'http';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

async function checkUrl(url: string, name: string) {
    return new Promise((resolve) => {
        http.get(url, (res) => {
            if (res.statusCode === 200 || res.statusCode === 302) {
                console.log(`✅ ${name}: OK (${res.statusCode})`);
                resolve(true);
            } else {
                console.error(`❌ ${name}: FAILED (${res.statusCode})`);
                resolve(false);
            }
        }).on('error', (err) => {
            console.error(`❌ ${name}: CRASHED (${err.message})`);
            resolve(false);
        });
    });
}

async function runSmokeTest() {
    console.log("🔥 HURC1 SMOKE TEST: Running validation...");
    
    const results = await Promise.all([
        checkUrl(`${APP_URL}/`, 'Homepage'),
        checkUrl(`${APP_URL}/api/health`, 'Health API'),
        checkUrl(`http://localhost:5005/health`, 'YOLO Service'),
    ]);

    if (results.every(r => r === true)) {
        console.log("\n🚀 ALL SYSTEMS GO! Deployment is stable.");
    } else {
        console.error("\n💀 SMOKE TEST FAILED! Check container logs.");
        process.exit(1);
    }
}

runSmokeTest();
