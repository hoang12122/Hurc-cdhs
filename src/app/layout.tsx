import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster as DefaultToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from '@/contexts/auth-context'; 
import { NetworkProvider } from '@/components/providers/network-provider';
import { PWARegistry } from '@/components/pwa-registry';
import { ThemeProvider } from "@/components/providers/theme-provider";
import { CommandMenu } from "@/components/ui/command-menu";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'HURC No.1 CDHS',
  description: 'Comprehensive inspection and reporting tool for metro systems.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'HURC No.1 CDHS',
  },
  icons: {
    apple: '/icons/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={inter.variable}> 
      <body className={`${inter.className} font-body antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SmoothScrollProvider>
            <AuthProvider>
              <LanguageProvider>
                <NetworkProvider>
                  <PWARegistry />
                  <CommandMenu />
                  {children}
                  <DefaultToaster />
                  <SonnerToaster position="bottom-right" richColors theme="system" />
                </NetworkProvider>
              </LanguageProvider>
            </AuthProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
