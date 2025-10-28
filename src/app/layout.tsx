import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CartProvider } from '@/context/CartContext';
import { SearchProvider } from '@/context/SearchContext';
import { LoadingProvider } from '@/context/LoadingContext';
import { ToastProvider } from '@/context/ToastContext';
import { AuthProvider } from '@/context/AuthContext';
import LoadingOverlay from '@/components/LoadingOverlay';
import ErrorBoundary from '@/components/ErrorBoundary';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "Kep Marketplace - Avsallar'ın Dijital Çarşısı",
  description: 'Avsallar ve Alanya bölgesinin yerel e-ticaret platformu. Yerel esnaftan online alışveriş, restoranlardan sipariş, turlar ve daha fazlası!',
  keywords: ['Avsallar', 'Alanya', 'yerel market', 'online alışveriş', 'restoran', 'turlar', 'esnaf'],
  authors: [{ name: 'Kep Marketplace' }],
  openGraph: {
    title: "Kep Marketplace - Avsallar'ın Dijital Çarşısı",
    description: 'Yerel esnaftan online alışveriş, komşundan sipariş!',
    type: 'website',
    locale: 'tr_TR',
    images: [
      {
        url: '/logo/kep_marketplace_logo.svg',
        width: 1200,
        height: 630,
        alt: 'Kep Marketplace Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Kep Marketplace - Avsallar'ın Dijital Çarşısı",
    description: 'Yerel esnaftan online alışveriş, komşundan sipariş!',
    images: ['/logo/kep_marketplace_logo.svg'],
  },
  icons: {
    icon: '/logo/kep_marketplace_logo.svg',
    apple: '/logo/kep_marketplace_logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <ErrorBoundary>
          <AuthProvider>
            <ToastProvider>
              <LoadingProvider>
                <CartProvider>
                  <SearchProvider>
                    <Navbar />
                    <main className="flex-1">{children}</main>
                    <Footer />
                    <LoadingOverlay />
                  </SearchProvider>
                </CartProvider>
              </LoadingProvider>
            </ToastProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
