'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth-context';
import { useNetwork } from '@/components/providers/network-provider';
import { offlineSync } from '@/lib/services/offline-sync';
import { updateInspection } from '@/lib/actions/inspection.actions';
import {
  INSPECTION_STATUS_TRANSITIONS,
  ROLE_ADMIN_PKTAT,
  type InspectionDetail as AppInspectionDetail,
  type InspectionStatus,
  type UserRole,
} from '@/lib/constants';

interface UseInspectionDetailWorkflowOptions {
  initialInspection: AppInspectionDetail;
  statusUpdateFailedMessage: string;
  statusUpdateSuccessMessage: string;
}

export function useInspectionDetailWorkflow({
  initialInspection,
  statusUpdateFailedMessage,
  statusUpdateSuccessMessage,
}: UseInspectionDetailWorkflowOptions) {
  const { toast } = useToast();
  const { isOnline } = useNetwork();
  const { user: currentUser } = useAuth();
  const userRole = (currentUser?.role || 'Client') as UserRole;
  const userId = currentUser?.id || 'unknown';

  const [inspection, setInspection] = React.useState<AppInspectionDetail>(initialInspection);
  const [approvalComments, setApprovalComments] = React.useState(initialInspection.approvalComments || '');
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const canTransitionToStatus = React.useCallback((currentStatus: InspectionStatus, newStatus: InspectionStatus, role: UserRole): boolean => {
    if (role === ROLE_ADMIN_PKTAT) return true;
    const transitionRule = INSPECTION_STATUS_TRANSITIONS[currentStatus];
    if (!transitionRule) return false;

    if (transitionRule.roles) {
      const allowedForRole = transitionRule.roles[role];
      if (allowedForRole) return allowedForRole.includes(newStatus);
    }

    return transitionRule.next.includes(newStatus);
  }, []);

  const handleStatusUpdate = React.useCallback(async (newStatus: InspectionStatus) => {
    if (!inspection) return;

    if (!canTransitionToStatus(inspection.status as InspectionStatus, newStatus, userRole)) {
      toast({ title: 'Lỗi', description: statusUpdateFailedMessage, variant: 'destructive' });
      return;
    }

    const updatedInspectionData: AppInspectionDetail = {
      ...inspection,
      status: newStatus,
      approvalComments,
      lastStatusUpdateBy: userId,
      lastStatusUpdateAt: new Date().toISOString(),
    };

    if (!isOnline) {
      await offlineSync.addAction({
        type: 'STATUS_UPDATE',
        entityType: 'INSPECTION',
        data: updatedInspectionData,
      });
      setInspection(updatedInspectionData);
      toast({ title: 'Đã lưu ngoại tuyến', description: 'Trạng thái sẽ được cập nhật khi có mạng.' });
      return;
    }

    await updateInspection(updatedInspectionData);
    setInspection(updatedInspectionData);
    toast({ title: 'Thành công', description: statusUpdateSuccessMessage });
  }, [approvalComments, canTransitionToStatus, inspection, isOnline, statusUpdateFailedMessage, statusUpdateSuccessMessage, toast, userId, userRole]);

  return {
    inspection,
    approvalComments,
    setApprovalComments,
    isMounted,
    handleStatusUpdate,
  };
}
