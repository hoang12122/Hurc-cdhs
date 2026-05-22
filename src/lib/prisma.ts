import { DB_CONFIG } from './config/db-config';
import { IS_DATABASE_OFFLINE } from './config/database-mode';
import { opsDb } from './db/ops-db';
import { authDb } from './db/auth-db';
import { aiDb } from './db/ai-db';
import { metroDb } from './db/metro-db';

export { IS_DATABASE_OFFLINE, opsDb, authDb, aiDb, metroDb };

// Default export maps to opsDb for backward compatibility
export default opsDb;

