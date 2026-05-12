import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/language-context';
import { AuthProvider } from '@/contexts/auth-context'; 
import { NetworkProvider } from '@/components/providers/network-provider';

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
        <AuthProvider>
          <LanguageProvider>
            <NetworkProvider>
              {children}
              <Toaster />
            </NetworkProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
