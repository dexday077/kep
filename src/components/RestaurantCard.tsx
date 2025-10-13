import Link from "next/link";
import type { Restaurant } from "@/data/kitchen";

export default function RestaurantCard({ r }: { r: Restaurant }) {
  return (
    <Link
      href={`/kitchen/${r.slug}`}
      className="group block bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden"
    >
      <div className="relative h-40 bg-gray-100">
        <img
          src={r.image ?? "/next.svg"}
          alt={r.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        
        {/* Promo Badge */}
        {r.promoText && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
            {r.promoText}
          </div>
        )}
        
        {/* Delivery Time */}
        <div className="absolute bottom-2 right-2 bg-white/90 text-gray-700 text-xs font-medium px-2 py-1 rounded">
          {r.etaMinutes}dk
        </div>
      </div>

      <div className="p-4">
        {/* Restaurant Info */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{r.name}</h3>
            <p className="text-sm text-gray-500 truncate">{r.cuisine}</p>
          </div>
          <div className="flex items-center text-sm text-gray-600 ml-2">
            <span className="text-yellow-500">⭐</span>
            <span className="ml-1">{r.rating}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
          <span>{r.deliveryFee === 0 ? "Ücretsiz teslimat" : `₺${r.deliveryFee?.toFixed(2)} teslimat`}</span>
          {typeof r.minOrder === "number" && (
            <>
              <span>•</span>
              <span>Min ₺{r.minOrder}</span>
            </>
          )}
        </div>

        {/* Special Badges */}
        {r.badges && r.badges.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {r.badges.slice(0, 2).map((badge) => {
              const isSpecial = badge.includes("İndirim") || badge.includes("Özel") || badge.includes("Sponsorlu") || badge.includes("Yedikçe");
              return (
                <span 
                  key={badge} 
                  className={`px-2 py-1 text-xs rounded-full ${
                    isSpecial 
                      ? "bg-orange-100 text-orange-700" 
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {badge}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}


