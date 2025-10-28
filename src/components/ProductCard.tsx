'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { useToastContext } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/lib/api';

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  rating?: number;
  badge?: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCartStore();
  const { success, error: showError } = useToastContext();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkFavorite();
    }
  }, [user, product.id]);

  const checkFavorite = async () => {
    if (!user) return;
    try {
      const favorite = await ApiService.isFavorite(user.id, product.id);
      setIsFavorite(favorite);
    } catch {
      // Silently fail
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      showError('Favorilere eklemek için giriş yapmalısınız');
      return;
    }

    setLoading(true);
    try {
      if (isFavorite) {
        await ApiService.removeFromFavorites(user.id, product.id);
        setIsFavorite(false);
        success('Başarılı', 'Ürün favorilerden kaldırıldı');
      } else {
        await ApiService.addToFavorites(user.id, product.id);
        setIsFavorite(true);
        success('Başarılı', 'Ürün favorilere eklendi');
      }
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      showError('Favori işlemi başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ ...product, productId: product.id }, 1);
    success('Ürün Sepete Eklendi!', `${product.title} sepetinize eklendi.`);
  };

  return (
    <div className="group rounded-2xl border border-black/5 bg-white p-4 shadow-sm hover:shadow-md transition-shadow relative">
      {/* Favorite Button */}
      {user && (
        <button onClick={handleToggleFavorite} disabled={loading} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
          <svg className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      )}

      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-b from-white to-slate-50">
          <Image src={product.image} alt={product.title} width={500} height={500} className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105" />
        </div>
      </Link>
      <div className="mt-3 space-y-1">
        {product.badge ? <span className="inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">{product.badge}</span> : null}
        <h3 className="line-clamp-2 text-sm font-medium text-slate-900">{product.title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold">₺{product.price.toLocaleString('tr-TR')}</p>
          {product.rating ? <span className="text-xs text-slate-600">⭐ {product.rating.toFixed(1)}</span> : null}
        </div>

        {/* Add to Cart Button */}
        <button onClick={handleAddToCart} className="w-full mt-3 bg-orange-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-orange-700 transition-all opacity-100 group-hover:scale-105 transform">
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}
