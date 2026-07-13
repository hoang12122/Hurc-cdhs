import { ConvergedControlCenter } from '@/components/platform/converged-control-center';
import { ProductionReadinessPanel } from '@/components/platform/production-readiness-panel';

export default function DataPlatformPage() {
  return (
    <>
      <ConvergedControlCenter focus="data-platform" />
      <ProductionReadinessPanel />
    </>
  );
}
