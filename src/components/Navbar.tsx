'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { ApiService } from '@/lib/api';

export default function Navbar() {
  const { count } = useCartStore();
  const pathname = usePathname();
  const router = useRouter();
  const isKitchen = pathname?.startsWith('/kitchen');
  const { user, userRole, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Array<{ name: string; slug: string }>>([]);
  const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  // Mega menu kategori yapısı (statik - daha sonra API'den çekilebilir)
  const megaMenuCategories = [
    {
      title: 'Kadın',
      slug: 'kadin',
      subcategories: [
        {
          groupTitle: 'Giyim',
          items: [
            { name: 'Elbise', slug: 'kadin-elbise' },
            { name: 'Tişört', slug: 'kadin-tisort' },
            { name: 'Gömlek', slug: 'kadin-gomlek' },
            { name: 'Kot Pantolon', slug: 'kadin-kot-pantolon' },
            { name: 'Kot Ceket', slug: 'kadin-kot-ceket' },
            { name: 'Pantolon', slug: 'kadin-pantolon' },
            { name: 'Mont', slug: 'kadin-mont' },
            { name: 'Bluz', slug: 'kadin-bluz' },
            { name: 'Ceket', slug: 'kadin-ceket' },
            { name: 'Etek', slug: 'kadin-etek' },
            { name: 'Kazak', slug: 'kadin-kazak' },
            { name: 'Tesettür', slug: 'kadin-tesettur' },
            { name: 'Büyük Beden', slug: 'kadin-buyuk-beden' },
            { name: 'Trençkot', slug: 'kadin-trenckot' },
            { name: 'Yağmurluk & Rüzgarlık', slug: 'kadin-yagmurluk' },
            { name: 'Sweatshirt', slug: 'kadin-sweatshirt' },
            { name: 'Kaban', slug: 'kadin-kaban' },
            { name: 'Hırka', slug: 'kadin-hirka' },
          ],
        },
        {
          groupTitle: 'Ayakkabı',
          items: [
            { name: 'Topuklu Ayakkabı', slug: 'kadin-topuklu' },
            { name: 'Sneaker', slug: 'kadin-sneaker' },
            { name: 'Günlük Ayakkabı', slug: 'kadin-gunluk-ayakkabi' },
            { name: 'Babet', slug: 'kadin-babet' },
            { name: 'Sandalet', slug: 'kadin-sandalet' },
            { name: 'Bot', slug: 'kadin-bot' },
            { name: 'Çizme', slug: 'kadin-cizme' },
          ],
        },
        {
          groupTitle: 'Çanta & Aksesuar',
          items: [
            { name: 'Çanta', slug: 'kadin-canta' },
            { name: 'Saat', slug: 'kadin-saat' },
            { name: 'Takı', slug: 'kadin-taki' },
            { name: 'Cüzdan', slug: 'kadin-cuzdan' },
            { name: 'Şal', slug: 'kadin-sal' },
            { name: 'Şapka', slug: 'kadin-sapka' },
          ],
        },
      ],
    },
    {
      title: 'Erkek',
      slug: 'erkek',
      subcategories: [
        {
          groupTitle: 'Giyim',
          items: [
            { name: 'Tişört', slug: 'erkek-tisort' },
            { name: 'Gömlek', slug: 'erkek-gomlek' },
            { name: 'Kot Pantolon', slug: 'erkek-kot-pantolon' },
            { name: 'Pantolon', slug: 'erkek-pantolon' },
            { name: 'Mont', slug: 'erkek-mont' },
            { name: 'Ceket', slug: 'erkek-ceket' },
            { name: 'Kazak', slug: 'erkek-kazak' },
            { name: 'Sweatshirt', slug: 'erkek-sweatshirt' },
            { name: 'Hoodie', slug: 'erkek-hoodie' },
            { name: 'Eşofman', slug: 'erkek-esofman' },
            { name: 'Kısa Kollu', slug: 'erkek-kisa-kollu' },
            { name: 'Uzun Kollu', slug: 'erkek-uzun-kollu' },
          ],
        },
        {
          groupTitle: 'Ayakkabı',
          items: [
            { name: 'Spor Ayakkabı', slug: 'erkek-spor-ayakkabi' },
            { name: 'Klasik Ayakkabı', slug: 'erkek-klasik' },
            { name: 'Bot', slug: 'erkek-bot' },
            { name: 'Sandalet', slug: 'erkek-sandalet' },
            { name: 'Terlik', slug: 'erkek-terlik' },
          ],
        },
      ],
    },
    {
      title: 'Anne & Çocuk',
      slug: 'anne-cocuk',
      subcategories: [
        {
          groupTitle: 'Bebek',
          items: [
            { name: 'Bebek Giyim', slug: 'bebek-giyim' },
            { name: 'Bebek Bezi', slug: 'bebek-bezi' },
            { name: 'Bebek Bakım', slug: 'bebek-bakim' },
            { name: 'Bebek Arabası', slug: 'bebek-arabasi' },
          ],
        },
        {
          groupTitle: 'Çocuk',
          items: [
            { name: 'Çocuk Giyim', slug: 'cocuk-giyim' },
            { name: 'Çocuk Ayakkabı', slug: 'cocuk-ayakkabi' },
            { name: 'Oyuncak', slug: 'oyuncak' },
            { name: 'Okul Çantası', slug: 'okul-cantasi' },
          ],
        },
      ],
    },
    {
      title: 'Ev & Yaşam',
      slug: 'ev-yasam',
      subcategories: [
        {
          groupTitle: 'Mobilya',
          items: [
            { name: 'Yatak Odası', slug: 'yatak-odasi' },
            { name: 'Oturma Odası', slug: 'oturma-odasi' },
            { name: 'Yemek Odası', slug: 'yemek-odasi' },
            { name: 'Ofis Mobilyası', slug: 'ofis-mobilyasi' },
          ],
        },
        {
          groupTitle: 'Ev Tekstili',
          items: [
            { name: 'Yatak Takımları', slug: 'yatak-takimlari' },
            { name: 'Perde', slug: 'perde' },
            { name: 'Halı', slug: 'hali' },
            { name: 'Nevresim', slug: 'nevresim' },
          ],
        },
        {
          groupTitle: 'Mutfak',
          items: [
            { name: 'Tencere & Tava', slug: 'tencere-tava' },
            { name: 'Bardak', slug: 'bardak' },
            { name: 'Tabak', slug: 'tabak' },
            { name: 'Mutfak Gereçleri', slug: 'mutfak-gerecleri' },
          ],
        },
      ],
    },
    {
      title: 'Süpermarket',
      slug: 'supermarket',
      subcategories: [
        {
          groupTitle: 'Gıda',
          items: [
            { name: 'Kahvaltılık', slug: 'kahvaltilik' },
            { name: 'İçecek', slug: 'icecek' },
            { name: 'Atıştırmalık', slug: 'atistirmalik' },
            { name: 'Konserve', slug: 'konserve' },
          ],
        },
      ],
    },
    {
      title: 'Kozmetik',
      slug: 'kozmetik',
      subcategories: [
        {
          groupTitle: 'Kozmetik',
          items: [
            { name: 'Parfüm', slug: 'parfum' },
            { name: 'Göz Makyajı', slug: 'goz-makyaji' },
            { name: 'Cilt Bakım', slug: 'cilt-bakim' },
            { name: 'Saç Bakımı', slug: 'sac-bakimi' },
            { name: 'Makyaj', slug: 'makyaj' },
            { name: 'Ağız Bakım', slug: 'agiz-bakim' },
            { name: 'Vücut Bakım', slug: 'vucut-bakim' },
            { name: 'Duş Jeli & Kremleri', slug: 'dus-jeli-kremleri' },
            { name: 'Epilasyon Ürünleri', slug: 'epilasyon-urunleri' },
            { name: 'Ruj', slug: 'ruj' },
            { name: 'Dudak Nemlendirici', slug: 'dudak-nemlendirici' },
            { name: 'Aydınlatıcı & Highlighter', slug: 'aydinlatici-highlighter' },
            { name: 'Eyeliner', slug: 'eyeliner' },
            { name: 'Ten Makyajı', slug: 'ten-makyaji' },
            { name: 'Manikür & Pedikür', slug: 'manikur-pedikur' },
            { name: 'BB & CC Krem', slug: 'bb-cc-krem' },
          ],
        },
      ],
    },
    {
      title: 'Ayakkabı & Çanta',
      slug: 'ayakkabi-canta',
      subcategories: [
        {
          groupTitle: 'Ayakkabı',
          items: [
            { name: 'Topuklu Ayakkabı', slug: 'topuklu-ayakkabi' },
            { name: 'Sneaker', slug: 'sneaker' },
            { name: 'Günlük Ayakkabı', slug: 'gunluk-ayakkabi' },
            { name: 'Babet', slug: 'babet' },
            { name: 'Sandalet', slug: 'sandalet' },
            { name: 'Bot', slug: 'bot' },
            { name: 'Çizme', slug: 'cizme' },
            { name: 'Kar Botu', slug: 'kar-botu' },
            { name: 'Loafer', slug: 'loafer' },
          ],
        },
        {
          groupTitle: 'Çanta',
          items: [
            { name: 'Omuz Çantası', slug: 'omuz-cantasi' },
            { name: 'Sırt Çantası', slug: 'sirt-cantasi' },
            { name: 'Bel Çantası', slug: 'bel-cantasi' },
            { name: 'Okul Çantası', slug: 'okul-cantasi' },
            { name: 'Laptop Çantası', slug: 'laptop-cantasi' },
            { name: 'El Çantası', slug: 'el-cantasi' },
            { name: 'Tote Çanta', slug: 'tote-canta' },
            { name: 'Postacı Çantası', slug: 'postaci-cantasi' },
          ],
        },
      ],
    },
    {
      title: 'Elektronik',
      slug: 'elektronik',
      subcategories: [
        {
          groupTitle: 'Elektronik',
          items: [
            { name: 'Telefon', slug: 'telefon' },
            { name: 'Tablet', slug: 'tablet' },
            { name: 'Laptop', slug: 'laptop' },
            { name: 'Bilgisayar', slug: 'bilgisayar' },
            { name: 'TV', slug: 'tv' },
            { name: 'Kulaklık', slug: 'kulaklik' },
            { name: 'Hoparlör', slug: 'hoparlor' },
            { name: 'Kamera', slug: 'kamera' },
          ],
        },
      ],
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await ApiService.getCategories();
        const formattedCategories = Array.isArray(categoriesData)
          ? categoriesData.map((cat: any) => ({
              name: cat.name,
              slug: cat.slug,
            }))
          : [];
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
        // Fallback categories
        setCategories([
          { name: 'Elektronik', slug: 'electronics' },
          { name: 'Moda', slug: 'fashion' },
          { name: 'Ev & Yaşam', slug: 'home' },
          { name: 'Spor', slug: 'sports' },
          { name: 'Kozmetik', slug: 'cosmetics' },
          { name: 'Ayakkabı & Çanta', slug: 'shoes' },
        ]);
      }
    };

    if (!isKitchen) {
      loadCategories();
    }
  }, [isKitchen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Utility Bar - Trendyol Style */}
      <div className="hidden md:block bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end h-9 items-center gap-6 text-xs text-gray-600">
            <Link href="/coupons" className="hover:text-orange-600 transition-colors">
              İndirim Kuponlarım
            </Link>
            <Link href="/seller/register" className="hover:text-orange-600 transition-colors">
              Kep&apos;te Satış Yap
            </Link>
            <Link href="/about" className="hover:text-orange-600 transition-colors">
              Hakkımızda
            </Link>
            <Link href="/help" className="hover:text-orange-600 transition-colors">
              Yardım & Destek
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header - Trendyol Style */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between gap-2 md:gap-4">
            {!isKitchen && (
              <>
                {/* Mobile Hamburger Menu */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded transition-colors"
                  aria-label="Menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showMobileMenu ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>

                {/* Logo - Left - Trendyol Style */}
                <div className="flex-shrink-0">
                  <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
                    <Image src="/logo/kep_marketplace_logo.svg" alt="Kep Marketplace" width={180} height={50} className="h-8 md:h-12 w-auto" priority />
                  </Link>
                </div>

                {/* Search Bar - Center - Hidden on Mobile */}
                <div className="hidden md:flex flex-1 max-w-2xl">
                  <div className="relative w-full">
                    <div className="flex items-center bg-gray-50 rounded-lg border border-transparent hover:border-gray-300 focus-within:border-orange-500 transition-all">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Aradığınız ürün, kategori veya markayı yazınız"
                        className="flex-1 h-12 bg-transparent outline-none px-4 text-sm placeholder:text-gray-400"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSearch();
                        }}
                      />
                      <button onClick={handleSearch} className="h-12 w-12 flex items-center justify-center bg-orange-600 hover:bg-orange-700 rounded-r-lg transition-colors">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile Actions - Right */}
                <div className="flex md:hidden items-center gap-1 flex-shrink-0">
                  {/* Mobile Favorilerim */}
                  <Link href="/favorites" className="p-2 text-gray-700 hover:text-orange-600 transition-colors relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </Link>

                  {/* Mobile Sepetim */}
                  <Link href="/cart" className="p-2 text-gray-700 hover:text-orange-600 transition-colors relative">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {count > 0 && (
                      <span className="absolute top-1 right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold text-white">
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </Link>
                </div>

                {/* User Actions - Right - Desktop */}
                <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                  {/* Hesabım */}
                  {user ? (
                    <div className="relative">
                      <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex flex-col items-center justify-center h-16 px-3 hover:bg-gray-50 transition-colors rounded-md group">
                        <svg className="w-6 h-6 text-gray-700 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs text-gray-700 group-hover:text-orange-600 mt-0.5 font-medium">Hesabım</span>
                      </button>

                      {showUserMenu && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                          <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-xl ring-1 ring-black ring-opacity-5 z-50">
                            <div className="p-2">
                              <div className="px-3 py-2 text-sm border-b border-gray-100">
                                <div className="font-semibold text-gray-900 truncate">{user.email?.split('@')[0]}</div>
                                <div className="text-xs text-gray-500">{user.email}</div>
                              </div>
                              <Link href="/account" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-50 mt-1" onClick={() => setShowUserMenu(false)}>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Hesabım
                              </Link>
                              {(userRole === 'admin' || userRole === 'seller') && (
                                <Link href="/admin" className="flex items-center px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>
                                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  Admin Panel
                                </Link>
                              )}
                              <hr className="my-1" />
                              <button
                                onClick={async () => {
                                  await signOut();
                                  setShowUserMenu(false);
                                  router.push('/');
                                }}
                                className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded hover:bg-red-50"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Çıkış Yap
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <Link href="/auth/login" className="flex flex-col items-center justify-center h-16 px-3 hover:bg-gray-50 transition-colors rounded-md group">
                      <svg className="w-6 h-6 text-gray-700 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-xs text-gray-700 group-hover:text-orange-600 mt-0.5 font-medium">Hesabım</span>
                    </Link>
                  )}

                  {/* Favorilerim */}
                  <Link href="/favorites" className="flex flex-col items-center justify-center h-16 px-3 hover:bg-gray-50 transition-colors rounded-md group">
                    <svg className="w-6 h-6 text-gray-700 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-xs text-gray-700 group-hover:text-orange-600 mt-0.5 font-medium">Favorilerim</span>
                  </Link>

                  {/* Sepetim */}
                  <Link href="/cart" className="relative flex flex-col items-center justify-center h-16 px-3 hover:bg-gray-50 transition-colors rounded-md group">
                    <svg className="w-6 h-6 text-gray-700 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-xs text-gray-700 group-hover:text-orange-600 mt-0.5 font-medium">Sepetim</span>
                    {count > 0 && <span className="absolute top-2 right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1.5 text-[10px] font-bold text-white">{count > 99 ? '99+' : count}</span>}
                  </Link>
                </div>
              </>
            )}
            {isKitchen && (
              <div className="flex items-center gap-3">
                <Link href="/kitchen" className="shrink-0 font-semibold tracking-tight text-xl">
                  Kep<span className="text-orange-600">Kitchen</span>
                </Link>
                <Link href="/" className="text-sm text-orange-600 hover:underline">
                  ← Kep Marketplace&apos;a dön
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && !isKitchen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
          
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto">
            <div className="p-4">
              {/* Close Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Mobile Search Bar */}
              <div className="mb-4">
                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-300">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ara..."
                    className="flex-1 h-10 bg-transparent outline-none px-3 text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch();
                        setShowMobileMenu(false);
                      }
                    }}
                  />
                  <button onClick={() => { handleSearch(); setShowMobileMenu(false); }} className="h-10 w-10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile Categories */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <button
                  onClick={() => setShowMobileCategories(!showMobileCategories)}
                  className="w-full flex items-center justify-between py-2 text-sm font-semibold text-gray-900"
                >
                  <span>Tüm Kategoriler</span>
                  <svg className={`w-5 h-5 transition-transform ${showMobileCategories ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showMobileCategories && (
                  <div className="mt-2 space-y-1">
                    {megaMenuCategories.map((mainCategory) => (
                      <div key={mainCategory.slug} className="border-l-2 border-gray-100 pl-3">
                        <Link
                          href={`/category/${mainCategory.slug}`}
                          className="block py-2 text-sm font-medium text-gray-900"
                          onClick={() => setShowMobileMenu(false)}
                        >
                          {mainCategory.title}
                        </Link>
                        <div className="ml-3 space-y-1">
                          {mainCategory.subcategories.map((subgroup, subIdx) => (
                            <div key={subIdx} className="space-y-1">
                              <div className="text-xs font-semibold text-orange-600 mt-2 mb-1 uppercase">
                                {subgroup.groupTitle}
                              </div>
                              {subgroup.items.slice(0, 5).map((item) => (
                                <Link
                                  key={item.slug}
                                  href={`/category/${item.slug}`}
                                  className="block py-1 text-xs text-gray-600"
                                  onClick={() => setShowMobileMenu(false)}
                                >
                                  {item.name}
                                </Link>
                              ))}
                              {subgroup.items.length > 5 && (
                                <Link
                                  href={`/category/${mainCategory.slug}`}
                                  className="block py-1 text-xs text-orange-600 font-medium"
                                  onClick={() => setShowMobileMenu(false)}
                                >
                                  Tümünü Gör →
                                </Link>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1">
                <Link href="/category/bestsellers" className="block py-2 text-sm text-gray-700" onClick={() => setShowMobileMenu(false)}>
                  Çok Satanlar
                </Link>
                <Link href="/flash-sale" className="block py-2 text-sm text-gray-700" onClick={() => setShowMobileMenu(false)}>
                  Flaş Ürünler
                </Link>
                <Link href="/favorites" className="block py-2 text-sm text-gray-700" onClick={() => setShowMobileMenu(false)}>
                  Favorilerim
                </Link>
                <Link href="/cart" className="block py-2 text-sm text-gray-700" onClick={() => setShowMobileMenu(false)}>
                  Sepetim ({count})
                </Link>
                {user ? (
                  <>
                    <Link href="/account" className="block py-2 text-sm text-gray-700" onClick={() => setShowMobileMenu(false)}>
                      Hesabım
                    </Link>
                    {(userRole === 'admin' || userRole === 'seller') && (
                      <Link href="/admin" className="block py-2 text-sm text-gray-700" onClick={() => setShowMobileMenu(false)}>
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={async () => {
                        await signOut();
                        setShowMobileMenu(false);
                        router.push('/');
                      }}
                      className="block w-full text-left py-2 text-sm text-red-600"
                    >
                      Çıkış Yap
                    </button>
                  </>
                ) : (
                  <Link href="/auth/login" className="block py-2 text-sm text-gray-700" onClick={() => setShowMobileMenu(false)}>
                    Giriş Yap
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Navigation - Trendyol Style */}
      {!isKitchen && (
        <div className="bg-white border-b border-gray-100 relative">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="hidden lg:flex items-center h-12 gap-6">
              {/* TÜM KATEGORİLER with Mega Menu Dropdown - Desktop Only */}
              <div
                className="relative z-50"
                onMouseEnter={() => {
                  setShowCategoriesDropdown(true);
                  // İlk kategoriyi varsayılan olarak seç
                  if (!selectedMainCategory && megaMenuCategories.length > 0) {
                    setSelectedMainCategory(megaMenuCategories[0].slug);
                  }
                }}
                onMouseLeave={() => {
                  setShowCategoriesDropdown(false);
                  setSelectedMainCategory(null);
                }}
              >
                <Link
                  href="/category/all"
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-900 hover:text-orange-600 whitespace-nowrap"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  TÜM KATEGORİLER
                </Link>

                {/* Mega Menu Dropdown - 2 Column Layout - Desktop Only */}
                {showCategoriesDropdown && (
                  <div className="hidden lg:block absolute top-full left-0 mt-0 w-[900px] max-w-[90vw] bg-white shadow-2xl border border-gray-200 z-50 rounded-b-lg">
                    <div className="flex max-h-[600px]">
                      {/* Left Column - Main Categories */}
                      <div className="w-64 border-r border-gray-200 bg-gray-50 overflow-y-auto">
                        <div className="p-4">
                          <Link
                            href="/category/all"
                            className="block text-sm font-bold text-gray-900 hover:text-orange-600 transition-colors mb-3 pb-2 border-b border-gray-200"
                            onClick={() => setShowCategoriesDropdown(false)}
                          >
                            Tüm Kategoriler
                          </Link>
                          <ul className="space-y-1">
                            {megaMenuCategories.map((mainCategory) => (
                              <li key={mainCategory.slug}>
                                <button
                                  onMouseEnter={() => setSelectedMainCategory(mainCategory.slug)}
                                  className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                                    selectedMainCategory === mainCategory.slug
                                      ? 'bg-white text-orange-600 font-semibold shadow-sm'
                                      : 'text-gray-700 hover:bg-white hover:text-orange-600'
                                  }`}
                                >
                                  {mainCategory.title}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Right Column - Subcategories */}
                      <div className="flex-1 overflow-y-auto p-5">
                        {selectedMainCategory ? (
                          (() => {
                            const selectedCategory = megaMenuCategories.find(cat => cat.slug === selectedMainCategory);
                            if (!selectedCategory) return null;

                            return (
                              <>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">{selectedCategory.title}</h3>
                                <div className="space-y-6">
                                  {selectedCategory.subcategories.map((subgroup, subIdx) => (
                                    <div key={subIdx}>
                                      <h4 className="text-xs font-semibold text-orange-600 uppercase mb-3">
                                        {subgroup.groupTitle}
                                      </h4>
                                      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                                        {subgroup.items.map((item) => (
                                          <Link
                                            key={item.slug}
                                            href={`/category/${item.slug}`}
                                            className="text-sm text-gray-700 hover:text-orange-600 hover:font-medium transition-colors"
                                            onClick={() => setShowCategoriesDropdown(false)}
                                          >
                                            {item.name}
                                          </Link>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* API'den gelen diğer kategoriler (eğer varsa ve seçili kategori ile ilgili değilse) */}
                                {categories.length > 0 && categories.filter(cat => !megaMenuCategories.some(m => m.slug === cat.slug)).length > 0 && (
                                  <div className="mt-6 pt-6 border-t border-gray-200">
                                    <div className="text-xs font-semibold text-gray-700 mb-3">Diğer Kategoriler</div>
                                    <div className="flex flex-wrap gap-2">
                                      {categories
                                        .filter(cat => !megaMenuCategories.some(m => m.slug === cat.slug))
                                        .map((category) => (
                                          <Link
                                            key={category.slug}
                                            href={`/category/${category.slug}`}
                                            className="px-3 py-1.5 text-xs text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                            onClick={() => setShowCategoriesDropdown(false)}
                                          >
                                            {category.name}
                                          </Link>
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()
                        ) : (
                          <div className="text-center text-gray-500 py-20">
                            <p className="text-sm">Bir kategori seçin</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Special Links - Desktop Only */}
              <div className="h-6 w-px bg-gray-200" />
              <Link href="/category/bestsellers" className="text-sm text-gray-700 hover:text-orange-600 whitespace-nowrap">
                Çok Satanlar
              </Link>
              <Link href="/flash-sale" className="text-sm text-gray-700 hover:text-orange-600 whitespace-nowrap">
                Flaş Ürünler
              </Link>
            </div>

            {/* Mobile Category Scroll */}
            <div className="lg:hidden overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-4 h-12 px-4">
                <Link href="/category/all" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-900 hover:text-orange-600 whitespace-nowrap">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  Tümü
                </Link>
                {categories.slice(0, 6).map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="text-xs text-gray-700 hover:text-orange-600 whitespace-nowrap"
                  >
                    {category.name}
                  </Link>
                ))}
                <Link href="/category/bestsellers" className="text-xs text-gray-700 hover:text-orange-600 whitespace-nowrap">
                  Çok Satanlar
                </Link>
                <Link href="/flash-sale" className="text-xs text-gray-700 hover:text-orange-600 whitespace-nowrap">
                  Flaş Ürünler
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
