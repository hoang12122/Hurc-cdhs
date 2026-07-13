import { ConvergedControlCenter } from '@/components/platform/converged-control-center';
import { ProductionReadinessPanel } from '@/components/platform/production-readiness-panel';

export default function EvidenceLedgerPage() {
  return (
    <>
      <ConvergedControlCenter focus="evidence-ledger" />
      <ProductionReadinessPanel />
    </>
  );
}
