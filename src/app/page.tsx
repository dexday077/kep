"use client";

import ProductCard from "@/components/ProductCard";
import FiltersBar, { type Filters } from "@/components/FiltersBar";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearch } from "@/context/SearchContext";

const demoProducts = [
  {
    id: "1",
    title: "Kablosuz Kulaklık Pro X",
    price: 1899,
    image: "/window.svg",
    rating: 4.6,
    badge: "Öne Çıkan",
    category: "Elektronik",
  },
  {
    id: "2",
    title: "Akıllı Saat S3",
    price: 2399,
    image: "/globe.svg",
    rating: 4.4,
    category: "Moda",
  },
  {
    id: "3",
    title: "Bluetooth Hoparlör Mini",
    price: 749,
    image: "/file.svg",
    rating: 4.2,
    category: "Ev & Yaşam",
  },
  {
    id: "4",
    title: "Oyun Mouse RGB",
    price: 499,
    image: "/next.svg",
    rating: 4.1,
    category: "Elektronik",
  },
  {
    id: "5",
    title: "USB-C Hızlı Şarj Adaptörü",
    price: 329,
    image: "/vercel.svg",
    rating: 4.7,
    category: "Elektronik",
  },
  {
    id: "6",
    title: "Mikrofon Condenser M1",
    price: 1299,
    image: "/globe.svg",
    rating: 4.5,
    category: "Elektronik",
  },
  {
    id: "7",
    title: "Gaming Klavye Mekanik",
    price: 899,
    image: "/window.svg",
    rating: 4.3,
    category: "Elektronik",
  },
  {
    id: "8",
    title: "Laptop Stand Alüminyum",
    price: 459,
    image: "/file.svg",
    rating: 4.8,
    category: "Elektronik",
  },
  {
    id: "9",
    title: "Kahve Makinesi Otomatik",
    price: 3499,
    image: "/globe.svg",
    rating: 4.6,
    category: "Ev & Yaşam",
  },
  {
    id: "10",
    title: "Spor Ayakkabı Running",
    price: 1299,
    image: "/next.svg",
    rating: 4.4,
    category: "Spor",
  },
  {
    id: "11",
    title: "Akıllı Telefon Kılıfı",
    price: 149,
    image: "/vercel.svg",
    rating: 4.2,
    category: "Elektronik",
  },
  {
    id: "12",
    title: "Fitness Eldiveni",
    price: 89,
    image: "/window.svg",
    rating: 4.5,
    category: "Spor",
  },
  {
    id: "13",
    title: "Kozmetik Set Premium",
    price: 899,
    image: "/file.svg",
    rating: 4.7,
    category: "Kozmetik",
  },
  {
    id: "14",
    title: "Çocuk Oyuncağı Eğitici",
    price: 299,
    image: "/globe.svg",
    rating: 4.3,
    category: "Oyuncak",
  },
  {
    id: "15",
    title: "Kitap Roman Klasik",
    price: 79,
    image: "/next.svg",
    rating: 4.8,
    category: "Kitap",
  },
  {
    id: "16",
    title: "Araba Temizlik Seti",
    price: 199,
    image: "/vercel.svg",
    rating: 4.4,
    category: "Otomotiv",
  },
  {
    id: "17",
    title: "Erkek Tişört Pamuk",
    price: 249,
    image: "/window.svg",
    rating: 4.2,
    category: "Moda",
  },
  {
    id: "18",
    title: "Kadın Çanta Deri",
    price: 1599,
    image: "/file.svg",
    rating: 4.6,
    category: "Moda",
  },
  {
    id: "19",
    title: "Bluetooth Kulaklık Sport",
    price: 699,
    image: "/globe.svg",
    rating: 4.1,
    category: "Elektronik",
  },
  {
    id: "20",
    title: "Kahve Fincanı Seramik",
    price: 129,
    image: "/next.svg",
    rating: 4.5,
    category: "Ev & Yaşam",
  },
  {
    id: "21",
    title: "Bisiklet Kask Güvenlik",
    price: 399,
    image: "/vercel.svg",
    rating: 4.7,
    category: "Spor",
  },
  {
    id: "22",
    title: "Makyaj Fırçası Seti",
    price: 179,
    image: "/window.svg",
    rating: 4.4,
    category: "Kozmetik",
  },
  {
    id: "23",
    title: "Puzzle 1000 Parça",
    price: 159,
    image: "/file.svg",
    rating: 4.6,
    category: "Oyuncak",
  },
  {
    id: "24",
    title: "Motivasyon Kitabı",
    price: 89,
    image: "/globe.svg",
    rating: 4.8,
    category: "Kitap",
  },
  {
    id: "25",
    title: "Araba Kokusu Premium",
    price: 69,
    image: "/next.svg",
    rating: 4.3,
    category: "Otomotiv",
  },
  {
    id: "26",
    title: "Kadın Sweatshirt Hoodie",
    price: 449,
    image: "/vercel.svg",
    rating: 4.5,
    category: "Moda",
  },
  {
    id: "27",
    title: "Erkek Jean Pantolon",
    price: 599,
    image: "/window.svg",
    rating: 4.2,
    category: "Moda",
  },
  {
    id: "28",
    title: "Tablet Stand Ayarlanabilir",
    price: 279,
    image: "/file.svg",
    rating: 4.6,
    category: "Elektronik",
  },
  {
    id: "29",
    title: "Çay Demleme Seti",
    price: 329,
    image: "/globe.svg",
    rating: 4.7,
    category: "Ev & Yaşam",
  },
  {
    id: "30",
    title: "Yoga Matı Premium",
    price: 199,
    image: "/next.svg",
    rating: 4.4,
    category: "Spor",
  },
];

const categories = [
  "Elektronik",
  "Moda",
  "Ev & Yaşam",
  "Spor",
  "Otomotiv",
  "Kitap",
  "Kozmetik",
  "Oyuncak",
];

export default function Home() {
  const [filters, setFilters] = useState<Filters>({ sort: "popularity" });
  const { searchQuery, setSearchQuery } = useSearch();
  const [showConfetti] = useState(false);
  const [showFlashModal, setShowFlashModal] = useState(false);

  // Category slug mapping
  const getCategorySlug = (category: string) => {
    const slugMap: { [key: string]: string } = {
      Elektronik: "elektronik",
      Moda: "moda",
      "Ev & Yaşam": "ev-yasam",
      Spor: "spor",
      Otomotiv: "otomotiv",
      Kitap: "kitap",
      Kozmetik: "kozmetik",
      Oyuncak: "oyuncak",
    };
    return slugMap[category] || category.toLowerCase();
  };

  const handleFlashModalClose = () => {
    setShowFlashModal(false);
  };

  const filtered = useMemo(() => {
    let list = [...demoProducts];

    // Apply search filter
    if (searchQuery.trim()) {
      list = list.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply price filters
    if (filters.minPrice != null)
      list = list.filter((p) => p.price >= (filters.minPrice as number));
    if (filters.maxPrice != null)
      list = list.filter((p) => p.price <= (filters.maxPrice as number));

    // Apply sorting
    if (filters.sort === "popularity") {
      list.sort((a, b) => {
        // First sort by rating (descending), then by price (ascending)
        if (a.rating !== b.rating) return (b.rating || 0) - (a.rating || 0);
        return a.price - b.price;
      });
    }
    if (filters.sort === "priceAsc") list.sort((a, b) => a.price - b.price);
    if (filters.sort === "priceDesc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [filters, searchQuery]);

  return (
    <div className="bg-gray-50">
      {/* Hero Section (clean, modern) */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-50 via-white to-white" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <h1 className="text-center text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Yemeğin ve İhtiyacın{" "}
            <span className="text-orange-600">Dakikalar İçinde</span> Kapında
          </h1>
          <div className="mx-auto mt-6 max-w-3xl">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur">
              <div className="flex items-center gap-2">
                <div className="pl-2 text-slate-400">🔎</div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün ara"
                  className="flex-1 h-12 bg-transparent outline-none text-sm px-2"
                />
                <button
                  onClick={() => {
                    setFilters((f) => ({ ...f, sort: "popularity" }));
                  }}
                  className="h-10 rounded-xl bg-orange-600 px-4 text-sm font-medium text-white hover:bg-orange-700"
                >
                  Ara
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Main Categories */}
          <div className="flex overflow-x-auto py-4">
            <button className="whitespace-nowrap px-6 py-2 text-sm font-medium border-b-2 border-blue-600 text-blue-600 hover-scale">
              Tümü
            </button>
            {categories.map((c, index) => (
              <Link
                key={c}
                href={`/category/${getCategorySlug(c)}`}
                className="whitespace-nowrap px-6 py-2 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-blue-600 hover:border-gray-300 transition-colors hover-scale bounce-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid (calm, informative) */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-2xl mb-2">🍱</div>
              <h3 className="font-semibold text-slate-900">
                Binlerce Restoran
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Lezzetleri hızlıca keşfet.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold text-slate-900">Flaş İndirimler</h3>
              <p className="text-sm text-slate-600 mt-1">
                Uygulamada özel fırsatlar.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-2xl mb-2">⭐</div>
              <h3 className="font-semibold text-slate-900">
                Yıldızlı Restoranlar
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Kullanıcıların favorileri.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="text-2xl mb-2">📍</div>
              <h3 className="font-semibold text-slate-900">Canlı Takip</h3>
              <p className="text-sm text-slate-600 mt-1">
                Siparişini haritada izle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Showcase */}
      <section className="bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 bounce-in">
            Popüler Markalar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {["Apple", "Samsung", "Nike", "Adidas", "Sony", "LG"].map(
              (brand, index) => (
                <div
                  key={brand}
                  className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer hover-lift float-animation"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold hover-scale">
                    {brand[0]}
                  </div>
                  <div className="text-sm font-medium text-gray-700">
                    {brand}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white hover-lift bounce-in">
              <h3 className="text-lg font-bold mb-2">
                %50&apos;ye Varan İndirim
              </h3>
              <p className="text-sm opacity-90">Elektronik Ürünlerde</p>
            </div>
            <div
              className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white hover-lift bounce-in"
              style={{ animationDelay: "0.1s" }}
            >
              <h3 className="text-lg font-bold mb-2">Ücretsiz Kargo</h3>
              <p className="text-sm opacity-90">500₺ ve Üzeri Alışverişlerde</p>
            </div>
            <div
              className="bg-gray-50 border-2 border-blue-300 rounded-lg p-6 hover-lift bounce-in"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="text-lg font-bold mb-2 text-blue-600">
                Hızlı Teslimat
              </h3>
              <p className="text-sm text-gray-600">Aynı Gün Teslimat</p>
            </div>
            <div
              className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-6 text-gray-900 hover-lift bounce-in"
              style={{ animationDelay: "0.3s" }}
            >
              <h3 className="text-lg font-bold mb-2">Güvenli Ödeme</h3>
              <p className="text-sm opacity-80">256-bit SSL Şifreleme</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <FiltersBar
            onChange={setFilters}
            showSort={searchQuery.trim().length > 0}
          />

          {/* Trending Products Section */}
          {!searchQuery.trim() && (
            <div className="soft-gradient-secondary rounded-xl p-6 border border-orange-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center wiggle-animation">
                    <span className="text-white text-sm">🔥</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Trend Ürünler
                  </h2>
                </div>
                <span className="text-sm text-orange-600 font-medium">
                  En çok aranan ürünler
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {filtered.slice(0, 12).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Featured Products Section */}
          {!searchQuery.trim() && (
            <div className="bg-gray-50 rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center float-animation">
                    <span className="text-white text-sm">⭐</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Öne Çıkan Ürünler
                  </h2>
                </div>
                <span className="text-sm text-orange-600 font-medium">
                  En çok tercih edilen ürünler
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {filtered.slice(12, 24).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchQuery.trim() && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-slate-900">
                  &quot;{searchQuery}&quot; için {filtered.length} sonuç
                </h2>
                <span className="text-sm text-gray-500">
                  {filtered.length > 0
                    ? "Sonuçlar bulundu"
                    : "Sonuç bulunamadı"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {/* Recommended Products */}
          {!searchQuery.trim() && (
            <div className="bg-gray-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center pulse-glow">
                  <span className="text-gray-900 text-sm">💡</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Senin İçin Seçtiklerimiz
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {filtered.slice(24, 30).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Confetti Animation - Concentrated behind modal */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {/* Center area confetti - dense spiral */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-80 h-80">
              {Array.from({ length: 100 }).map((_, i) => {
                const angle = (i / 100) * 360;
                const radius = 30 + Math.random() * 80;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;

                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: "translate(-50%, -50%)",
                      animation: "confetti-spiral 2s ease-out forwards",
                      animationDelay: `${Math.random() * 0.3}s`,
                      fontSize: `${14 + Math.random() * 10}px`,
                      color: [
                        "#f97316",
                        "#3b82f6",
                        "#facc15",
                        "#ef4444",
                        "#8b5cf6",
                        "#10b981",
                      ][Math.floor(Math.random() * 6)],
                      zIndex: 1,
                    }}
                  >
                    {
                      [
                        "🎉",
                        "✨",
                        "🎊",
                        "💥",
                        "⭐",
                        "🌟",
                        "💫",
                        "🎈",
                        "🎁",
                        "🏆",
                      ][Math.floor(Math.random() * 10)]
                    }
                  </div>
                );
              })}
            </div>
          </div>

          {/* Falling confetti around the center */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={`fall-${i}`}
              className="absolute"
              style={{
                left: `${35 + Math.random() * 30}%`,
                top: "0%",
                animation: "confetti-fall 2.5s ease-out forwards",
                animationDelay: `${Math.random() * 0.4}s`,
                fontSize: `${12 + Math.random() * 8}px`,
                color: ["#f97316", "#3b82f6", "#facc15", "#ef4444", "#8b5cf6"][
                  Math.floor(Math.random() * 5)
                ],
                zIndex: 1,
              }}
            >
              {
                ["✨", "⭐", "💫", "🌟", "🎊", "🎉"][
                  Math.floor(Math.random() * 6)
                ]
              }
            </div>
          ))}

          {/* Side confetti bursts */}
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={`burst-${i}`}
              className="absolute"
              style={{
                left: `${i % 2 === 0 ? "10%" : "80%"}`,
                top: `${40 + Math.random() * 20}%`,
                animation: "confetti-fall 2s ease-out forwards",
                animationDelay: `${Math.random() * 0.6}s`,
                fontSize: `${10 + Math.random() * 6}px`,
                color: ["#f97316", "#3b82f6", "#facc15", "#ef4444"][
                  Math.floor(Math.random() * 4)
                ],
                zIndex: 1,
              }}
            >
              {["✨", "⭐", "💫", "🌟"][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
      )}

      {/* Flash Sale Modal */}
      {showFlashModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-bounce-in">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Flaş İndirimleri Görüntülemek İster misiniz?
            </h2>
            <p className="text-gray-600 mb-6">
              Özel indirimli ürünleri keşfetmek için flaş indirim sayfasına
              gidin!
            </p>
            <div className="flex gap-3">
              <Link
                href="/flash-sale"
                className="btn btn-secondary px-6 py-3 flex-1"
              >
                Evet, Görüntüle!
              </Link>
              <button
                onClick={handleFlashModalClose}
                className="btn btn-ghost px-6 py-3 flex-1"
              >
                Hayır
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
