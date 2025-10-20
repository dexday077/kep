"use client";

import { useMemo, useState, useEffect } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { getRestaurantBySlug } from "@/data/kitchen";
import { useCart } from "@/context/CartContext";
import { RestaurantMenuSkeleton } from "@/components/SkeletonLoader";

export default function RestaurantPage() {
  const params = useParams();
  const slug = useMemo(() => String(params?.slug ?? ""), [params]);
  const restaurant = getRestaurantBySlug(slug);
  const { addToCart } = useCart();
  const [qtyById, setQtyById] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [slug]);

  if (!restaurant) return notFound();

  if (isLoading) {
    return <RestaurantMenuSkeleton />;
  }

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-0">
      <div className="sticky top-[64px] z-30 -mx-4 border-b border-black/5 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/kitchen"
              className="text-sm text-orange-600 hover:underline"
            >
              ← Kep Kitchen&apos;a dön
            </Link>
            <img
              src={restaurant.image ?? "/next.svg"}
              alt={restaurant.name}
              className="h-14 w-14 rounded object-cover bg-black/5"
            />
            <div className="min-w-0">
              <h1 className="text-xl font-semibold tracking-tight truncate">
                {restaurant.name}
              </h1>
              <div className="text-black/70 truncate">
                {restaurant.cuisine} • ⭐ {restaurant.rating} •{" "}
                {restaurant.etaMinutes} dk
              </div>
              {restaurant.promoText && (
                <div className="text-sm text-blue-700">
                  {restaurant.promoText}
                </div>
              )}
            </div>
            <div className="ml-auto text-sm text-black/70">
              {restaurant.deliveryFee === 0
                ? "Ücretsiz Teslimat"
                : `Teslimat ₺${restaurant.deliveryFee?.toFixed(2)}`}
              {typeof restaurant.minOrder === "number" && (
                <span className="ml-2">• Min ₺{restaurant.minOrder}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-medium mb-3 px-4 sm:px-6 lg:px-8 pt-4">
          Menü
        </h2>
        <ul className="space-y-3 px-4 sm:px-6 lg:px-8 pb-6">
          {restaurant.menu.map((m) => (
            <li
              key={m.id}
              className="rounded-xl border border-black/10 p-4 bg-white"
            >
              <div className="flex items-center gap-3">
                {m.image && (
                  <img
                    src={m.image}
                    alt={m.title}
                    className="h-16 w-16 rounded object-cover bg-black/5"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{m.title}</div>
                  {m.description && (
                    <div className="text-sm text-black/60 truncate">
                      {m.description}
                    </div>
                  )}
                </div>
                <div className="text-right w-48">
                  <div className="font-semibold">₺{m.price}</div>
                  <div className="mt-2 inline-flex items-center rounded-full border border-black/10 bg-white">
                    <button
                      className="h-9 w-9 rounded-l-full hover:bg-black/5"
                      onClick={() =>
                        setQtyById((prev) => {
                          const current = prev[m.id] ?? 1;
                          const next = Math.max(1, current - 1);
                          return { ...prev, [m.id]: next };
                        })
                      }
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-sm">
                      {qtyById[m.id] ?? 1}
                    </span>
                    <button
                      className="h-9 w-9 rounded-r-full hover:bg-black/5"
                      onClick={() =>
                        setQtyById((prev) => ({
                          ...prev,
                          [m.id]: (prev[m.id] ?? 1) + 1,
                        }))
                      }
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-primary mt-2 w-full"
                    onClick={() =>
                      addToCart(
                        {
                          id: `${restaurant.slug}-${m.id}`,
                          title: `${restaurant.name} • ${m.title}`,
                          price: m.price,
                          image: m.image,
                        },
                        qtyById[m.id] ?? 1
                      )
                    }
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
