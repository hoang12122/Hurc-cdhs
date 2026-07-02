import { redirect } from 'next/navigation';
import { getDnfById } from '@/lib/actions/dnf.actions';
import { buildDnfToHazardUrl } from '@/lib/fracas/dnf-to-hazard-link';

interface CreateHazardFromDnfPageProps {
  params: {
    id: string;
  };
}

export default async function CreateHazardFromDnfPage({ params }: CreateHazardFromDnfPageProps) {
  const dnf = await getDnfById(params.id);

  if (!dnf) {
    redirect('/dnf');
  }

  redirect(buildDnfToHazardUrl(dnf));
}
