import { spawnSync } from 'child_process';
import readline from 'readline';

const ALLOWED_DB_TYPES = new Set(['ops', 'ai']);

async function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    return await new Promise((resolve) => rl.question(question, resolve));
  } finally {
    rl.close();
  }
}

async function runSafeMigrate() {
  const dbType = process.argv[2];
  if (!ALLOWED_DB_TYPES.has(dbType)) {
    console.error('❌ Invalid migration target. Allowed values: ops, ai.');
    process.exit(1);
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const schemaPath = dbType === 'ai' ? 'prisma/ai/schema.prisma' : 'prisma/ops/schema.prisma';
  const dbName = dbType === 'ai' ? 'AI_DATABASE' : 'OPS_DATABASE';

  console.log(`\n🚀 [SafeMigrate] Target Database: ${dbName}`);
  console.log(`📄 [SafeMigrate] Using Schema: ${schemaPath}`);
  console.log(`🌐 [SafeMigrate] Environment: ${process.env.NODE_ENV || 'development'}\n`);

  if (isProduction) {
    console.warn('⚠️  WARNING: YOU ARE RUNNING MIGRATION IN PRODUCTION!');

    const answer = await ask(`Confirm migration for ${dbName}? (type the database name to confirm): `);
    if (answer !== dbName) {
      console.error('❌ Confirmation failed. Aborting migration.');
      process.exit(1);
    }

    const backupAnswer = await ask('Has the database been backed up? (y/n): ');
    if (backupAnswer !== 'y') {
      console.error('❌ Please backup the database before running migration in production.');
      process.exit(1);
    }
  }

  try {
    console.log('[SafeMigrate] Executing Prisma Migration...');
    const prismaArgs = ['prisma', 'migrate', isProduction ? 'deploy' : 'dev', '--schema', schemaPath];
    const result = spawnSync('npx', prismaArgs, { stdio: 'inherit', shell: process.platform === 'win32' });

    if (result.status !== 0) {
      throw new Error(`Prisma migration exited with code ${result.status ?? 'unknown'}`);
    }

    console.log(`\n✅ [SafeMigrate] Migration successful for ${dbName}.`);
    console.log(`LOG: [${new Date().toISOString()}] Migration executed on ${dbName} by system.`);
  } catch (error) {
    console.error('\n❌ [SafeMigrate] Migration failed!');
    process.exit(1);
  }
}

runSafeMigrate();
