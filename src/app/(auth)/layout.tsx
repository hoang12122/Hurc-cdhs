export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-background">
      {children}
    </main>
  );
}
