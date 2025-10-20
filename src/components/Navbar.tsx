"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function Navbar() {
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const isKitchen = pathname?.startsWith("/kitchen");
  const { user, userRole, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/5 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          {!isKitchen && (
            <Link
              href="/"
              className="shrink-0 font-semibold tracking-tight text-xl"
            >
              Kep <span className="text-blue-600">Marketplace</span>
            </Link>
          )}
          {isKitchen && (
            <div className="flex items-center gap-3">
              <Link
                href="/kitchen"
                className="shrink-0 font-semibold tracking-tight text-xl"
              >
                <span className="mr-1">🍔</span>Kep
                <span className="text-orange-600">Kitchen</span>
              </Link>
              <Link
                href="/"
                className="text-sm text-orange-600 hover:underline"
              >
                ← Kep Marketplace&apos;a dön
              </Link>
            </div>
          )}

          <nav className="ml-auto flex items-center gap-1">
            {!isKitchen && (
              <Link
                href="/kitchen"
                className="inline-flex h-10 items-center rounded-full px-3 text-sm hover:bg-black/5"
              >
                <span className="mr-2">🍔</span>
                <span className="hidden sm:inline">KepKitchen</span>
              </Link>
            )}

            {/* Kullanıcı Menüsü */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="inline-flex h-10 items-center rounded-full px-3 text-sm hover:bg-black/5"
                >
                  <span className="mr-2">👤</span>
                  <span className="hidden sm:inline">
                    {user.email?.split("@")[0]}
                  </span>
                  <span className="ml-1">▾</span>
                </button>

                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm text-gray-500 border-b">
                          <div className="font-medium text-gray-900">
                            {user.email}
                          </div>
                          <div className="text-xs">
                            {userRole === "admin"
                              ? "Yönetici"
                              : userRole === "seller"
                              ? "Satıcı"
                              : "Müşteri"}
                          </div>
                        </div>
                        <Link
                          href="/account"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100 mt-1"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span className="mr-2">👤</span>
                          Hesabım
                        </Link>
                        <Link
                          href="/orders"
                          className="flex items-center px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <span className="mr-2">📦</span>
                          Siparişlerim
                        </Link>
                        {(userRole === "admin" || userRole === "seller") && (
                          <Link
                            href="/admin"
                            className="flex items-center px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <span className="mr-2">⚙️</span>
                            Admin Panel
                          </Link>
                        )}
                        <hr className="my-1" />
                        <button
                          onClick={async () => {
                            await signOut();
                            setShowUserMenu(false);
                            router.push("/");
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 rounded hover:bg-red-50"
                        >
                          <span className="mr-2">🚪</span>
                          Çıkış Yap
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="inline-flex h-10 items-center rounded-full px-3 text-sm hover:bg-black/5"
              >
                <span className="mr-2">🔑</span>
                <span className="hidden sm:inline">Giriş Yap</span>
              </Link>
            )}

            <span className="mx-1 h-6 w-px bg-black/10" />
            <Link
              href="/cart"
              className="relative inline-flex h-10 items-center rounded-full px-3 text-sm hover:bg-black/5"
            >
              <span className="mr-2">🛒</span>
              <span className="hidden sm:inline">Sepet</span>
              {count > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-semibold text-white">
                  {count}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
