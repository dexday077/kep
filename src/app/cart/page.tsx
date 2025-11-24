'use client';

import { useCartStore } from '@/store/cartStore';
import { useToastContext } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
  const { items, total, count, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const { success } = useToastContext();
  const router = useRouter();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const shippingCost = total >= 500 ? 0 : 29;
  const tax = total * 0.18;
  const grandTotal = total + shippingCost + tax;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-6 text-sm text-slate-500">
          <Link href="/">Ana Sayfa</Link> / <span>Sepet</span>
        </nav>

        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🛒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-8">Alışverişe başlamak için ürünleri sepete ekleyin</p>
          <Link href="/" className="btn btn-primary px-8 py-3">
            Alışverişe Başla
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/">Ana Sayfa</Link> / <span>Sepet</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Sepetim ({count} ürün)</h1>
              <button onClick={clearCart} className="text-red-600 hover:text-red-700 text-sm font-medium">
                Sepeti Temizle
              </button>
            </div>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.title} width={80} height={80} className="w-full h-full object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-lg font-semibold text-orange-600">₺{item.price.toLocaleString('tr-TR')}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      -
                    </button>
                    <span className="w-12 text-center font-medium">{item.qty}</span>
                    <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">₺{(item.price * item.qty).toLocaleString('tr-TR')}</p>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-700 text-sm mt-1">
                      Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sipariş Özeti</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Ürünler ({count})</span>
                <span className="font-medium">₺{total.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kargo</span>
                <span className="font-medium text-green-600">{shippingCost === 0 ? 'Ücretsiz' : `₺${shippingCost}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">KDV (%18)</span>
                <span className="font-medium">₺{tax.toFixed(0)}</span>
              </div>
              <hr className="border-gray-200" />
              <div className="flex justify-between text-lg font-bold">
                <span>Toplam</span>
                <span className="text-orange-600">₺{grandTotal.toFixed(0)}</span>
              </div>
            </div>

            {shippingCost === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-800 text-sm font-medium">🎉 Ücretsiz kargo kazandınız!</p>
              </div>
            )}

            {total < 500 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
                <p className="text-orange-800 text-sm">{(500 - total).toFixed(0)} ₺ daha alışveriş yapın, ücretsiz kargo kazanın!</p>
              </div>
            )}

            {/* Development Phase Notice */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl p-5 mb-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h4 className="font-bold text-amber-900 mb-1">Geliştirme Aşamasında</h4>
                  <p className="text-sm text-amber-800">
                    Sepetinizdeki ürünler demo amaçlıdır. Ödeme sistemi henüz aktif olmadığı için gerçek satın alma işlemi yapılmamaktadır. Platform hazır olduğunda bilgilendirileceksiniz.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || items.length === 0}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isCheckingOut ? 'Yönlendiriliyor...' : 'Siparişi Tamamla'}
            </button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">Güvenli ödeme ile korunuyorsunuz</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
