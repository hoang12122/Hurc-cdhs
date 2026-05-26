// @ts-ignore - Module will be available after npx prisma generate
import { PrismaClient } from '@prisma/client';
// @ts-ignore - Module will be available after npx prisma generate
import { PrismaClient as AuthPrismaClient } from '../.prisma-runtime/auth';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient(); // opsDb
const authPrisma = new AuthPrismaClient(); // authDb
const DB_PATH = path.join(process.cwd(), 'db.json');

async function migrate() {
  console.log('🛡️  Starting complete migration from db.json to PostgreSQL...');
  if (!fs.existsSync(DB_PATH)) {
    console.error('❌  db.json not found!');
    process.exit(1);
  }

  const rawData = fs.readFileSync(DB_PATH, 'utf8');
  const db = JSON.parse(rawData);

  try {
    // ==========================================
    // TẦNG 1: DỮ LIỆU XÁC THỰC & AD (authDb)
    // ==========================================
    console.log('\n🔑 [1/3] Migrating Authentication & Active Directory hierarchy...');

    // 1. Forests
    if (db.forests && Array.isArray(db.forests)) {
      console.log(`- Migrating ${db.forests.length} forests...`);
      for (const item of db.forests) {
        await authPrisma.forest.upsert({
          where: { id: item.id },
          update: { name: item.name, description: item.description || null },
          create: { id: item.id, name: item.name, description: item.description || null }
        });
      }
    }

    // 2. Trees
    if (db.trees && Array.isArray(db.trees)) {
      console.log(`- Migrating ${db.trees.length} trees...`);
      for (const item of db.trees) {
        await authPrisma.tree.upsert({
          where: { id: item.id },
          update: { name: item.name, description: item.description || null, forestId: item.forestId },
          create: { id: item.id, name: item.name, description: item.description || null, forestId: item.forestId }
        });
      }
    }

    // 3. ChildDomains
    if (db.child_domains && Array.isArray(db.child_domains)) {
      console.log(`- Migrating ${db.child_domains.length} child domains...`);
      for (const item of db.child_domains) {
        await authPrisma.childDomain.upsert({
          where: { id: item.id },
          update: { name: item.name, description: item.description || null, treeId: item.treeId },
          create: { id: item.id, name: item.name, description: item.description || null, treeId: item.treeId }
        });
      }
    }

    // 4. OrganizationalUnits
    if (db.organizational_units && Array.isArray(db.organizational_units)) {
      console.log(`- Migrating ${db.organizational_units.length} organizational units...`);
      // Sort OUs by hierarchy level to ensure parent is migrated before children
      const sortedOus = [...db.organizational_units].sort((a, b) => (a.level || 0) - (b.level || 0));
      for (const item of sortedOus) {
        await authPrisma.organizationalUnit.upsert({
          where: { id: item.id },
          update: { 
            name: item.name, 
            description: item.description || null, 
            domainId: item.domainId,
            parentId: item.parentId || null
          },
          create: { 
            id: item.id,
            name: item.name, 
            description: item.description || null, 
            domainId: item.domainId,
            parentId: item.parentId || null
          }
        });
      }
    }

    // 5. Roles
    if (db.roles && Array.isArray(db.roles)) {
      console.log(`- Migrating ${db.roles.length} roles...`);
      for (const item of db.roles) {
        await authPrisma.role.upsert({
          where: { id: item.id },
          update: { name: item.name, description: item.description || '', permissions: item.permissions || [] },
          create: { id: item.id, name: item.name, description: item.description || '', permissions: item.permissions || [] }
        });
      }
    }

    // 6. Users
    if (db.users && Array.isArray(db.users)) {
      console.log(`- Migrating ${db.users.length} users...`);
      for (const item of db.users) {
        await authPrisma.user.upsert({
          where: { id: item.id },
          update: {
            name: item.name,
            email: item.email,
            password: item.password || null,
            role: item.role,
            status: item.status,
            department: item.department || null,
            isVerified: item.isVerified ?? true,
            permissions: item.permissions || [],
            assignedSubsystems: item.assignedSubsystems || [],
            avatarUrl: item.avatarUrl || null,
            ouId: item.ouId || null,
            passwordLastChangedAt: item.passwordLastChangedAt ? new Date(item.passwordLastChangedAt) : new Date()
          },
          create: {
            id: item.id,
            name: item.name,
            email: item.email,
            password: item.password || null,
            role: item.role,
            status: item.status,
            department: item.department || null,
            isVerified: item.isVerified ?? true,
            permissions: item.permissions || [],
            assignedSubsystems: item.assignedSubsystems || [],
            avatarUrl: item.avatarUrl || null,
            ouId: item.ouId || null,
            passwordLastChangedAt: item.passwordLastChangedAt ? new Date(item.passwordLastChangedAt) : new Date()
          }
        });
      }
    }

    // ==========================================
    // TẦNG 2: MÃ DANH MỤC & TIÊU CHUẨN (opsDb metadata)
    // ==========================================
    console.log('\n⚙️  [2/3] Migrating system metadata & maintenance standards...');

    // 1. Subsystems
    if (db.subsystems && Array.isArray(db.subsystems)) {
      console.log(`- Migrating ${db.subsystems.length} subsystems...`);
      for (const item of db.subsystems) {
        await prisma.subsystem.upsert({
          where: { id: item.id },
          update: { 
            label_en: item.label_en || item.label?.en || '', 
            label_vi: item.label_vi || item.label?.vi || '' 
          },
          create: { 
            id: item.id,
            label_en: item.label_en || item.label?.en || '', 
            label_vi: item.label_vi || item.label?.vi || '' 
          }
        });
      }
    }

    // 2. PatrolLocations
    if (db.patrol_locations && Array.isArray(db.patrol_locations)) {
      console.log(`- Migrating ${db.patrol_locations.length} patrol locations...`);
      for (const item of db.patrol_locations) {
        await prisma.patrolLocation.upsert({
          where: { id: item.id },
          update: { label: item.label },
          create: { id: item.id, label: item.label }
        });
      }
    }

    // 3. ResponsibleUnits
    if (db.responsible_units && Array.isArray(db.responsible_units)) {
      console.log(`- Migrating ${db.responsible_units.length} responsible units...`);
      for (const item of db.responsible_units) {
        await prisma.responsibleUnit.upsert({
          where: { id: item.id },
          update: { name: item.name },
          create: { id: item.id, name: item.name }
        });
      }
    }

    // 4. MaintenanceStandards & Items
    if (db.maintenance_standards && Array.isArray(db.maintenance_standards)) {
      console.log(`- Migrating ${db.maintenance_standards.length} maintenance standards...`);
      for (const item of db.maintenance_standards) {
        await prisma.maintenanceStandard.upsert({
          where: { id: item.id },
          update: {
            name: item.name,
            name_en: item.name_en || null,
            description: item.description || null,
            frequency: item.frequency || null,
            scheduledTime: item.scheduledTime || null,
            locationIds: item.locationIds ? JSON.stringify(item.locationIds) : null,
            recipientId: item.recipientId || null,
            abbreviation: item.abbreviation || null,
            estimatedDurationHours: item.estimatedDurationHours || null
          },
          create: {
            id: item.id,
            name: item.name,
            name_en: item.name_en || null,
            description: item.description || null,
            frequency: item.frequency || null,
            scheduledTime: item.scheduledTime || null,
            locationIds: item.locationIds ? JSON.stringify(item.locationIds) : null,
            recipientId: item.recipientId || null,
            abbreviation: item.abbreviation || null,
            estimatedDurationHours: item.estimatedDurationHours || null
          }
        });

        // Migrate nested standard items if they exist
        if (item.items && Array.isArray(item.items)) {
          for (const sub of item.items) {
            await prisma.maintenanceStandardItem.upsert({
              where: { id: sub.id },
              update: {
                standardId: item.id,
                itemCode: sub.itemCode,
                itemText: sub.itemText,
                criteria: sub.criteria || null,
                unit: sub.unit || null,
                standardQuantity: sub.standardQuantity || null,
                toleranceOperator: sub.toleranceOperator || null,
                toleranceValue: sub.toleranceValue || null,
                requiredTools: sub.requiredTools || null
              },
              create: {
                id: sub.id,
                standardId: item.id,
                itemCode: sub.itemCode,
                itemText: sub.itemText,
                criteria: sub.criteria || null,
                unit: sub.unit || null,
                standardQuantity: sub.standardQuantity || null,
                toleranceOperator: sub.toleranceOperator || null,
                toleranceValue: sub.toleranceValue || null,
                requiredTools: sub.requiredTools || null
              }
            });
          }
        }
      }
    }

    // ==========================================
    // TẦNG 3: DỮ LIỆU NGHIỆP VỤ & VẬN HÀNH (opsDb)
    // ==========================================
    console.log('\n🛠️  [3/3] Migrating core operational data...');

    // 1. Tasks (todos)
    if (db.todos && Array.isArray(db.todos)) {
      console.log(`- Migrating ${db.todos.length} tasks...`);
      for (const t of db.todos) {
        await prisma.task.upsert({
          where: { id: t.id },
          update: {
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
          },
          create: {
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
    }

    // 2. DnfDocuments & CorrectiveActions
    if (db.dnf_documents && Array.isArray(db.dnf_documents)) {
      console.log(`- Migrating ${db.dnf_documents.length} DNF defect documents...`);
      for (const item of db.dnf_documents) {
        await prisma.dnfDocument.upsert({
          where: { id: item.id },
          update: {
            failureReportNo: item.failureReportNo || null,
            locationOfFailure: item.locationOfFailure,
            failedComponentEquipmentLRUTrainNumber: item.failedComponentEquipmentLRUTrainNumber || null,
            subsystemIds: item.subsystemIds ? JSON.stringify(item.subsystemIds) : null,
            descriptionOfFailure: item.descriptionOfFailure,
            impactAssessment: item.impactAssessment || null,
            staffWhoIdentifiedFailure: item.staffWhoIdentifiedFailure,
            dateTimeOfFailureOccurrence: new Date(item.dateTimeOfFailureOccurrence),
            methodOfFailureDetection: item.methodOfFailureDetection,
            hazardLevelId: item.hazardLevelId || null,
            status: item.status,
            createdById: item.createdById,
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
            resolutionDetails: item.resolutionDetails || null,
            assignedTo: item.assignedTo || null,
            priority: item.priority || null,
            completedDate: item.completedDate ? new Date(item.completedDate) : null,
            originatingInspectionId: item.originatingInspectionId || null,
            originatingFindingId: item.originatingFindingId || null,
            immediateAction: item.immediateAction || null,
            problemResettable: item.problemResettable ?? null,
            trainServiceAffected: item.trainServiceAffected ?? null,
            trainWithdrawn: item.trainWithdrawn ?? null,
            systemRestoredTime: item.systemRestoredTime ? new Date(item.systemRestoredTime) : null,
            disruptionDuration: item.disruptionDuration || null,
            trainKm: item.trainKm || null,
            rectificationParty: item.rectificationParty || null,
            attachments: item.attachments ? JSON.stringify(item.attachments) : null,
            statusHistory: item.statusHistory ? JSON.stringify(item.statusHistory) : null
          },
          create: {
            id: item.id,
            failureReportNo: item.failureReportNo || null,
            locationOfFailure: item.locationOfFailure,
            failedComponentEquipmentLRUTrainNumber: item.failedComponentEquipmentLRUTrainNumber || null,
            subsystemIds: item.subsystemIds ? JSON.stringify(item.subsystemIds) : null,
            descriptionOfFailure: item.descriptionOfFailure,
            impactAssessment: item.impactAssessment || null,
            staffWhoIdentifiedFailure: item.staffWhoIdentifiedFailure,
            dateTimeOfFailureOccurrence: new Date(item.dateTimeOfFailureOccurrence),
            methodOfFailureDetection: item.methodOfFailureDetection,
            hazardLevelId: item.hazardLevelId || null,
            status: item.status,
            createdById: item.createdById,
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
            resolutionDetails: item.resolutionDetails || null,
            assignedTo: item.assignedTo || null,
            priority: item.priority || null,
            completedDate: item.completedDate ? new Date(item.completedDate) : null,
            originatingInspectionId: item.originatingInspectionId || null,
            originatingFindingId: item.originatingFindingId || null,
            immediateAction: item.immediateAction || null,
            problemResettable: item.problemResettable ?? null,
            trainServiceAffected: item.trainServiceAffected ?? null,
            trainWithdrawn: item.trainWithdrawn ?? null,
            systemRestoredTime: item.systemRestoredTime ? new Date(item.systemRestoredTime) : null,
            disruptionDuration: item.disruptionDuration || null,
            trainKm: item.trainKm || null,
            rectificationParty: item.rectificationParty || null,
            attachments: item.attachments ? JSON.stringify(item.attachments) : null,
            statusHistory: item.statusHistory ? JSON.stringify(item.statusHistory) : null
          }
        });

        // Migrate nested CorrectiveActions
        if (item.correctiveActions && Array.isArray(item.correctiveActions)) {
          for (const ca of item.correctiveActions) {
            await prisma.correctiveAction.upsert({
              where: { id: ca.id },
              update: {
                dnfId: item.id,
                description: ca.description,
                responsiblePersonOrUnit: ca.responsiblePersonOrUnit,
                completedAt: ca.completedAt ? new Date(ca.completedAt) : null,
                status: ca.status,
                dateTimeNotified: ca.dateTimeNotified ? new Date(ca.dateTimeNotified) : null,
                dateTimeArrival: ca.dateTimeArrival ? new Date(ca.dateTimeArrival) : null,
                diagnosisTime: ca.diagnosisTime || null,
                repairTime: ca.repairTime || null,
                verificationTime: ca.verificationTime || null,
                totalDownTime: ca.totalDownTime || null
              },
              create: {
                id: ca.id,
                dnfId: item.id,
                description: ca.description,
                responsiblePersonOrUnit: ca.responsiblePersonOrUnit,
                completedAt: ca.completedAt ? new Date(ca.completedAt) : null,
                status: ca.status,
                dateTimeNotified: ca.dateTimeNotified ? new Date(ca.dateTimeNotified) : null,
                dateTimeArrival: ca.dateTimeArrival ? new Date(ca.dateTimeArrival) : null,
                diagnosisTime: ca.diagnosisTime || null,
                repairTime: ca.repairTime || null,
                verificationTime: ca.verificationTime || null,
                totalDownTime: ca.totalDownTime || null
              }
            });
          }
        }
      }
    }

    // Flat CorrectiveActions (if stored outside dnf_documents in some schemas)
    if (db.corrective_actions && Array.isArray(db.corrective_actions)) {
      console.log(`- Migrating ${db.corrective_actions.length} flat corrective actions...`);
      for (const ca of db.corrective_actions) {
        await prisma.correctiveAction.upsert({
          where: { id: ca.id },
          update: {
            dnfId: ca.dnfId,
            description: ca.description,
            responsiblePersonOrUnit: ca.responsiblePersonOrUnit,
            completedAt: ca.completedAt ? new Date(ca.completedAt) : null,
            status: ca.status,
            dateTimeNotified: ca.dateTimeNotified ? new Date(ca.dateTimeNotified) : null,
            dateTimeArrival: ca.dateTimeArrival ? new Date(ca.dateTimeArrival) : null,
            diagnosisTime: ca.diagnosisTime || null,
            repairTime: ca.repairTime || null,
            verificationTime: ca.verificationTime || null,
            totalDownTime: ca.totalDownTime || null
          },
          create: {
            id: ca.id,
            dnfId: ca.dnfId,
            description: ca.description,
            responsiblePersonOrUnit: ca.responsiblePersonOrUnit,
            completedAt: ca.completedAt ? new Date(ca.completedAt) : null,
            status: ca.status,
            dateTimeNotified: ca.dateTimeNotified ? new Date(ca.dateTimeNotified) : null,
            dateTimeArrival: ca.dateTimeArrival ? new Date(ca.dateTimeArrival) : null,
            diagnosisTime: ca.diagnosisTime || null,
            repairTime: ca.repairTime || null,
            verificationTime: ca.verificationTime || null,
            totalDownTime: ca.totalDownTime || null
          }
        });
      }
    }

    // 3. HazardRecords
    if (db.hazards && Array.isArray(db.hazards)) {
      console.log(`- Migrating ${db.hazards.length} hazard records...`);
      for (const item of db.hazards) {
        await prisma.hazardRecord.upsert({
          where: { id: item.id },
          update: {
            description: item.description,
            systemGroup: item.systemGroup || null,
            locationIds: item.locationIds ? JSON.stringify(item.locationIds) : null,
            source: item.source || null,
            potentialConsequence: item.potentialConsequence || null,
            identifiedBy: item.identifiedBy,
            identificationDate: new Date(item.identificationDate),
            severityId: item.severityId || null,
            likelihoodId: item.likelihoodId || null,
            riskLevelId: item.riskLevelId || null,
            currentControls: item.currentControls,
            proposedActions: item.proposedActions || null,
            suggestedActions: item.suggestedActions || null,
            responsiblePersonOrUnit: item.responsiblePersonOrUnit || null,
            coordinatingUnits: item.coordinatingUnits ? JSON.stringify(item.coordinatingUnits) : null,
            dueDate: item.dueDate ? new Date(item.dueDate) : null,
            status: item.status,
            closureDetails: item.closureDetails || null,
            verificationDetails: item.verificationDetails || null,
            linkedDnfId: item.linkedDnfId || null,
            createdById: item.createdById,
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
            attachments: item.attachments ? JSON.stringify(item.attachments) : null,
            statusHistory: item.statusHistory ? JSON.stringify(item.statusHistory) : null
          },
          create: {
            id: item.id,
            description: item.description,
            systemGroup: item.systemGroup || null,
            locationIds: item.locationIds ? JSON.stringify(item.locationIds) : null,
            source: item.source || null,
            potentialConsequence: item.potentialConsequence || null,
            identifiedBy: item.identifiedBy,
            identificationDate: new Date(item.identificationDate),
            severityId: item.severityId || null,
            likelihoodId: item.likelihoodId || null,
            riskLevelId: item.riskLevelId || null,
            currentControls: item.currentControls,
            proposedActions: item.proposedActions || null,
            suggestedActions: item.suggestedActions || null,
            responsiblePersonOrUnit: item.responsiblePersonOrUnit || null,
            coordinatingUnits: item.coordinatingUnits ? JSON.stringify(item.coordinatingUnits) : null,
            dueDate: item.dueDate ? new Date(item.dueDate) : null,
            status: item.status,
            closureDetails: item.closureDetails || null,
            verificationDetails: item.verificationDetails || null,
            linkedDnfId: item.linkedDnfId || null,
            createdById: item.createdById,
            createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
            attachments: item.attachments ? JSON.stringify(item.attachments) : null,
            statusHistory: item.statusHistory ? JSON.stringify(item.statusHistory) : null
          }
        });
      }
    }

    // 4. InspectionDetails, ChecklistItems & Findings
    if (db.inspections && Array.isArray(db.inspections)) {
      console.log(`- Migrating ${db.inspections.length} field inspections...`);
      for (const item of db.inspections) {
        await prisma.inspectionDetail.upsert({
          where: { id: item.id },
          update: {
            title: item.title,
            areaIds: item.areaIds ? JSON.stringify(item.areaIds) : null,
            inspector: item.inspector,
            date: new Date(item.date),
            status: item.status,
            checklistTemplateId: item.checklistTemplateId || null,
            generalNotes: item.generalNotes || null,
            approvalComments: item.approvalComments || null,
            lastStatusUpdateBy: item.lastStatusUpdateBy || null,
            lastStatusUpdateAt: item.lastStatusUpdateAt ? new Date(item.lastStatusUpdateAt) : null,
            scheduledStartDate: item.scheduledStartDate ? new Date(item.scheduledStartDate) : null,
            scheduledFinishDate: item.scheduledFinishDate ? new Date(item.scheduledFinishDate) : null,
            estimatedDurationHours: item.estimatedDurationHours || null
          },
          create: {
            id: item.id,
            title: item.title,
            areaIds: item.areaIds ? JSON.stringify(item.areaIds) : null,
            inspector: item.inspector,
            date: new Date(item.date),
            status: item.status,
            checklistTemplateId: item.checklistTemplateId || null,
            generalNotes: item.generalNotes || null,
            approvalComments: item.approvalComments || null,
            lastStatusUpdateBy: item.lastStatusUpdateBy || null,
            lastStatusUpdateAt: item.lastStatusUpdateAt ? new Date(item.lastStatusUpdateAt) : null,
            scheduledStartDate: item.scheduledStartDate ? new Date(item.scheduledStartDate) : null,
            scheduledFinishDate: item.scheduledFinishDate ? new Date(item.scheduledFinishDate) : null,
            estimatedDurationHours: item.estimatedDurationHours || null
          }
        });

        // Migrate nested checklist items
        if (item.checklistItems && Array.isArray(item.checklistItems)) {
          for (const sub of item.checklistItems) {
            await prisma.checklistItem.upsert({
              where: { id: sub.id },
              update: {
                inspectionId: item.id,
                text: sub.text,
                status: sub.status,
                isCustom: sub.isCustom ?? false,
                criteria: sub.criteria || null,
                unit: sub.unit || null,
                standardQuantity: sub.standardQuantity || null,
                toleranceOperator: sub.toleranceOperator || null,
                toleranceValue: sub.toleranceValue || null,
                actualQuantity: sub.actualQuantity || null,
                requiredTools: sub.requiredTools || null,
                images: sub.images ? JSON.stringify(sub.images) : null
              },
              create: {
                id: sub.id,
                inspectionId: item.id,
                text: sub.text,
                status: sub.status,
                isCustom: sub.isCustom ?? false,
                criteria: sub.criteria || null,
                unit: sub.unit || null,
                standardQuantity: sub.standardQuantity || null,
                toleranceOperator: sub.toleranceOperator || null,
                toleranceValue: sub.toleranceValue || null,
                actualQuantity: sub.actualQuantity || null,
                requiredTools: sub.requiredTools || null,
                images: sub.images ? JSON.stringify(sub.images) : null
              }
            });

            // Migrate nested findings inside checklist item
            if (sub.findings && Array.isArray(sub.findings)) {
              for (const f of sub.findings) {
                await prisma.finding.upsert({
                  where: { id: f.id },
                  update: {
                    checklistItemId: sub.id,
                    description: f.description,
                    severity: f.severity || null,
                    type: f.type || null,
                    recommendation: f.recommendation || null,
                    linkedDnfId: f.linkedDnfId || null,
                    quantity: f.quantity || null,
                    latitude: f.latitude || null,
                    longitude: f.longitude || null,
                    images: f.images ? JSON.stringify(f.images) : null
                  },
                  create: {
                    id: f.id,
                    checklistItemId: sub.id,
                    description: f.description,
                    severity: f.severity || null,
                    type: f.type || null,
                    recommendation: f.recommendation || null,
                    linkedDnfId: f.linkedDnfId || null,
                    quantity: f.quantity || null,
                    latitude: f.latitude || null,
                    longitude: f.longitude || null,
                    images: f.images ? JSON.stringify(f.images) : null
                  }
                });
              }
            }
          }
        }
      }
    }

    // 5. SystemLogs
    if (db.system_logs && Array.isArray(db.system_logs)) {
      console.log(`- Migrating ${db.system_logs.length} system logs...`);
      for (const log of db.system_logs) {
        await prisma.systemLog.upsert({
          where: { id: log.id },
          update: {
            timestamp: log.timestamp ? new Date(log.timestamp) : new Date(),
            userId: log.userId,
            userName: log.userName,
            action: log.action,
            level: log.level,
            details: log.details || '',
            category: log.category || 'GENERAL'
          },
          create: {
            id: log.id,
            timestamp: log.timestamp ? new Date(log.timestamp) : new Date(),
            userId: log.userId,
            userName: log.userName,
            action: log.action,
            level: log.level,
            details: log.details || '',
            category: log.category || 'GENERAL'
          }
        });
      }
    }

    console.log('\n🚀  Migration completed successfully!');
  } catch (error) {
    console.error('❌  Migration failed:', error);
  } finally {
    await prisma.$disconnect();
    await authPrisma.$disconnect();
  }
}

migrate();
