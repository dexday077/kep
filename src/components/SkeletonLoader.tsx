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
  lines = 1 
}: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200 rounded";
  
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
        <SkeletonLoader variant="rectangular" className="h-5 w-16 rounded-full" />
        
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
          <SkeletonLoader variant="rectangular" className="h-8 w-20 rounded-full" />
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
