'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { count } = useCartStore();
  const pathname = usePathname();
  const router = useRouter();
  const isKitchen = pathname?.startsWith('/kitchen');
  const { user, userRole, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
      {/* Top Utility Bar - Trendyol Style */}
      <div className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end h-9 items-center gap-6 text-xs text-gray-600">
            <Link href="/coupons" className="hover:text-orange-600 transition-colors">
              İndirim Kuponlarım
            </Link>
            <Link href="/seller/register" className="hover:text-orange-600 transition-colors">
              Kep'te Satış Yap
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
          <div className="flex h-20 items-center justify-between gap-4">
            {!isKitchen && (
              <>
                {/* Logo - Left - Trendyol Style */}
                <div className="flex-shrink-0">
                  <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
                    <Image src="/logo/kep_marketplace_logo.svg" alt="Kep Marketplace" width={180} height={50} className="h-12 w-auto" priority />
                  </Link>
                </div>

                {/* Search Bar - Center */}
                <div className="flex-1 max-w-2xl">
                  <div className="relative">
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

                {/* User Actions - Right */}
                <div className="flex items-center gap-1 flex-shrink-0">
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

      {/* Category Navigation - Trendyol Style */}
      {!isKitchen && (
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-12 gap-6 overflow-x-auto scrollbar-hide">
              <Link href="/category/all" className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-900 hover:text-orange-600 whitespace-nowrap">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                TÜM KATEGORİLER
              </Link>
              <div className="h-6 w-px bg-gray-200" />
              <Link href="/category/electronics" className="text-sm text-gray-700 hover:text-orange-600 whitespace-nowrap">
                Elektronik
              </Link>
              <Link href="/category/fashion" className="text-sm text-gray-700 hover:text-orange-600 whitespace-nowrap">
                Moda
              </Link>
              <Link href="/category/home" className="text-sm text-gray-700 hover:text-orange-600 whitespace-nowrap">
                Ev & Yaşam
              </Link>
              <Link href="/category/sports" className="text-sm text-gray-700 hover:text-orange-600 whitespace-nowrap">
                Spor
              </Link>
              <Link href="/category/cosmetics" className="text-sm text-gray-700 hover:text-orange-600 whitespace-nowrap">
                Kozmetik
              </Link>
              <Link href="/category/shoes" className="text-sm text-gray-700 hover:text-orange-600 whitespace-nowrap">
                Ayakkabı & Çanta
              </Link>
              <Link href="/category/bestsellers" className="text-sm text-gray-700 hover:text-orange-600 whitespace-nowrap">
                Çok Satanlar
              </Link>
              <Link href="/flash-sale" className="text-sm text-gray-700 hover:text-orange-600 whitespace-nowrap">
                Flaş Ürünler
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
