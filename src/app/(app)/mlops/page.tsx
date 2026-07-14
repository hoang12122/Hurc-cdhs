import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConvergedControlCenter } from '@/components/platform/converged-control-center';

export default function MlopsPage() {
  return (
    <div className="relative">
      <div className="fixed bottom-6 right-6 z-40">
        <Button asChild className="shadow-lg">
          <Link href="/admin/ai-governance/vision-training">
            <BrainCircuit className="mr-2 h-4 w-4" /> Vision Training
          </Link>
        </Button>
      </div>
      <ConvergedControlCenter focus="mlops" />
    </div>
  );
}
