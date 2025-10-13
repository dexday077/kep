"use client";

import { useLoading } from "@/context/LoadingContext";

export default function LoadingOverlay() {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
        <div className="text-center">
          {/* Spinner */}
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
          
          {/* Message */}
          <p className="text-gray-700 font-medium">{loadingMessage}</p>
        </div>
      </div>
    </div>
  );
}

// Inline loading spinner
export function LoadingSpinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-b-2 border-orange-600 ${sizeClasses[size]} ${className}`}></div>
  );
}

// Button loading state
export function LoadingButton({ 
  isLoading, 
  children, 
  loadingText = "Yükleniyor...", 
  className = "",
  ...props 
}: {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
  [key: string]: unknown;
}) {
  return (
    <button 
      className={`${className} ${isLoading ? "opacity-75 cursor-not-allowed" : ""}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <LoadingSpinner size="sm" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
