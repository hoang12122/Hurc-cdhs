/**
 * RATE LIMITER UTILITY (HURC1 SECURITY)
 * Simple memory-based rate limiter to prevent DOS on local AI services.
 */

const requestCounts = new Map<string, { count: number, resetAt: number }>();

// AUTH RATE LIMIT (Brutal Audit Fix: Anti Brute-force)
const loginLimit = 5;
const loginWindow = 5 * 60 * 1000; // 5 minutes

// AI RATE LIMIT
const aiLimit = 20;
const aiWindow = 60 * 1000; // 1 minute

export function checkRateLimit(clientId: string, isLogin = false): boolean {
    const now = Date.now();
    const record = requestCounts.get(clientId);
    const limit = isLogin ? loginLimit : aiLimit;
    const window = isLogin ? loginWindow : aiWindow;
    
    if (!record || now > record.resetAt) {
        requestCounts.set(clientId, { count: 1, resetAt: now + window });
        return true;
    }
    
    if (record.count >= limit) {
        return false;
    }
    
    record.count += 1;
    return true;
}
