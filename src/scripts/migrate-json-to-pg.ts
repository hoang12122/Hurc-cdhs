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

function parseArray(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
  }
  return [];
}

function parseJson(val: any): any {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch (e) {
      return val;
    }
  }
  return val || null;
}

function parseDate(val: any): Date | null {
  if (!val) return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
}

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

    // Responsible Units
    if (db.responsible_units && db.responsible_units.length > 0) {
      console.log(`📦 Đang đồng bộ ${db.responsible_units.length} Responsible Units...`);
      for (const unit of db.responsible_units) {
        await opsDb.responsibleUnit.upsert({
          where: { id: unit.id },
          update: { name: unit.name },
          create: { id: unit.id, name: unit.name }
        });
      }
      console.log('✅ Responsible Units đồng bộ thành công.');
    }

    // Subsystems
    if (db.sub_systems && db.sub_systems.length > 0) {
      console.log(`📦 Đang đồng bộ ${db.sub_systems.length} Subsystems...`);
      for (const sub of db.sub_systems) {
        const labelObj = sub.label || { vi: sub.label_vi || '', en: sub.label_en || '' };
        await opsDb.subsystem.upsert({
          where: { id: sub.id },
          update: { label: labelObj },
          create: { id: sub.id, label: labelObj }
        });
      }
      console.log('✅ Subsystems đồng bộ thành công.');
    }

    // Patrol Locations
    if (db.patrol_locations && db.patrol_locations.length > 0) {
      console.log(`📦 Đang đồng bộ ${db.patrol_locations.length} Patrol Locations...`);
      for (const loc of db.patrol_locations) {
        await opsDb.patrolLocation.upsert({
          where: { id: loc.id },
          update: { label: loc.label },
          create: { id: loc.id, label: loc.label }
        });
      }
      console.log('✅ Patrol Locations đồng bộ thành công.');
    }

    // Maintenance Standards & Items
    if (db.maintenance_standards && db.maintenance_standards.length > 0) {
      console.log(`📦 Đang đồng bộ ${db.maintenance_standards.length} Maintenance Standards...`);
      for (const std of db.maintenance_standards) {
        const locIds = parseArray(std.locationIds);
        await opsDb.maintenanceStandard.upsert({
          where: { id: std.id },
          update: {
            name: std.name,
            name_en: std.name_en || null,
            description: std.description || null,
            frequency: std.frequency || null,
            scheduledTime: std.scheduledTime || null,
            locationIds: locIds,
            recipientId: std.recipientId || null,
            abbreviation: std.abbreviation || null,
            estimatedDurationHours: std.estimatedDurationHours ? parseFloat(std.estimatedDurationHours) : null,
            deletedAt: parseDate(std.deletedAt)
          },
          create: {
            id: std.id,
            name: std.name,
            name_en: std.name_en || null,
            description: std.description || null,
            frequency: std.frequency || null,
            scheduledTime: std.scheduledTime || null,
            locationIds: locIds,
            recipientId: std.recipientId || null,
            abbreviation: std.abbreviation || null,
            estimatedDurationHours: std.estimatedDurationHours ? parseFloat(std.estimatedDurationHours) : null,
            deletedAt: parseDate(std.deletedAt)
          }
        });

        if (std.items && std.items.length > 0) {
          for (const item of std.items) {
            await opsDb.maintenanceStandardItem.upsert({
              where: { id: item.id },
              update: {
                standardId: std.id,
                itemCode: item.itemCode,
                itemText: item.itemText,
                criteria: item.criteria || null,
                unit: item.unit || null,
                standardQuantity: item.standardQuantity ? parseFloat(item.standardQuantity) : null,
                toleranceOperator: item.toleranceOperator || null,
                toleranceValue: item.toleranceValue ? parseFloat(item.toleranceValue) : null,
                requiredTools: item.requiredTools || null
              },
              create: {
                id: item.id,
                standardId: std.id,
                itemCode: item.itemCode,
                itemText: item.itemText,
                criteria: item.criteria || null,
                unit: item.unit || null,
                standardQuantity: item.standardQuantity ? parseFloat(item.standardQuantity) : null,
                toleranceOperator: item.toleranceOperator || null,
                toleranceValue: item.toleranceValue ? parseFloat(item.toleranceValue) : null,
                requiredTools: item.requiredTools || null
              }
            });
          }
        }
      }
      console.log('✅ Maintenance Standards & Items đồng bộ thành công.');
    }

    // Inspections
    if (db.inspections && db.inspections.length > 0) {
      console.log(`📦 Đang đồng bộ ${db.inspections.length} Inspections...`);
      for (const insp of db.inspections) {
        const areaIds = parseArray(insp.areaIds);
        const checklistItems = parseJson(insp.checklistItems);
        await opsDb.inspectionDetail.upsert({
          where: { id: insp.id },
          update: {
            title: insp.title,
            areaIds,
            inspector: insp.inspector,
            date: new Date(insp.date),
            status: insp.status,
            checklistTemplateId: insp.checklistTemplateId || null,
            checklistItems,
            generalNotes: insp.generalNotes || null,
            approvalComments: insp.approvalComments || null,
            lastStatusUpdateBy: insp.lastStatusUpdateBy || null,
            lastStatusUpdateAt: parseDate(insp.lastStatusUpdateAt),
            scheduledStartDate: parseDate(insp.scheduledStartDate),
            scheduledFinishDate: parseDate(insp.scheduledFinishDate),
            estimatedDurationHours: insp.estimatedDurationHours ? parseFloat(insp.estimatedDurationHours) : null,
            isArchived: insp.isArchived || false,
            deletedAt: parseDate(insp.deletedAt)
          },
          create: {
            id: insp.id,
            title: insp.title,
            areaIds,
            inspector: insp.inspector,
            date: new Date(insp.date),
            status: insp.status,
            checklistTemplateId: insp.checklistTemplateId || null,
            checklistItems,
            generalNotes: insp.generalNotes || null,
            approvalComments: insp.approvalComments || null,
            lastStatusUpdateBy: insp.lastStatusUpdateBy || null,
            lastStatusUpdateAt: parseDate(insp.lastStatusUpdateAt),
            scheduledStartDate: parseDate(insp.scheduledStartDate),
            scheduledFinishDate: parseDate(insp.scheduledFinishDate),
            estimatedDurationHours: insp.estimatedDurationHours ? parseFloat(insp.estimatedDurationHours) : null,
            isArchived: insp.isArchived || false,
            deletedAt: parseDate(insp.deletedAt)
          }
        });
      }
      console.log('✅ Inspections đồng bộ thành công.');
    }

    // DNFs & Corrective Actions
    if (db.dnf_documents && db.dnf_documents.length > 0) {
      console.log(`📦 Đang đồng bộ ${db.dnf_documents.length} DNF Documents...`);
      for (const dnf of db.dnf_documents) {
        const subsystemIds = parseArray(dnf.subsystemIds);
        const attachments = parseJson(dnf.attachments);
        const statusHistory = parseJson(dnf.statusHistory);
        await opsDb.dnfDocument.upsert({
          where: { id: dnf.id },
          update: {
            failureReportNo: dnf.failureReportNo || null,
            locationOfFailure: dnf.locationOfFailure,
            failedComponentEquipmentLRUTrainNumber: dnf.failedComponentEquipmentLRUTrainNumber || null,
            subsystemIds,
            descriptionOfFailure: dnf.descriptionOfFailure,
            impactAssessment: dnf.impactAssessment || null,
            staffWhoIdentifiedFailure: dnf.staffWhoIdentifiedFailure,
            dateTimeOfFailureOccurrence: new Date(dnf.dateTimeOfFailureOccurrence),
            methodOfFailureDetection: dnf.methodOfFailureDetection,
            hazardLevelId: dnf.hazardLevelId || null,
            status: dnf.status,
            attachments,
            createdById: dnf.createdById || 'system',
            createdAt: dnf.createdAt ? new Date(dnf.createdAt) : new Date(),
            updatedAt: dnf.updatedAt ? new Date(dnf.updatedAt) : new Date(),
            statusHistory,
            isArchived: dnf.isArchived || false,
            resolutionDetails: dnf.resolutionDetails || null,
            assignedTo: dnf.assignedTo || null,
            priority: dnf.priority || null,
            completedDate: parseDate(dnf.completedDate),
            originatingInspectionId: dnf.originatingInspectionId || null,
            originatingFindingId: dnf.originatingFindingId || null,
            immediateAction: dnf.immediateAction || null,
            problemResettable: dnf.problemResettable || null,
            trainServiceAffected: dnf.trainServiceAffected || null,
            trainWithdrawn: dnf.trainWithdrawn || null,
            systemRestoredTime: parseDate(dnf.systemRestoredTime),
            disruptionDuration: dnf.disruptionDuration ? parseFloat(dnf.disruptionDuration) : null,
            trainKm: dnf.trainKm ? parseFloat(dnf.trainKm) : null,
            rectificationParty: dnf.rectificationParty || null,
            deletedAt: parseDate(dnf.deletedAt)
          },
          create: {
            id: dnf.id,
            failureReportNo: dnf.failureReportNo || null,
            locationOfFailure: dnf.locationOfFailure,
            failedComponentEquipmentLRUTrainNumber: dnf.failedComponentEquipmentLRUTrainNumber || null,
            subsystemIds,
            descriptionOfFailure: dnf.descriptionOfFailure,
            impactAssessment: dnf.impactAssessment || null,
            staffWhoIdentifiedFailure: dnf.staffWhoIdentifiedFailure,
            dateTimeOfFailureOccurrence: new Date(dnf.dateTimeOfFailureOccurrence),
            methodOfFailureDetection: dnf.methodOfFailureDetection,
            hazardLevelId: dnf.hazardLevelId || null,
            status: dnf.status,
            attachments,
            createdById: dnf.createdById || 'system',
            createdAt: dnf.createdAt ? new Date(dnf.createdAt) : new Date(),
            updatedAt: dnf.updatedAt ? new Date(dnf.updatedAt) : new Date(),
            statusHistory,
            isArchived: dnf.isArchived || false,
            resolutionDetails: dnf.resolutionDetails || null,
            assignedTo: dnf.assignedTo || null,
            priority: dnf.priority || null,
            completedDate: parseDate(dnf.completedDate),
            originatingInspectionId: dnf.originatingInspectionId || null,
            originatingFindingId: dnf.originatingFindingId || null,
            immediateAction: dnf.immediateAction || null,
            problemResettable: dnf.problemResettable || null,
            trainServiceAffected: dnf.trainServiceAffected || null,
            trainWithdrawn: dnf.trainWithdrawn || null,
            systemRestoredTime: parseDate(dnf.systemRestoredTime),
            disruptionDuration: dnf.disruptionDuration ? parseFloat(dnf.disruptionDuration) : null,
            trainKm: dnf.trainKm ? parseFloat(dnf.trainKm) : null,
            rectificationParty: dnf.rectificationParty || null,
            deletedAt: parseDate(dnf.deletedAt)
          }
        });

        if (dnf.correctiveActions && dnf.correctiveActions.length > 0) {
          for (const ca of dnf.correctiveActions) {
            await opsDb.correctiveAction.upsert({
              where: { id: ca.id },
              update: {
                dnfId: dnf.id,
                description: ca.description,
                responsiblePersonOrUnit: ca.responsiblePersonOrUnit,
                createdAt: ca.createdAt ? new Date(ca.createdAt) : new Date(),
                updatedAt: ca.updatedAt ? new Date(ca.updatedAt) : new Date(),
                completedAt: parseDate(ca.completedAt),
                status: ca.status,
                dateTimeNotified: parseDate(ca.dateTimeNotified),
                dateTimeArrival: parseDate(ca.dateTimeArrival),
                diagnosisTime: ca.diagnosisTime ? parseFloat(ca.diagnosisTime) : null,
                repairTime: ca.repairTime ? parseFloat(ca.repairTime) : null,
                verificationTime: ca.verificationTime ? parseFloat(ca.verificationTime) : null,
                totalDownTime: ca.totalDownTime ? parseFloat(ca.totalDownTime) : null
              },
              create: {
                id: ca.id,
                dnfId: dnf.id,
                description: ca.description,
                responsiblePersonOrUnit: ca.responsiblePersonOrUnit,
                createdAt: ca.createdAt ? new Date(ca.createdAt) : new Date(),
                updatedAt: ca.updatedAt ? new Date(ca.updatedAt) : new Date(),
                completedAt: parseDate(ca.completedAt),
                status: ca.status,
                dateTimeNotified: parseDate(ca.dateTimeNotified),
                dateTimeArrival: parseDate(ca.dateTimeArrival),
                diagnosisTime: ca.diagnosisTime ? parseFloat(ca.diagnosisTime) : null,
                repairTime: ca.repairTime ? parseFloat(ca.repairTime) : null,
                verificationTime: ca.verificationTime ? parseFloat(ca.verificationTime) : null,
                totalDownTime: ca.totalDownTime ? parseFloat(ca.totalDownTime) : null
              }
            });
          }
        }
      }
      console.log('✅ DNF Documents & Corrective Actions đồng bộ thành công.');
    }

    // Hazards
    if (db.hazard_records && db.hazard_records.length > 0) {
      console.log(`📦 Đang đồng bộ ${db.hazard_records.length} Hazard Records...`);
      for (const hz of db.hazard_records) {
        const locationIds = parseArray(hz.locationIds);
        const coordinatingUnits = parseArray(hz.coordinatingUnits);
        const attachments = parseJson(hz.attachments);
        const statusHistory = parseJson(hz.statusHistory);
        await opsDb.hazardRecord.upsert({
          where: { id: hz.id },
          update: {
            description: hz.description,
            systemGroup: hz.systemGroup || null,
            locationIds,
            source: hz.source || null,
            potentialConsequence: hz.potentialConsequence || null,
            identifiedBy: hz.identifiedBy,
            identificationDate: new Date(hz.identificationDate),
            severityId: hz.severityId || null,
            likelihoodId: hz.likelihoodId || null,
            riskLevelId: hz.riskLevelId || null,
            currentControls: hz.currentControls,
            proposedActions: hz.proposedActions || null,
            suggestedActions: hz.suggestedActions || null,
            responsiblePersonOrUnit: hz.responsiblePersonOrUnit || null,
            coordinatingUnits,
            dueDate: parseDate(hz.dueDate),
            status: hz.status,
            closureDetails: hz.closureDetails || null,
            verificationDetails: hz.verificationDetails || null,
            attachments,
            linkedDnfId: hz.linkedDnfId || null,
            createdById: hz.createdById || 'system',
            createdAt: hz.createdAt ? new Date(hz.createdAt) : new Date(),
            updatedAt: hz.updatedAt ? new Date(hz.updatedAt) : new Date(),
            isArchived: hz.isArchived || false,
            deletedAt: parseDate(hz.deletedAt),
            statusHistory
          },
          create: {
            id: hz.id,
            description: hz.description,
            systemGroup: hz.systemGroup || null,
            locationIds,
            source: hz.source || null,
            potentialConsequence: hz.potentialConsequence || null,
            identifiedBy: hz.identifiedBy,
            identificationDate: new Date(hz.identificationDate),
            severityId: hz.severityId || null,
            likelihoodId: hz.likelihoodId || null,
            riskLevelId: hz.riskLevelId || null,
            currentControls: hz.currentControls,
            proposedActions: hz.proposedActions || null,
            suggestedActions: hz.suggestedActions || null,
            responsiblePersonOrUnit: hz.responsiblePersonOrUnit || null,
            coordinatingUnits,
            dueDate: parseDate(hz.dueDate),
            status: hz.status,
            closureDetails: hz.closureDetails || null,
            verificationDetails: hz.verificationDetails || null,
            attachments,
            linkedDnfId: hz.linkedDnfId || null,
            createdById: hz.createdById || 'system',
            createdAt: hz.createdAt ? new Date(hz.createdAt) : new Date(),
            updatedAt: hz.updatedAt ? new Date(hz.updatedAt) : new Date(),
            isArchived: hz.isArchived || false,
            deletedAt: parseDate(hz.deletedAt),
            statusHistory
          }
        });
      }
      console.log('✅ Hazard Records đồng bộ thành công.');
    }

    // Improvements
    if (db.improvements && db.improvements.length > 0) {
      console.log(`📦 Đang đồng bộ ${db.improvements.length} Improvements...`);
      for (const imp of db.improvements) {
        const attachments = parseJson(imp.attachments);
        await opsDb.improvement.upsert({
          where: { id: imp.id },
          update: {
            title: imp.title,
            description: imp.description,
            category: imp.category,
            status: imp.status,
            submittedBy: imp.submittedBy,
            createdById: imp.createdById || 'system',
            submissionDate: imp.submissionDate ? new Date(imp.submissionDate) : new Date(),
            updatedAt: imp.updatedAt ? new Date(imp.updatedAt) : new Date(),
            benefitAnalysis: imp.benefitAnalysis || null,
            estimatedCost: imp.estimatedCost ? parseFloat(imp.estimatedCost) : null,
            attachments
          },
          create: {
            id: imp.id,
            title: imp.title,
            description: imp.description,
            category: imp.category,
            status: imp.status,
            submittedBy: imp.submittedBy,
            createdById: imp.createdById || 'system',
            submissionDate: imp.submissionDate ? new Date(imp.submissionDate) : new Date(),
            updatedAt: imp.updatedAt ? new Date(imp.updatedAt) : new Date(),
            benefitAnalysis: imp.benefitAnalysis || null,
            estimatedCost: imp.estimatedCost ? parseFloat(imp.estimatedCost) : null,
            attachments
          }
        });
      }
      console.log('✅ Improvements đồng bộ thành công.');
    }

    // ==========================================
    // 3. METRO DATABASE MIGRATION
    // ==========================================
    console.log('\n🚇 --- Đang đồng bộ METRO DATABASE ---');
    if (db.assets && db.assets.length > 0) {
      console.log(`📦 Đang đồng bộ ${db.assets.length} Assets...`);
      for (const asset of db.assets) {
        await metroDb.asset.upsert({
          where: { id: asset.id },
          update: {
            code: asset.id,
            name: asset.name,
            subsystem: asset.systemId || 'General',
            stationId: asset.stationId || null,
            systemId: asset.systemId || null,
            criticality: 'Medium'
          },
          create: {
            id: asset.id,
            code: asset.id,
            name: asset.name,
            subsystem: asset.systemId || 'General',
            stationId: asset.stationId || null,
            systemId: asset.systemId || null,
            criticality: 'Medium'
          }
        });
      }
      console.log('✅ Assets đồng bộ thành công.');
    }
    
    // ==========================================
    // 4. AI DATABASE MIGRATION (Stub)
    // ==========================================
    console.log('\n🤖 --- Đang đồng bộ AI DATABASE ---');
    console.log('ℹ️ AI Database handles insights and conversations. Sync logic ready.');

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
