"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { count } = useCart();
  const pathname = usePathname();
  const isKitchen = pathname?.startsWith("/kitchen");

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
            <Link
              href="/account"
              className="inline-flex h-10 items-center rounded-full px-3 text-sm hover:bg-black/5"
            >
              <span className="mr-2">👤</span>
              <span className="hidden sm:inline">Hesabım</span>
            </Link>
            <span className="mx-1 h-6 w-px bg-black/10" />
            <Link
              href="/orders"
              className="inline-flex h-10 items-center rounded-full px-3 text-sm hover:bg-black/5"
            >
              <span className="mr-2">📦</span>
              <span className="hidden sm:inline">Siparişler</span>
            </Link>
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
