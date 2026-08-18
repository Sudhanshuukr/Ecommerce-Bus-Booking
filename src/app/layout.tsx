import type { Metadata } from 'next';
import { fontInter, fontPlusJakarta } from '@/lib/fonts';
import { siteConfig } from '@/config/site';
import { AuthProvider } from '@/features/auth/context/AuthProvider';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontPlusJakarta.variable} ${fontInter.variable}`}
    >
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
