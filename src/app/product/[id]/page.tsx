"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { useToastContext } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "next/navigation";
import { ProductDetailSkeleton } from "@/components/SkeletonLoader";
import { ApiService } from "@/lib/api";

type Product = {
  id: string;
  title: string;
  description?: string;
  price: number;
  original_price?: number;
  image?: string;
  images?: string[];
  rating?: number;
  stock?: number;
  category?: string;
  seller_id?: string;
  profiles?: {
    full_name?: string;
    shop_name?: string;
  };
  categories?: {
    name?: string;
    slug?: string;
  };
};

export default function ProductPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const { addToCart } = useCartStore();
  const { success, error: showError } = useToastContext();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [tab, setTab] = useState<"desc" | "specs" | "reviews">("desc");
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  const canDecrease = useMemo(() => quantity > 1, [quantity]);
  const canIncrease = useMemo(() => quantity < 10, [quantity]);

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoading(true);
        const productData = await ApiService.getProduct(id);
        setProduct(productData);
        
        // Load reviews
        const reviewsData = await ApiService.getReviews(id);
        setReviews(reviewsData || []);
        
        // Check if favorite
        if (user) {
          const favorite = await ApiService.isFavorite(user.id, id);
          setIsFavorite(favorite);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        showError('Ürün yüklenirken hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user) {
      showError('Favorilere eklemek için giriş yapmalısınız');
      return;
    }

    try {
      if (isFavorite) {
        await ApiService.removeFromFavorites(user.id, id);
        setIsFavorite(false);
        success('Başarılı', 'Ürün favorilerden kaldırıldı');
      } else {
        await ApiService.addToFavorites(user.id, id);
        setIsFavorite(true);
        success('Başarılı', 'Ürün favorilere eklendi');
      }
    } catch (err: any) {
      console.error('Error toggling favorite:', err);
      showError('Favori işlemi başarısız oldu');
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image || product.images?.[0] || '/placeholder.svg',
      },
      quantity
    );
    success('Ürün Sepete Eklendi!', `${product.title} sepetinize eklendi.`);
  };

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Ürün Bulunamadı</h1>
          <p className="mt-2 text-gray-600">Aradığınız ürün mevcut değil.</p>
          <Link href="/" className="mt-4 inline-block btn btn-primary">
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  const productImages = product.images || (product.image ? [product.image] : ['/placeholder.svg']);
  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/">Ana Sayfa</Link> / 
        {product.categories?.name && (
          <>
            <Link href={`/category/${product.categories.slug}`} className="hover:text-blue-600">
              {product.categories.name}
            </Link> / 
          </>
        )}
        <span>{product.title}</span>
      </nav>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-square w-full overflow-hidden rounded-xl bg-white border border-black/5 relative">
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-medium z-10">
                %{discountPercentage} İndirim
              </div>
            )}
            <Image
              src={productImages[activeImageIdx]}
              alt={product.title}
              width={800}
              height={800}
              className="h-full w-full object-contain p-6"
            />
          </div>
          {productImages.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {productImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`aspect-square overflow-hidden rounded-lg bg-white border ${
                    activeImageIdx === i
                      ? "border-blue-600 ring-2 ring-blue-100"
                      : "border-black/5"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${i + 1}`}
                    width={200}
                    height={200}
                    className="h-full w-full object-contain p-2"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {product.title}
              </h1>
              {product.rating && (
                <p className="mt-1 text-sm text-slate-500">
                  ⭐ {product.rating.toFixed(1)} ({reviews.length} değerlendirme)
                </p>
              )}
              {product.profiles?.shop_name && (
                <p className="mt-1 text-sm text-blue-600">
                  Satıcı: {product.profiles.shop_name}
                </p>
              )}
            </div>
            {user && (
              <button
                onClick={handleToggleFavorite}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isFavorite 
                    ? 'bg-red-50 text-red-500' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                <svg className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <p className="text-3xl font-bold text-orange-600">
              ₺{product.price.toLocaleString("tr-TR")}
            </p>
            {product.original_price && product.original_price > product.price && (
              <p className="text-lg text-slate-500 line-through">
                ₺{product.original_price.toLocaleString("tr-TR")}
              </p>
            )}
          </div>

          {product.description && (
            <p className="mt-4 text-slate-700">{product.description}</p>
          )}

          <div className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 md:grid-cols-2">
            <div className="rounded-lg border border-black/5 bg-white p-3">
              <p className="font-medium text-slate-900">Teslimat</p>
              <p className="mt-1">Hızlı kargo: 1-3 iş günü içinde teslim.</p>
            </div>
            <div className="rounded-lg border border-black/5 bg-white p-3">
              <p className="font-medium text-slate-900">Stok Durumu</p>
              <p className="mt-1">
                {product.stock && product.stock > 0 
                  ? `Stokta var (${product.stock}+)` 
                  : 'Stokta yok'
                }
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex h-10 items-center rounded-full border border-black/10 bg-white">
              <button
                onClick={() =>
                  canDecrease && setQuantity((q) => Math.max(1, q - 1))
                }
                className={`h-10 w-10 rounded-l-full text-lg ${
                  canDecrease
                    ? "hover:bg-slate-50"
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                -
              </button>
              <input
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) => {
                  const v = Number(e.target.value || 1);
                  if (!Number.isNaN(v))
                    setQuantity(Math.min(10, Math.max(1, v)));
                }}
                className="h-10 w-14 text-center outline-none"
              />
              <button
                onClick={() =>
                  canIncrease && setQuantity((q) => Math.min(10, q + 1))
                }
                className={`h-10 w-10 rounded-r-full text-lg ${
                  canIncrease
                    ? "hover:bg-slate-50"
                    : "opacity-40 cursor-not-allowed"
                }`}
              >
                +
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="btn btn-primary px-6"
                disabled={!product.stock || product.stock <= 0}
              >
                {product.stock && product.stock > 0 ? 'Sepete Ekle' : 'Stokta Yok'}
              </button>
              <button 
                className="btn btn-ghost px-6"
                disabled={!product.stock || product.stock <= 0}
              >
                Hemen Al
              </button>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex gap-2 border-b border-black/5">
              <button
                onClick={() => setTab("desc")}
                className={`h-10 rounded-t-md px-3 text-sm ${
                  tab === "desc"
                    ? "border-b-2 border-blue-600 font-semibold"
                    : "text-slate-500"
                }`}
              >
                Açıklama
              </button>
              <button
                onClick={() => setTab("specs")}
                className={`h-10 rounded-t-md px-3 text-sm ${
                  tab === "specs"
                    ? "border-b-2 border-blue-600 font-semibold"
                    : "text-slate-500"
                }`}
              >
                Özellikler
              </button>
              <button
                onClick={() => setTab("reviews")}
                className={`h-10 rounded-t-md px-3 text-sm ${
                  tab === "reviews"
                    ? "border-b-2 border-blue-600 font-semibold"
                    : "text-slate-500"
                }`}
              >
                Yorumlar ({reviews.length})
              </button>
            </div>
            <div className="pt-4 text-sm text-slate-700">
              {tab === "desc" && (
                <div className="space-y-2">
                  {product.description ? (
                    <p>{product.description}</p>
                  ) : (
                    <p>Bu ürün için detaylı açıklama henüz eklenmemiş.</p>
                  )}
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Yüksek kaliteli malzeme</li>
                    <li>Uzun süreli kullanım garantisi</li>
                    <li>Hızlı ve güvenli teslimat</li>
                    <li>Müşteri memnuniyeti odaklı hizmet</li>
                  </ul>
                </div>
              )}
              {tab === "specs" && (
                <div className="overflow-x-auto">
                  <table className="min-w-[400px] text-sm">
                    <tbody className="divide-y divide-black/5">
                      <tr>
                        <td className="py-2 pr-6 text-slate-500">Kategori</td>
                        <td className="py-2">{product.categories?.name || 'Belirtilmemiş'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-6 text-slate-500">Fiyat</td>
                        <td className="py-2">₺{product.price.toLocaleString("tr-TR")}</td>
                      </tr>
                      {product.original_price && (
                        <tr>
                          <td className="py-2 pr-6 text-slate-500">Orijinal Fiyat</td>
                          <td className="py-2 line-through">₺{product.original_price.toLocaleString("tr-TR")}</td>
                        </tr>
                      )}
                      <tr>
                        <td className="py-2 pr-6 text-slate-500">Stok</td>
                        <td className="py-2">{product.stock || 'Belirtilmemiş'}</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-6 text-slate-500">Satıcı</td>
                        <td className="py-2">{product.profiles?.shop_name || product.profiles?.full_name || 'Belirtilmemiş'}</td>
                      </tr>
                      {product.rating && (
                        <tr>
                          <td className="py-2 pr-6 text-slate-500">Değerlendirme</td>
                          <td className="py-2">⭐ {product.rating.toFixed(1)} ({reviews.length} yorum)</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {tab === "reviews" && (
                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {review.profiles?.full_name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{review.profiles?.full_name || 'Anonim'}</p>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ⭐
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-700">{review.comment}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(review.created_at).toLocaleDateString('tr-TR')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Henüz yorum yok. İlk yorumu sen yaz!</p>
                      {user ? (
                        <button className="btn btn-primary">
                          Yorum Yap
                        </button>
                      ) : (
                        <p className="text-sm text-gray-400">Yorum yapmak için giriş yapmalısınız.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
