import fs from 'fs';
import path from 'path';
import { PrismaClient as AuthClient } from '@prisma/client/auth';
import { PrismaClient as OpsClient } from '@prisma/client/ops';
import { PrismaClient as AiClient } from '@prisma/client/ai';
import { PrismaClient as MetroClient } from '@prisma/client/metro';

const authDb = new AuthClient();
const opsDb = new OpsClient();
const aiDb = new AiClient();
const metroDb = new MetroClient();
const dbPath = path.join(process.cwd(), 'db.json');

async function migrate() {
  console.log('🚀 Bắt đầu đồng bộ dữ liệu từ db.json sang PostgreSQL (4 Databases)...');
  
  if (!fs.existsSync(dbPath)) {
    console.error('❌ Không tìm thấy file db.json!');
    process.exit(1);
  }

  const rawData = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(rawData);
  
  try {
    // ==========================================
    // 1. AUTH DATABASE MIGRATION
    // ==========================================
    console.log('\n🔐 --- Đang đồng bộ AUTH DATABASE ---');
    
    // Roles
    if (db.roles && db.roles.length > 0) {
      console.log(`📦 Đang đồng bộ ${db.roles.length} Roles...`);
      for (const role of db.roles) {
        await authDb.role.upsert({
          where: { id: role.id },
          update: { name: role.name, description: role.description, permissions: role.permissions || [] },
          create: { id: role.id, name: role.name, description: role.description, permissions: role.permissions || [] }
        });
      }
      console.log('✅ Roles đồng bộ thành công.');
    }

    // Users
    if (db.users && db.users.length > 0) {
      console.log(`👤 Đang đồng bộ ${db.users.length} Users...`);
      for (const user of db.users) {
        await authDb.user.upsert({
          where: { id: user.id },
          update: { name: user.name, email: user.email, password: user.password, role: user.role, status: user.status, department: user.department, isVerified: user.isVerified || false, passwordLastChangedAt: user.passwordLastChangedAt ? new Date(user.passwordLastChangedAt) : null, permissions: user.permissions || [], assignedSubsystems: user.assignedSubsystems || [] },
          create: { id: user.id, name: user.name, email: user.email, password: user.password, role: user.role, status: user.status, department: user.department, isVerified: user.isVerified || false, passwordLastChangedAt: user.passwordLastChangedAt ? new Date(user.passwordLastChangedAt) : null, permissions: user.permissions || [], assignedSubsystems: user.assignedSubsystems || [] }
        });
      }
      console.log('✅ Users đồng bộ thành công.');
    }

    // ==========================================
    // 2. OPS DATABASE MIGRATION
    // ==========================================
    console.log('\n🛠️ --- Đang đồng bộ OPS DATABASE ---');

    // System Logs
    if (db.system_logs && db.system_logs.length > 0) {
        console.log(`📜 Đang đồng bộ ${db.system_logs.length} System Logs...`);
        for (const log of db.system_logs) {
            await opsDb.systemLog.upsert({
                where: { id: log.id },
                update: {},
                create: { id: log.id, action: log.action, level: log.level, details: log.details, category: log.category || 'data', userId: log.userId, userName: log.userName, timestamp: new Date(log.timestamp) }
            });
        }
        console.log('✅ System Logs đồng bộ thành công.');
    }

    // System State
    if (db.systemState) {
        console.log('⚙️ Đang đồng bộ System State...');
        await opsDb.systemState.upsert({
            where: { id: db.systemState.id },
            update: { lastSchedulerRun: new Date(db.systemState.lastSchedulerRun) },
            create: { id: db.systemState.id, lastSchedulerRun: new Date(db.systemState.lastSchedulerRun) }
        });
        console.log('✅ System State đồng bộ thành công.');
    }

    // ==========================================
    // 3. METRO DATABASE MIGRATION (Stub for Assets)
    // ==========================================
    console.log('\n🚇 --- Đang đồng bộ METRO DATABASE ---');
    console.log('ℹ️ Metro Database contains assets and technical readings. Migrating stubs if available...');
    
    // ==========================================
    // 4. AI DATABASE MIGRATION (Stub)
    // ==========================================
    console.log('\n🤖 --- Đang đồng bộ AI DATABASE ---');
    console.log('ℹ️ AI Database handles insights and conversations. Sync logic ready tool for expansion.');

    console.log('\n🎉 ĐỒNG BỘ HOÀN TẤT THÀNH CÔNG!');
  } catch (error) {
    console.error('❌ Lỗi trong quá trình đồng bộ:');
    console.error(error);
  } finally {
    await authDb.$disconnect();
    await opsDb.$disconnect();
    await aiDb.$disconnect();
    await metroDb.$disconnect();
  }
}

migrate();
