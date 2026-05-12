import { execSync } from 'child_process';
import readline from 'readline';

/**
 * Safe Migration Wrapper (Task 6.3)
 * Prevents accidental migrations in production and enforces checks.
 */
async function runSafeMigrate() {
  const dbType = process.argv[2]; // 'ops' or 'ai'
  const isProduction = process.env.NODE_ENV === 'production';
  const schemaPath = dbType === 'ai' ? 'prisma/ai/schema.prisma' : 'prisma/ops/schema.prisma';
  const dbName = dbType === 'ai' ? 'AI_DATABASE' : 'OPS_DATABASE';

  console.log(`\n🚀 [SafeMigrate] Target Database: ${dbName}`);
  console.log(`📄 [SafeMigrate] Using Schema: ${schemaPath}`);
  console.log(`🌐 [SafeMigrate] Environment: ${process.env.NODE_ENV || 'development'}\n`);

  if (isProduction) {
    console.warn('⚠️  WARNING: YOU ARE RUNNING MIGRATION IN PRODUCTION!');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const answer = await new Promise(resolve => {
      rl.question(`Confirm migration for ${dbName}? (type the database name to confirm): `, resolve);
    });

    if (answer !== dbName) {
      console.error('❌ Confirmation failed. Aborting migration.');
      process.exit(1);
    }

    const backupAnswer = await new Promise(resolve => {
      rl.question(`Has the database been backed up? (y/n): `, resolve);
    });

    if (backupAnswer !== 'y') {
      console.error('❌ Please backup the database before running migration in production.');
      process.exit(1);
    }
    
    rl.close();
  }

  try {
    console.log(`[SafeMigrate] Executing Prisma Migration...`);
    // Note: In production, we should use 'migrate deploy', in dev 'migrate dev'
    const command = isProduction 
      ? `npx prisma migrate deploy --schema=${schemaPath}`
      : `npx prisma migrate dev --schema=${schemaPath}`;
    
    execSync(command, { stdio: 'inherit' });
    
    console.log(`\n✅ [SafeMigrate] Migration successful for ${dbName}.`);
    
    // Log migration event (Simplified console log, could be written to file)
    console.log(`LOG: [${new Date().toISOString()}] Migration executed on ${dbName} by system.`);
    
  } catch (error) {
    console.error(`\n❌ [SafeMigrate] Migration failed!`);
    process.exit(1);
  }
}

runSafeMigrate();
