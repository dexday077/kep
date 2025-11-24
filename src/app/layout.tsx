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
  authors: [{ name: 'KEPENEK İNŞAAT SAN. VE TİC. LTD.ŞTİ.' }],
  publisher: 'KEPENEK İNŞAAT SAN. VE TİC. LTD.ŞTİ.',
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
                    {/* Under Construction Banner - Global */}
                    <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-2.5 px-4 shadow-md sticky top-0 z-40">
                      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span className="font-bold text-xs sm:text-sm">⚠️ YAPIM AŞAMASINDA</span>
                        </div>
                        <span className="text-xs opacity-90">Platform geliştirme aşamasındadır. Gösterilen ürünler demo amaçlıdır - Gerçek satış yapılmamaktadır.</span>
                      </div>
                    </div>
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
