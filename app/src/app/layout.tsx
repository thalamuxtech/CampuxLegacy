import type { Metadata, Viewport } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { Toaster } from 'sonner';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['SOFT', 'WONK', 'opsz'],
});

export const metadata: Metadata = {
  title: {
    default: 'CampuxLegacy — Preserving the story of every graduating class',
    template: '%s · CampuxLegacy',
  },
  description:
    'A premium digital yearbook & alumni memory platform for African universities. Capture portraits, memories, and goodwill messages — sealed for life.',
  metadataBase: new URL('https://campuxlegacy.app'),
  openGraph: {
    title: 'CampuxLegacy',
    description: 'The digital yearbook reimagined for Africa.',
    type: 'website',
    siteName: 'CampuxLegacy',
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <Providers>{children}</Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
