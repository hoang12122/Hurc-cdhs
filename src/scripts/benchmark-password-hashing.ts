import bcrypt from 'bcryptjs';
import { performance } from 'node:perf_hooks';

const DEFAULT_COSTS = [10, 11, 12, 13];
const DEFAULT_ITERATIONS = 3;
const TARGET_MAX_MS = Number(process.env.BCRYPT_TARGET_MAX_MS || 750);

function parseCosts(): number[] {
    const configured = process.env.BCRYPT_BENCHMARK_COSTS;
    if (!configured) return DEFAULT_COSTS;

    const costs = configured
        .split(',')
        .map(value => Number(value.trim()))
        .filter(value => Number.isInteger(value) && value >= 10 && value <= 15);

    if (costs.length === 0) {
        throw new Error('BCRYPT_BENCHMARK_COSTS must contain integers between 10 and 15.');
    }

    return Array.from(new Set(costs)).sort((a, b) => a - b);
}

function parseIterations(): number {
    const iterations = Number(process.env.BCRYPT_BENCHMARK_ITERATIONS || DEFAULT_ITERATIONS);
    if (!Number.isInteger(iterations) || iterations < 1 || iterations > 20) {
        throw new Error('BCRYPT_BENCHMARK_ITERATIONS must be an integer between 1 and 20.');
    }
    return iterations;
}

function average(values: number[]): number {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

async function main() {
    const costs = parseCosts();
    const iterations = parseIterations();
    const password = 'HURC-Benchmark-Only!2026';
    const results: Array<{
        cost: number;
        averageHashMs: number;
        averageVerifyMs: number;
        withinTarget: boolean;
    }> = [];

    for (const cost of costs) {
        const hashTimes: number[] = [];
        const verifyTimes: number[] = [];

        for (let index = 0; index < iterations; index += 1) {
            const hashStart = performance.now();
            const hash = await bcrypt.hash(password, cost);
            hashTimes.push(performance.now() - hashStart);

            const verifyStart = performance.now();
            const valid = await bcrypt.compare(password, hash);
            verifyTimes.push(performance.now() - verifyStart);

            if (!valid) throw new Error(`bcrypt verification failed for cost ${cost}.`);
        }

        const averageHashMs = average(hashTimes);
        const averageVerifyMs = average(verifyTimes);
        results.push({
            cost,
            averageHashMs: Number(averageHashMs.toFixed(1)),
            averageVerifyMs: Number(averageVerifyMs.toFixed(1)),
            withinTarget: Math.max(averageHashMs, averageVerifyMs) <= TARGET_MAX_MS,
        });
    }

    console.table(results);

    const recommended = results
        .filter(result => result.withinTarget)
        .sort((a, b) => b.cost - a.cost)[0];

    if (!recommended) {
        console.warn(
            `No tested cost completed within the ${TARGET_MAX_MS} ms target. ` +
            'Test a lower target range before changing production configuration.'
        );
        process.exitCode = 1;
        return;
    }

    console.log(
        `Recommended BCRYPT_COST for this host: ${recommended.cost} ` +
        `(slowest measured operation: ${Math.max(recommended.averageHashMs, recommended.averageVerifyMs)} ms).`
    );
}

main().catch(error => {
    console.error('[bcrypt-benchmark] Failed:', error);
    process.exit(1);
});
