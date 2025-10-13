"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const flashSaleProducts = [
  {
    id: "1",
    title: "Kablosuz Kulaklık Pro X",
    price: 1899,
    originalPrice: 3799,
    image: "/window.svg",
    rating: 4.6,
    badge: "Flaş İndirim",
    category: "Elektronik",
    discount: 50,
  },
  {
    id: "2",
    title: "Akıllı Saat S3",
    price: 1199,
    originalPrice: 2399,
    image: "/globe.svg",
    rating: 4.4,
    badge: "Flaş İndirim",
    category: "Moda",
    discount: 50,
  },
  {
    id: "3",
    title: "Bluetooth Hoparlör Mini",
    price: 374,
    originalPrice: 749,
    image: "/file.svg",
    rating: 4.2,
    badge: "Flaş İndirim",
    category: "Ev & Yaşam",
    discount: 50,
  },
  {
    id: "4",
    title: "Oyun Mouse RGB",
    price: 249,
    originalPrice: 499,
    image: "/next.svg",
    rating: 4.1,
    badge: "Flaş İndirim",
    category: "Elektronik",
    discount: 50,
  },
  {
    id: "5",
    title: "USB-C Hızlı Şarj Adaptörü",
    price: 164,
    originalPrice: 329,
    image: "/vercel.svg",
    rating: 4.7,
    badge: "Flaş İndirim",
    category: "Elektronik",
    discount: 50,
  },
  {
    id: "6",
    title: "Mikrofon Condenser M1",
    price: 649,
    originalPrice: 1299,
    image: "/globe.svg",
    rating: 4.5,
    badge: "Flaş İndirim",
    category: "Elektronik",
    discount: 50,
  },
  {
    id: "7",
    title: "Gaming Klavye Mekanik",
    price: 449,
    originalPrice: 899,
    image: "/window.svg",
    rating: 4.3,
    badge: "Flaş İndirim",
    category: "Elektronik",
    discount: 50,
  },
  {
    id: "8",
    title: "Laptop Stand Alüminyum",
    price: 229,
    originalPrice: 459,
    image: "/file.svg",
    rating: 4.8,
    badge: "Flaş İndirim",
    category: "Elektronik",
    discount: 50,
  },
  {
    id: "9",
    title: "Kahve Makinesi Otomatik",
    price: 1749,
    originalPrice: 3499,
    image: "/globe.svg",
    rating: 4.6,
    badge: "Flaş İndirim",
    category: "Ev & Yaşam",
    discount: 50,
  },
  {
    id: "10",
    title: "Spor Ayakkabı Running",
    price: 649,
    originalPrice: 1299,
    image: "/next.svg",
    rating: 4.4,
    badge: "Flaş İndirim",
    category: "Spor",
    discount: 50,
  },
  {
    id: "11",
    title: "Akıllı Telefon Kılıfı",
    price: 74,
    originalPrice: 149,
    image: "/vercel.svg",
    rating: 4.2,
    badge: "Flaş İndirim",
    category: "Elektronik",
    discount: 50,
  },
  {
    id: "12",
    title: "Fitness Eldiveni",
    price: 44,
    originalPrice: 89,
    image: "/window.svg",
    rating: 4.5,
    badge: "Flaş İndirim",
    category: "Spor",
    discount: 50,
  },
];

export default function FlashSalePage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 45,
    seconds: 12,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 text-sm text-white/80">
            <Link href="/" className="hover:text-white">
              Ana Sayfa
            </Link>{" "}
            / <span>Flaş İndirim</span>
          </nav>

          <div className="text-center text-white">
            <div className="text-6xl mb-4 animate-bounce">⚡</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              FLAŞ İNDİRİM
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-95 drop-shadow-md">
              %50&apos;ye varan indirimlerle sınırlı süre!
            </p>
          </div>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8 text-white">
            <div className="text-center">
              <div className="text-4xl font-bold pulse-glow">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <div className="text-sm">Saat</div>
            </div>
            <div className="text-2xl">:</div>
            <div className="text-center">
              <div className="text-4xl font-bold pulse-glow">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <div className="text-sm">Dakika</div>
            </div>
            <div className="text-2xl">:</div>
            <div className="text-center">
              <div className="text-4xl font-bold pulse-glow">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
              <div className="text-sm">Saniye</div>
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sale Products */}
      <div className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Flaş İndirim Ürünleri
            </h2>
            <p className="text-gray-600">Sınırlı süre için özel fiyatlarla!</p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {flashSaleProducts.map((product) => (
              <div key={product.id} className="group relative">
                <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-orange-200">
                  {/* Discount Badge */}
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 animate-pulse">
                    -%{product.discount}
                  </div>

                  {/* Product Image */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-b from-gray-50 to-gray-100 mb-3">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-orange-600">
                          ₺{product.price.toLocaleString("tr-TR")}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ₺{product.originalPrice.toLocaleString("tr-TR")}
                        </span>
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        ₺
                        {(product.originalPrice - product.price).toLocaleString(
                          "tr-TR"
                        )}{" "}
                        tasarruf!
                      </div>
                    </div>

                    {/* Rating */}
                    {product.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-xs text-gray-600">
                          {product.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Kaçırma! Sınırlı Süre
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Bu fırsatları kaçırmayın, stoklar tükeniyor!
          </p>
          <Link
            href="/"
            className="btn btn-ghost px-8 py-4 text-lg bg-white text-orange-600 hover:bg-gray-100"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
