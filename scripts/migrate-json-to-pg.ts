// @ts-ignore - Module will be available after npx prisma generate
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const DB_PATH = path.join(process.cwd(), 'db.json');

async function migrate() {
  console.log('Starting migration from db.json to PostgreSQL...');
  if (!fs.existsSync(DB_PATH)) {
    console.error('db.json not found!');
    process.exit(1);
  }

  const rawData = fs.readFileSync(DB_PATH, 'utf8');
  const db = JSON.parse(rawData);

  try {
    // Migrate Tasks
    if (db.todos && Array.isArray(db.todos)) {
      console.log(`Migrating ${db.todos.length} tasks...`);
      for (const t of db.todos) {
        await prisma.task.create({
          data: {
            id: t.id,
            title: t.title,
            description: t.description || null,
            status: t.status,
            priority: t.priority,
            dueDate: new Date(t.dueDate),
            deadline: t.deadline ? new Date(t.deadline) : null,
            progress: t.progress || 0,
            createdById: t.createdById,
            createdByName: t.createdByName,
            assignedToId: t.assignedToId || null,
            assignedToName: t.assignedToName || null,
            visibility: t.visibility || 'private',
            createdAt: t.createdAt ? new Date(t.createdAt) : new Date(),
            updatedAt: t.updatedAt ? new Date(t.updatedAt) : new Date(),
            department: t.department || null,
            todoType: t.todoType || null,
            watchers: t.watchers ? JSON.stringify(t.watchers) : null,
            activityHistory: t.activityHistory ? JSON.stringify(t.activityHistory) : null,
            attachments: t.attachments ? JSON.stringify(t.attachments) : null,
          }
        });
      }
      console.log('Tasks migrated.');
    }

    // You can add more migration blocks here for other collections:
    // - db.maintenanceStandards -> prisma.maintenanceStandard
    // - db.inspections -> prisma.inspectionDetail
    // - db.dnfs -> prisma.dnfDocument
    // - db.hazardRecords -> prisma.hazardRecord
    // - db.systemLogs -> prisma.systemLog

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
