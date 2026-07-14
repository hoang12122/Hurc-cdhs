import { ConvergedControlCenter } from '@/components/platform/converged-control-center';
import { EtlOperationsPanel } from '@/components/platform/etl-operations-panel';
import { ProductionReadinessPanel } from '@/components/platform/production-readiness-panel';

export default function DataPlatformPage() {
  return (
    <>
      <ConvergedControlCenter focus="data-platform" />
      <EtlOperationsPanel />
      <ProductionReadinessPanel />
    </>
  );
}
