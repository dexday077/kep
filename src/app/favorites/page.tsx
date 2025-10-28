'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ApiService } from '@/lib/api';
import { useToastContext } from '@/context/ToastContext';
import Link from 'next/link';
import Image from 'next/image';
import { getProductImage } from '@/lib/imageHelpers';

type Favorite = {
  id: string;
  product_id: string;
  created_at: string;
  product?: {
    id: string;
    title: string;
    price: number;
    image: string;
  };
};

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { success, error: showError } = useToastContext();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login');
      } else {
        loadFavorites();
      }
    }
  }, [user, authLoading, router]);

  const loadFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await ApiService.getFavorites(user.id);

      // Format favorites with product data
      const formattedFavorites = (data || []).map((fav: any) => ({
        id: fav.id,
        product_id: fav.product_id,
        created_at: fav.created_at,
        product: fav.product
          ? {
              id: fav.product.id,
              title: fav.product.title,
              price: fav.product.price,
              image: fav.product.image || getProductImage(fav.product.id),
            }
          : {
              id: fav.product_id,
              title: 'Ürün',
              price: 0,
              image: getProductImage(fav.product_id),
            },
      }));

      setFavorites(formattedFavorites);
    } catch (err: any) {
      console.error('Error loading favorites:', err);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    if (!user) return;

    try {
      await ApiService.removeFromFavorites(user.id, productId);
      success('Başarılı', 'Ürün favorilerden kaldırıldı');
      loadFavorites();
    } catch (err: any) {
      console.error('Error removing favorite:', err);
      showError('Favori kaldırılırken hata oluştu');
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">Favorilerim</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Favorilerim</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Henüz favoriniz yok</h3>
            <p className="text-gray-600 mb-6">Beğendiğiniz ürünleri favorilerinize ekleyin</p>
            <Link href="/" className="btn btn-primary px-8">
              Alışverişe Başla
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.map((fav) => {
              if (!fav.product) return null;

              return (
                <div key={fav.id} className="relative group">
                  <Link href={`/product/${fav.product.id}`}>
                    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square w-full mb-3">
                        <Image src={fav.product.image || '/placeholder.png'} alt={fav.product.title} fill className="object-cover rounded-lg" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">{fav.product.title}</h3>
                      <p className="text-lg font-bold text-orange-600">₺{fav.product.price.toLocaleString('tr-TR')}</p>
                    </div>
                  </Link>
                  <button
                    onClick={() => handleRemoveFavorite(fav.product_id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
