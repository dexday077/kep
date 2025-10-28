import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 py-16 mt-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="mb-12">
          <Link href="/" className="inline-block">
            <Image src="/logo/kep_marketplace_logo.svg" alt="Kep Marketplace" width={220} height={70} className="h-16 sm:h-18 w-auto" />
          </Link>
          <p className="mt-4 text-base text-gray-600 max-w-lg font-medium">Avsallar&apos;ın dijital çarşısı. Yerel esnaftan online alışveriş, komşundan sipariş!</p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-sm">
          <div>
            <h3 className="mb-4 font-bold text-gray-900 text-base">Kategoriler</h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                <Link href="/category/restoranlar" className="hover:text-orange-600 transition-colors font-medium">
                  Restoranlar
                </Link>
              </li>
              <li>
                <Link href="/category/market" className="hover:text-orange-600 transition-colors font-medium">
                  Market
                </Link>
              </li>
              <li>
                <Link href="/category/turlar-aktiviteler" className="hover:text-orange-600 transition-colors font-medium">
                  Turlar & Aktiviteler
                </Link>
              </li>
              <li>
                <Link href="/category/elektronik" className="hover:text-orange-600 transition-colors font-medium">
                  Elektronik
                </Link>
              </li>
              <li>
                <Link href="/category/moda" className="hover:text-orange-600 transition-colors font-medium">
                  Moda
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-gray-900 text-base">Müşteri</h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                <Link href="/help" className="hover:text-orange-600 transition-colors font-medium">
                  Yardım
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-orange-600 transition-colors font-medium">
                  İadeler
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-orange-600 transition-colors font-medium">
                  Sipariş Takip
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-orange-600 transition-colors font-medium">
                  Güvenlik
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-orange-600 transition-colors font-medium">
                  Hesabım
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-gray-900 text-base">Kep Marketplace</h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                <Link href="/about" className="hover:text-orange-600 transition-colors font-medium">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-orange-600 transition-colors font-medium">
                  Kariyer
                </Link>
              </li>
              <li>
                <Link href="/press" className="hover:text-orange-600 transition-colors font-medium">
                  Basın
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-600 transition-colors font-medium">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/kitchen" className="hover:text-orange-600 transition-colors font-medium">
                  KepKitchen
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 font-bold text-gray-900 text-base">Hukuk</h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                <Link href="/kvkk" className="hover:text-orange-600 transition-colors font-medium">
                  KVKK
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-orange-600 transition-colors font-medium">
                  Çerez Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-orange-600 transition-colors font-medium">
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link href="/sales" className="hover:text-orange-600 transition-colors font-medium">
                  Mesafeli Satış
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-orange-600 transition-colors font-medium">
                  Gizlilik Politikası
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            <p className="font-medium">© {new Date().getFullYear()} Kep Marketplace. Tüm hakları saklıdır.</p>
            <p className="text-xs mt-1">Avsallar / Alanya - Türkiye</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.875 1.418 2.026 1.418 3.323s-.49 2.448-1.418 3.244c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.928-.175-1.297-.49-.368-.315-.49-.753-.49-1.243 0-.49.122-.928.49-1.243.369-.315.807-.49 1.297-.49s.928.175 1.297.49c.368.315.49.753.49 1.243 0 .49-.122.928-.49 1.243-.369.315-.807.49-1.297.49z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-600 transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956526.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium">Güvenli Ödeme:</span>
              <span className="ml-2">💳 🏦 💰</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
