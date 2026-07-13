import { NextResponse } from 'next/server';
import { CONVERGED_PLATFORM_CONFIG } from '@/lib/config/converged-platform-profile';

export async function GET() {
    return NextResponse.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        platform: {
            version: CONVERGED_PLATFORM_CONFIG.version,
            phase: CONVERGED_PLATFORM_CONFIG.phase,
            features: { ...CONVERGED_PLATFORM_CONFIG.features },
            ledgerWriteEnabled: CONVERGED_PLATFORM_CONFIG.security.ledgerWriteEnabled,
        },
    });
}
