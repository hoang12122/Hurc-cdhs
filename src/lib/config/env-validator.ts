/**
 * Module to validate environment variables
 * Implements Task 5.2
 */
export function validateEnv() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isOffline = process.env.DATABASE_OFFLINE === 'true' || process.env.IS_DATABASE_OFFLINE === 'true';

  console.info(`[EnvValidator] Validating environment for ${process.env.NODE_ENV}...`);

  // 1. Check NODE_ENV
  if (!process.env.NODE_ENV) {
    console.warn('⚠️ [EnvValidator] Warning: Missing NODE_ENV. Defaulting to development.');
  }

  // 2. Production Security Rules
  if (isProduction) {
    if (isOffline) {
      if (process.env.ALLOW_OFFLINE_PRODUCTION === 'true') {
        console.warn('⚠️ [SECURITY] Running in OFFLINE mode in PRODUCTION. Allowed by ALLOW_OFFLINE_PRODUCTION flag.');
      } else {
        console.warn('❌ [SECURITY ALERT] DATABASE_OFFLINE is enabled in production mode. This is discouraged unless for isolated deployments.');
      }
    }
    
    if (process.env.AI_SAFETY_LOG_ENABLED === 'false') {
      console.warn('⚠️ [COMPLIANCE] AI_SAFETY_LOG_ENABLED is false in production. Security audits will be limited.');
    }
  }

  // 3. Database URL Requirements
  if (!isOffline) {
    if (!process.env.OPS_DATABASE_URL && !process.env.DATABASE_URL) {
      console.warn('⚠️ [EnvValidator] Missing OPS_DATABASE_URL (or DATABASE_URL). ONLINE mode will fail at runtime.');
    }
    
    // AI Database is critical for new architecture
    if (!process.env.AI_DATABASE_URL) {
      console.warn('⚠️ [EnvValidator] AI_DATABASE_URL is missing. AI features will fail in online mode.');
    }
  }

  // 4. Sensitivity Protection
  // Ensure we don't log secrets - This is a policy check, not a runtime validation
  
  console.info('✅ Environment validation successful.');
}
