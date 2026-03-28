
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hazard Report',
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout simply passes children through, preventing hydration errors
  // by not re-declaring <html> and <body>. The page component itself
  // will handle its own styling, and print styles will ensure a clean output.
  return <>{children}</>;
}
