/**
 * HURC1 BUILD ENVIRONMENT GUARD
 * Injects dummy environment variables if missing during build time 
 * to prevent Next.js/Prisma build failures.
 */
import fs from 'fs';
import path from 'path';

const REQUIRED_BUILD_VARS = [
    'AUTH_DATABASE_URL',
    'AI_DATABASE_URL',
    'METRO_DATABASE_URL',
    'OPS_DATABASE_URL',
    'SESSION_SECRET',
    'NEXT_PUBLIC_SETUP_COMPLETE'
];

function guard() {
    console.log("🛠️ HURC1: Running Build Environment Guard...");
    
    // 1. Ensure .env exists (even if empty) to satisfy Next.js loader
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
        console.warn("⚠️ No .env found. Creating a placeholder for build...");
        fs.writeFileSync(envPath, "# Build Placeholder\n");
    }

    // Parse existing .env file
    const envVars: Record<string, string> = {};
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const index = trimmed.indexOf('=');
            if (index !== -1) {
                const key = trimmed.substring(0, index).trim();
                const val = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, '');
                envVars[key] = val;
            }
        }
    });

    // 2. Inject dummy values for critical build-time vars
    // This allows 'prisma generate' and 'next build' to pass without real DB access
    for (const v of REQUIRED_BUILD_VARS) {
        const valueInEnv = envVars[v];
        const valueInProcess = process.env[v];

        if (!valueInEnv && !valueInProcess) {
            const val = v.includes('URL') 
                ? "postgresql://build:placeholder@localhost:5432/build" 
                : "build_placeholder_secret";
            
            process.env[v] = val;
            
            // Also append to .env temporarily if not set to satisfy some loaders
            fs.appendFileSync(envPath, `${v}=${val}\n`);
            console.log(`ℹ️ Appended placeholder value for: ${v}`);
        } else {
            // Already present, ensure process.env has it if it was only in .env
            if (!valueInProcess && valueInEnv) {
                process.env[v] = valueInEnv;
            }
        }
    }

    console.log("✅ Build Environment Guard: All critical variables are mocked/present.");
}

try {
    guard();
} catch (e) {
    console.error("❌ Build Guard failed:", e);
    process.exit(1);
}
