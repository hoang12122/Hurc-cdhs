'use client';

import { Button } from '@/components/ui/button';
import { FilePlus } from 'lucide-react';
import { publishCreateDnfFromInspection } from '@/lib/mfe/service-bus';

interface CreateDnfFromFindingEventButtonProps {
  inspectionId: string;
  findingId?: string;
  description?: string;
  locationOfFailure?: string;
  staffWhoIdentifiedFailure?: string;
  equipmentCode?: string;
  subsystemId?: string;
  label?: string;
}

export function CreateDnfFromFindingEventButton({
  inspectionId,
  findingId,
  description,
  locationOfFailure,
  staffWhoIdentifiedFailure,
  equipmentCode,
  subsystemId,
  label = 'Tạo DNF từ Phát hiện',
}: CreateDnfFromFindingEventButtonProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      className="h-8 text-xs font-normal"
      onClick={() => publishCreateDnfFromInspection({
        originatingInspectionId: inspectionId,
        originatingFindingId: findingId,
        description,
        locationOfFailure,
        staffWhoIdentifiedFailure,
        equipmentCode,
        subsystemId,
      })}
    >
      <FilePlus className="mr-1.5 h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
