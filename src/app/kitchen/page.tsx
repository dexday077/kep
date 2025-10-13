"use client";

import { useMemo, useState } from "react";
import { getRestaurants } from "@/data/kitchen";
import CategoryChips from "@/components/CategoryChips";
import RestaurantCard from "@/components/RestaurantCard";

export default function KepKitchenPage() {
  const base = getRestaurants();
  const [category, setCategory] = useState("Hepsi");
  const [sortBy, setSortBy] = useState("Önerilen");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>(["Tümü"]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAllCuisines, setShowAllCuisines] = useState(false);
  // New filter states
  const [popularFilters, setPopularFilters] = useState<{
    yedikce?: boolean;
    semtinYildizi?: boolean;
    goTeslimat?: boolean;
    kampanyali?: boolean;
    acik?: boolean;
  }>({});
  const [minRating, setMinRating] = useState<number | null>(null); // 4.0 or 4.5
  const [paymentMethods, setPaymentMethods] = useState<Record<string, boolean>>(
    { tumu: true }
  );
  const [minBasket, setMinBasket] = useState<number | null>(null); // 200,300,400
  const [etaLimit, setEtaLimit] = useState<number | null>(null); // minutes
  const [distanceLimit, setDistanceLimit] = useState<number | null>(null); // km

  const list = useMemo(() => {
    const filtered = base.filter((r) => {
      // Category filter from chips
      const byCat =
        category === "Hepsi"
          ? true
          : r.cuisine.toLowerCase().includes(category.toLowerCase());

      // Cuisine filter from sidebar
      const byCuisine =
        selectedCuisines.includes("Tümü") ||
        selectedCuisines.some((c) => {
          if (c === "Tümü") return true;
          return (
            r.cuisine.toLowerCase().includes(c.toLowerCase()) ||
            r.badges?.some((badge) =>
              badge.toLowerCase().includes(c.toLowerCase())
            ) ||
            false
          );
        });
      // Popular filter flags simulated via badges/fields
      const byPopular =
        (popularFilters.yedikce
          ? r.badges?.some((b) => b.toLowerCase().includes("indirim")) || false
          : true) &&
        (popularFilters.semtinYildizi
          ? r.badges?.some((b) => b.toLowerCase().includes("yıldız")) || false
          : true) &&
        (popularFilters.goTeslimat ? r.etaMinutes <= 30 : true) &&
        (popularFilters.kampanyali ? (r.promoText ? true : false) : true) &&
        (popularFilters.acik ? true : true);

      const byRating = minRating != null ? r.rating >= minRating : true;

      // Payment methods - simulated: allow all unless a specific option chosen that's not supported
      const byPayment = paymentMethods.tumu ? true : true;

      const byMinBasket =
        minBasket != null
          ? typeof r.minOrder === "number"
            ? r.minOrder <= minBasket
            : true
          : true;

      const byEta = etaLimit != null ? r.etaMinutes <= etaLimit : true;

      // Distance not modeled; simulate with eta as proxy (faster ~ closer)
      const byDistance =
        distanceLimit != null ? r.etaMinutes <= distanceLimit * 2 : true;

      return (
        byCat &&
        byCuisine &&
        byPopular &&
        byRating &&
        byPayment &&
        byMinBasket &&
        byEta &&
        byDistance
      );
    });

    // Apply sorting
    switch (sortBy) {
      case "Puana Göre":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "Yakınlığa Göre":
        filtered.sort((a, b) => a.etaMinutes - b.etaMinutes);
        break;
      case "Alfabetik":
        filtered.sort((a, b) => a.name.localeCompare(b.name, "tr"));
        break;
      case "Değerlendirme Sayısına Göre":
        // Simulate review count based on rating and popularity
        filtered.sort((a, b) => {
          const aReviews =
            Math.floor(a.rating * 100) +
            (a.badges?.includes("Çok Satan") ? 50 : 0);
          const bReviews =
            Math.floor(b.rating * 100) +
            (b.badges?.includes("Çok Satan") ? 50 : 0);
          return bReviews - aReviews;
        });
        break;
      default: // "Önerilen"
        // Default sorting: rating + delivery speed + free delivery bonus
        filtered.sort((a, b) => {
          const aScore =
            a.rating +
            (a.deliveryFee === 0 ? 0.5 : 0) +
            (30 - a.etaMinutes) / 100;
          const bScore =
            b.rating +
            (b.deliveryFee === 0 ? 0.5 : 0) +
            (30 - b.etaMinutes) / 100;
          return bScore - aScore;
        });
    }

    return filtered;
  }, [
    base,
    category,
    sortBy,
    selectedCuisines,
    popularFilters,
    minRating,
    paymentMethods,
    minBasket,
    etaLimit,
    distanceLimit,
  ]);

  const cuisines = [
    "Tümü",
    "Döner",
    "Burger",
    "Sokak Lezzetleri",
    "Tost & Sandviç",
    "Pide & Lahmacun",
    "Pizza",
    "Sushi",
    "Tatlı",
  ];

  const campaigns = [
    {
      id: 1,
      title: "450 TL'ye sepette 150 TL İNDİRİM",
      subtitle: "Starbucks",
      bgColor: "bg-green-500",
      logo: "☕",
    },
    {
      id: 2,
      title: "İlk siparişine 150 TL İNDİRİM",
      subtitle: "İLKYEMEK150",
      bgColor: "bg-orange-500",
      logo: "🍔",
    },
    {
      id: 3,
      title: "Büyük markalardan %30 İNDİRİM",
      subtitle: "Özel Fırsat",
      bgColor: "bg-blue-500",
      logo: "🍟",
    },
  ];

  const cuisineTypes = [
    { name: "Döner", emoji: "🥙" },
    { name: "Burger", emoji: "🍔" },
    { name: "Pilav", emoji: "🍚" },
    { name: "Pizza", emoji: "🍕" },
    { name: "Tost", emoji: "🥪" },
    { name: "Kebap", emoji: "🍖" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden bg-white border-b">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 flex items-center justify-between"
          >
            <span>Filtrele ve Sırala</span>
            <span
              className={`transform transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
        </div>

        {/* Sidebar - Desktop & Mobile */}
        <aside
          className={`${
            showFilters ? "block" : "hidden"
          } lg:block w-full lg:w-80 bg-white border-r border-gray-200 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:overflow-y-auto`}
        >
          <div className="p-6 pb-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Filtrele ve Sırala
            </h2>
            <button
              className="mb-6 text-sm text-orange-600 hover:underline"
              onClick={() => {
                setSelectedCuisines(["Tümü"]);
                setPopularFilters({});
                setMinRating(null);
                setPaymentMethods({ tumu: true });
                setMinBasket(null);
                setEtaLimit(null);
                setDistanceLimit(null);
                setSortBy("Önerilen");
              }}
            >
              Filtreleri Sıfırla
            </button>

            {/* Sort Section */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Sırala</h3>
              <div className="space-y-3">
                {[
                  "Önerilen",
                  "Alfabetik",
                  "Puana Göre",
                  "Yakınlığa Göre",
                  "Değerlendirme Sayısına Göre",
                ].map((option) => (
                  <label
                    key={option}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="sort"
                      value={option}
                      checked={sortBy === option}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Cuisines Section */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Mutfaklar
              </h3>
              <div className="space-y-3">
                {(showAllCuisines ? cuisines : cuisines.slice(0, 8)).map(
                  (cuisine) => (
                    <label
                      key={cuisine}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCuisines.includes(cuisine)}
                        onChange={(e) => {
                          if (cuisine === "Tümü") {
                            setSelectedCuisines(["Tümü"]);
                          } else {
                            const newCuisines = selectedCuisines.filter(
                              (c) => c !== "Tümü"
                            );
                            if (e.target.checked) {
                              setSelectedCuisines([...newCuisines, cuisine]);
                            } else {
                              setSelectedCuisines(
                                newCuisines.length === 0
                                  ? ["Tümü"]
                                  : newCuisines
                              );
                            }
                          }
                        }}
                        className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {cuisine}
                      </span>
                    </label>
                  )
                )}
                {cuisines.length > 8 && (
                  <button
                    type="button"
                    className="text-xs text-orange-600 hover:underline"
                    onClick={() => setShowAllCuisines((s) => !s)}
                  >
                    {showAllCuisines ? "Daha az göster" : "Daha fazla göster"}
                  </button>
                )}
              </div>
            </div>

            {/* Popular Filters */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Popüler Filtreler
              </h3>
              <div className="space-y-3">
                {[
                  { key: "yedikce", label: "Yedikçe İndirim Restoranları" },
                  { key: "semtinYildizi", label: "Semtin Yıldızı Restoranlar" },
                  { key: "goTeslimat", label: "Go ile Teslimat" },
                  { key: "kampanyali", label: "Kampanyalı Restoranlar" },
                  { key: "acik", label: "Açık Restoranlar" },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(
                        popularFilters[key as keyof typeof popularFilters]
                      )}
                      onChange={(e) =>
                        setPopularFilters((p) => ({
                          ...p,
                          [key]: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Puan Ortalaması
              </h3>
              <div className="space-y-3">
                {[null, 4.0, 4.5].map((r) => (
                  <label
                    key={String(r)}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === r}
                      onChange={() => setMinRating(r)}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {r ? `${r} ve Üzeri` : "Tümü"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Payment Method (mock) */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Ödeme Yöntemi
              </h3>
              <div className="space-y-3">
                {[
                  "Tümü",
                  "Banka & Kredi Kartı",
                  "Multinet Online",
                  "Pluxee (Sodexo) Online",
                  "Edenred Ticket Restaurant Online",
                  "Setcard Online",
                ].map((m, idx) => (
                  <label key={m} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={idx === 0 ? paymentMethods.tumu : false}
                      onChange={() => setPaymentMethods({ tumu: true })}
                      className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{m}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Basket */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Minimum Sepet Tutarı
              </h3>
              <div className="space-y-3">
                {[null, 200, 300, 400].map((m) => (
                  <label
                    key={String(m)}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="min-basket"
                      checked={minBasket === m}
                      onChange={() => setMinBasket(m)}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {m ? `${m} TL ve altı` : "Tümü"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Delivery ETA */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Teslimat Süresi
              </h3>
              <div className="space-y-3">
                {[null, 20, 30, 40].map((m) => (
                  <label
                    key={String(m)}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="eta"
                      checked={etaLimit === m}
                      onChange={() => setEtaLimit(m)}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {m ? `${m} dk ve altı` : "Tümü"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Distance (proxy) */}
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Restoran Uzaklığı
              </h3>
              <div className="space-y-3">
                {[null, 0.5, 1, 2].map((m) => (
                  <label
                    key={String(m)}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="distance"
                      checked={distanceLimit === m}
                      onChange={() => setDistanceLimit(m)}
                      className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {m ? `${m} km ve altı` : "Tümü"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Popular Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Popüler Filtreler
              </h3>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Yedikçe İndirim
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Semtin Yıldızı
                  </span>
                </label>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Category Navigation */}
          <div className="mb-6">
            <CategoryChips onChange={setCategory} />
          </div>

          {/* Campaigns Section */}
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Kampanyalar
              </h2>
              <button className="text-orange-500 text-sm hover:underline">
                Tümünü Gör
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className={`${campaign.bgColor} rounded-xl p-6 text-white`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-lg font-bold mb-1">
                        {campaign.title}
                      </div>
                      <div className="text-sm opacity-90">
                        {campaign.subtitle}
                      </div>
                    </div>
                    <div className="text-3xl">{campaign.logo}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Cuisines Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Mutfaklar
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {cuisineTypes.map((cuisine) => (
                <button
                  key={cuisine.name}
                  className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow border border-gray-100"
                >
                  <div className="text-3xl mb-2">{cuisine.emoji}</div>
                  <div className="text-sm font-medium text-gray-700">
                    {cuisine.name}
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Restaurants Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Restoranlar
              </h2>
              <div className="text-sm text-gray-500">
                {list.length} restoran bulundu
              </div>
            </div>

            {list.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Restoran bulunamadı
                </h3>
                <p className="text-gray-500">
                  Arama kriterlerinizi değiştirmeyi deneyin
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {list.map((restaurant) => (
                  <RestaurantCard key={restaurant.slug} r={restaurant} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
