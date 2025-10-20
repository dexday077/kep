"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, userRole, signOut, loading } = useAuth();

  // Role kontrolü - sadece admin ve seller erişebilir
  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Kullanıcı giriş yapmamış
        router.push("/auth/login");
      } else if (userRole && userRole === "customer") {
        // Customer admin paneline giremez
        alert("Bu alana erişim yetkiniz bulunmamaktadır.");
        router.push("/");
      }
    }
  }, [user, userRole, loading, router]);

  // Yükleme durumu
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Yetkisiz erişim kontrolü
  if (!user || (userRole && userRole === "customer")) {
    return null;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Ürünler", href: "/admin/products", icon: "📦" },
    { name: "Restoranlar", href: "/admin/restaurants", icon: "🍽️" },
    { name: "Siparişler", href: "/admin/orders", icon: "🛒" },
    { name: "Müşteriler", href: "/admin/customers", icon: "👥" },
    { name: "İncelemeler", href: "/admin/reviews", icon: "⭐" },
    { name: "Ayarlar", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-gray-900 transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-800">
          {sidebarOpen && (
            <span className="text-xl font-bold text-white">Admin Panel</span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.email || "Kullanıcı"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {userRole === "admin"
                    ? "Yönetici"
                    : userRole === "seller"
                    ? "Satıcı"
                    : "Müşteri"}
                </p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={async () => {
                await signOut();
                router.push("/auth/login");
              }}
              className="w-full mt-3 px-3 py-2 text-sm text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
            >
              Çıkış Yap
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {navigation.find((item) => item.href === pathname)?.name ||
              "Dashboard"}
          </h1>
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
              <span className="text-xl">🔔</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <Link href="/" className="btn btn-ghost text-sm">
              ← Ana Siteye Dön
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
