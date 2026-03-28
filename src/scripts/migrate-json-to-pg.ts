import fs from 'fs';
import path from 'path';
// @ts-ignore
import { PrismaClient as AuthClient } from '../lib/generated/auth';
// @ts-ignore
import { PrismaClient as OpsClient } from '../lib/generated/ops';

const authDb = new AuthClient();
const opsDb = new OpsClient();
const dbPath = path.join(process.cwd(), 'db.json');

async function migrate() {
  console.log('Bắt đầu đồng bộ dữ liệu từ db.json sang PostgreSQL (2 Databases)...');
  
  if (!fs.existsSync(dbPath)) {
    console.error('Không tìm thấy file db.json!');
    process.exit(1);
  }

  const rawData = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(rawData);
  
  try {
    // ==========================================
    // 1. AUTH DATABASE MIGRATION
    // ==========================================
    console.log('\n--- Đang đồng bộ AUTH DATABASE ---');
    
    // Roles
    if (db.roles && db.roles.length > 0) {
      console.log(`Đang đồng bộ ${db.roles.length} Roles...`);
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
      console.log(`Đang đồng bộ ${db.users.length} Users...`);
      for (const user of db.users) {
        await authDb.user.upsert({
          where: { id: user.id },
          update: { name: user.name, email: user.email, password: user.password, role: user.role, status: user.status, department: user.department, isVerified: user.isVerified || false, passwordLastChangedAt: user.passwordLastChangedAt ? new Date(user.passwordLastChangedAt) : null, permissions: user.permissions || [], assignedSubsystems: user.assignedSubsystems || [] },
          create: { id: user.id, name: user.name, email: user.email, password: user.password, role: user.role, status: user.status, department: user.department, isVerified: user.isVerified || false, passwordLastChangedAt: user.passwordLastChangedAt ? new Date(user.passwordLastChangedAt) : null, permissions: user.permissions || [], assignedSubsystems: user.assignedSubsystems || [] }
        });
      }
      console.log('✅ Users đồng bộ thành công.');
    }

    // Password Reset Requests
    if (db.passwordResetRequests && db.passwordResetRequests.length > 0) {
      console.log(`Đang đồng bộ ${db.passwordResetRequests.length} Password Reset Requests...`);
      for (const req of db.passwordResetRequests) {
        await authDb.passwordResetRequest.upsert({
          where: { id: req.id },
          update: { userId: req.userId, userEmail: req.userEmail, userName: req.userName, status: req.status },
          create: { id: req.id, userId: req.userId, userEmail: req.userEmail, userName: req.userName, status: req.status, createdAt: new Date(req.createdAt) }
        });
      }
      console.log('✅ Password Reset Requests đồng bộ thành công.');
    }

    // ==========================================
    // 2. OPS DATABASE MIGRATION
    // ==========================================
    console.log('\n--- Đang đồng bộ OPS DATABASE ---');

    console.log('✅ Cảnh báo: Việc đồng bộ đầy đủ sang opsDb yêu cầu map tất cả các schema. Vui lòng sử dụng cơ sở dữ liệu mới nếu cấu trúc json cũ không tương thích.');
    // Implementing a basic migration for core ops elements as proof of concept.

    // System Logs
    if (db.systemLogs && db.systemLogs.length > 0) {
        console.log(`Đang đồng bộ ${db.systemLogs.length} System Logs...`);
        for (const log of db.systemLogs) {
            await opsDb.systemLog.upsert({
                where: { id: log.id },
                update: {},
                create: { id: log.id, action: log.action, level: log.level, details: log.details, category: log.category || 'data', userId: log.userId, userName: log.userName, timestamp: new Date(log.timestamp) }
            });
        }
        console.log('✅ System Logs đồng bộ thành công.');
    }

    console.log('\n🎉 ĐỒNG BỘ HOÀN TẤT THÀNH CÔNG!');
  } catch (error) {
    console.error('Lỗi trong quá trình đồng bộ:');
    console.error(error);
  } finally {
    await authDb.$disconnect();
    await opsDb.$disconnect();
  }
}

migrate();
