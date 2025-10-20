"use client";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular" | "product-card";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export default function SkeletonLoader({
  className = "",
  variant = "rectangular",
  width,
  height,
  lines = 1,
}: SkeletonProps) {
  const baseClasses =
    "relative overflow-hidden bg-gray-200 rounded before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

  const getVariantClasses = () => {
    switch (variant) {
      case "text":
        return "h-4 w-full";
      case "circular":
        return "rounded-full";
      case "product-card":
        return "h-64 w-full";
      case "rectangular":
      default:
        return "h-4 w-full";
    }
  };

  const getDimensions = () => {
    if (width || height) {
      return {
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      };
    }
    return {};
  };

  if (variant === "text" && lines > 1) {
    return (
      <div className={className}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()} ${
              index < lines - 1 ? "mb-2" : ""
            }`}
            style={{
              ...getDimensions(),
              width: index === lines - 1 ? "75%" : "100%",
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={getDimensions()}
    />
  );
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="group rounded-2xl border border-black/5 bg-white p-4 shadow-sm">
      {/* Image skeleton */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-b from-gray-200 to-gray-300 mb-3">
        <SkeletonLoader variant="rectangular" className="h-full w-full" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-2">
        {/* Badge skeleton */}
        <SkeletonLoader
          variant="rectangular"
          className="h-5 w-16 rounded-full"
        />

        {/* Title skeleton */}
        <SkeletonLoader variant="text" lines={2} className="h-4" />

        {/* Price and rating skeleton */}
        <div className="flex items-center justify-between">
          <SkeletonLoader variant="rectangular" className="h-5 w-20" />
          <SkeletonLoader variant="rectangular" className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

// Restaurant Card Skeleton
export function RestaurantCardSkeleton() {
  return (
    <div className="rounded-xl border border-black/10 p-4 bg-white">
      <div className="flex items-center gap-3">
        {/* Image skeleton */}
        <SkeletonLoader variant="circular" className="h-16 w-16" />

        {/* Content skeleton */}
        <div className="flex-1 min-w-0">
          <SkeletonLoader variant="text" className="h-5 w-32 mb-2" />
          <SkeletonLoader variant="text" className="h-4 w-24 mb-1" />
          <SkeletonLoader variant="text" className="h-3 w-20" />
        </div>

        {/* Price skeleton */}
        <div className="text-right">
          <SkeletonLoader variant="rectangular" className="h-5 w-16 mb-2" />
          <SkeletonLoader
            variant="rectangular"
            className="h-8 w-20 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

// Page Loading Skeleton
export function PageSkeleton() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header skeleton */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <SkeletonLoader variant="rectangular" className="h-8 w-48" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Restaurant Menu Skeleton
export function RestaurantMenuSkeleton() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-0">
      {/* Header skeleton */}
      <div className="sticky top-[64px] z-30 -mx-4 border-b border-black/5 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <SkeletonLoader variant="rectangular" className="h-4 w-32" />
            <SkeletonLoader variant="circular" className="h-14 w-14" />
            <div className="flex-1 min-w-0 space-y-2">
              <SkeletonLoader variant="rectangular" className="h-5 w-48" />
              <SkeletonLoader variant="rectangular" className="h-4 w-64" />
            </div>
            <div className="text-right space-y-2">
              <SkeletonLoader variant="rectangular" className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu skeleton */}
      <section>
        <div className="px-4 sm:px-6 lg:px-8 pt-4">
          <SkeletonLoader variant="rectangular" className="h-6 w-24 mb-3" />
        </div>
        <ul className="space-y-3 px-4 sm:px-6 lg:px-8 pb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <li
              key={i}
              className="rounded-xl border border-black/10 p-4 bg-white"
            >
              <div className="flex items-center gap-3">
                <SkeletonLoader
                  variant="rectangular"
                  className="h-16 w-16 rounded"
                />
                <div className="flex-1 min-w-0 space-y-2">
                  <SkeletonLoader variant="rectangular" className="h-4 w-32" />
                  <SkeletonLoader variant="rectangular" className="h-3 w-48" />
                </div>
                <div className="text-right space-y-2 w-48">
                  <SkeletonLoader
                    variant="rectangular"
                    className="h-5 w-16 ml-auto"
                  />
                  <SkeletonLoader
                    variant="rectangular"
                    className="h-9 w-28 rounded-full ml-auto"
                  />
                  <SkeletonLoader
                    variant="rectangular"
                    className="h-10 w-full rounded-full"
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

// Product Detail Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb skeleton */}
      <div className="mb-6">
        <SkeletonLoader variant="rectangular" className="h-4 w-48" />
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image section skeleton */}
        <div>
          {/* Main image */}
          <SkeletonLoader
            variant="rectangular"
            className="aspect-square w-full rounded-xl mb-3"
          />

          {/* Thumbnail images */}
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonLoader
                key={i}
                variant="rectangular"
                className="aspect-square rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Product info skeleton */}
        <div className="space-y-4">
          {/* Title */}
          <SkeletonLoader variant="text" lines={2} className="h-6" />

          {/* Rating */}
          <SkeletonLoader variant="rectangular" className="h-4 w-16" />

          {/* Price */}
          <SkeletonLoader variant="rectangular" className="h-8 w-32" />

          {/* Description */}
          <SkeletonLoader variant="text" lines={3} className="h-4" />

          {/* Info boxes */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-3 space-y-2">
              <SkeletonLoader variant="rectangular" className="h-4 w-20" />
              <SkeletonLoader variant="rectangular" className="h-3 w-full" />
            </div>
            <div className="rounded-lg border border-gray-200 p-3 space-y-2">
              <SkeletonLoader variant="rectangular" className="h-4 w-20" />
              <SkeletonLoader variant="rectangular" className="h-3 w-full" />
            </div>
          </div>

          {/* Quantity and buttons */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SkeletonLoader
              variant="rectangular"
              className="h-10 w-32 rounded-full"
            />
            <div className="flex gap-3">
              <SkeletonLoader
                variant="rectangular"
                className="h-10 w-32 rounded-full"
              />
              <SkeletonLoader
                variant="rectangular"
                className="h-10 w-32 rounded-full"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-10">
            <div className="flex gap-2 border-b border-gray-200 mb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonLoader
                  key={i}
                  variant="rectangular"
                  className="h-8 w-24 rounded-t"
                />
              ))}
            </div>
            <SkeletonLoader variant="text" lines={4} className="h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
