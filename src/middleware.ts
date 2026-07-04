import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === '/hazards/new') {
    const originatingDnfId = searchParams.get('originatingDnfId');
    const isNormalized = searchParams.get('dnfHazardPrefill') === 'normalized';

    if (originatingDnfId && !isNormalized) {
      const target = request.nextUrl.clone();
      target.pathname = `/dnf/${originatingDnfId}/create-hazard`;
      target.search = '';
      return NextResponse.redirect(target);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/hazards/new'],
};
