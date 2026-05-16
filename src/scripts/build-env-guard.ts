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

    // 2. Inject dummy values for critical build-time vars
    // This allows 'prisma generate' and 'next build' to pass without real DB access
    for (const v of REQUIRED_BUILD_VARS) {
        if (!process.env[v]) {
            process.env[v] = v.includes('URL') 
                ? "postgresql://build:placeholder@localhost:5432/build" 
                : "build_placeholder_secret";
            
            // Also append to .env temporarily if not set to satisfy some loaders
            fs.appendFileSync(envPath, `${v}=${process.env[v]}\n`);
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
