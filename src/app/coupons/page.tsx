'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ApiService } from '@/lib/api';
import { useToastContext } from '@/context/ToastContext';
import Link from 'next/link';

type Coupon = {
  id: string;
  code: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_purchase: number;
  valid_until: string;
};

type UserCoupon = {
  id: string;
  coupon_id: string;
  used_at: string | null;
  order_id: string | null;
  coupon: Coupon;
};

export default function CouponsPage() {
  const { user } = useAuth();
  const { success, error: showError } = useToastContext();
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([]);
  const [userCoupons, setUserCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingCode, setClaimingCode] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadCoupons();
      loadUserCoupons();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadCoupons = async () => {
    try {
      const data = await ApiService.getCoupons();
      setAvailableCoupons(data);
    } catch (err: any) {
      console.error('Error loading coupons:', err);
      setAvailableCoupons([]);
    }
  };

  const loadUserCoupons = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const data = await ApiService.getUserCoupons(user.id);
      setUserCoupons(data || []);
    } catch (err: any) {
      console.error('Error loading user coupons:', err);
      setUserCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimCoupon = async (code: string) => {
    if (!user) {
      showError('Kupon almak için giriş yapmanız gerekiyor');
      return;
    }

    setClaimingCode(code);
    try {
      const result = await ApiService.claimCoupon(user.id, code);

      if (result && result[0]?.success) {
        success('Başarılı', result[0].message || 'Kupon başarıyla eklendi');
        loadUserCoupons();
        loadCoupons();
      } else {
        showError(result?.[0]?.message || 'Kupon alınamadı');
      }
    } catch (err: any) {
      console.error('Error claiming coupon:', err);
      showError('Kupon alınırken hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setClaimingCode(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">İndirim Kuponlarım</span>
        </nav>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">İndirim Kuponlarım</h1>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Available Coupons */}
            {user && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Mevcut Kuponlar</h2>
                {availableCoupons.length === 0 ? (
                  <p className="text-gray-600">Şu anda mevcut kupon bulunmamaktadır.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableCoupons.map((coupon) => {
                      const isClaimed = userCoupons.some((uc) => uc.coupon_id === coupon.id);
                      return (
                        <div key={coupon.id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-2 border-orange-200 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">{coupon.title}</h3>
                              <p className="text-sm text-gray-600">{coupon.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-orange-600">{coupon.discount_type === 'percentage' ? `%${coupon.discount_value}` : `₺${coupon.discount_value}`}</div>
                              <div className="text-xs text-gray-500">İndirim</div>
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            {coupon.minimum_purchase > 0 && <p className="text-xs text-gray-600">Min. tutar: ₺{coupon.minimum_purchase}</p>}
                            <p className="text-xs text-gray-600">Geçerlilik: {new Date(coupon.valid_until).toLocaleDateString('tr-TR')}</p>
                          </div>
                          <button
                            onClick={() => handleClaimCoupon(coupon.code)}
                            disabled={isClaimed || claimingCode === coupon.code}
                            className={`w-full py-2.5 rounded-md font-semibold transition-all ${isClaimed ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
                          >
                            {claimingCode === coupon.code ? 'Alınıyor...' : isClaimed ? 'Alındı' : coupon.code}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* My Coupons */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Kuponlarım</h2>
              {!user ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600 mb-4">Kuponlarınızı görmek için giriş yapın</p>
                  <Link href="/auth/login" className="btn btn-primary px-6">
                    Giriş Yap
                  </Link>
                </div>
              ) : userCoupons.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600">Henüz kuponunuz bulunmamaktadır.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userCoupons.map((uc) => {
                    const coupon = uc.coupon as any;
                    if (!coupon) return null;

                    return (
                      <div key={uc.id} className={`bg-white rounded-lg border-2 p-6 ${uc.used_at ? 'border-gray-200 opacity-60' : 'border-orange-200'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900">{coupon.title}</h3>
                              {uc.used_at && <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">Kullanıldı</span>}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{coupon.description}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-mono font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded">{coupon.code}</span>
                              {uc.used_at && <span className="text-gray-500">{new Date(uc.used_at).toLocaleDateString('tr-TR')} tarihinde kullanıldı</span>}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-2xl font-bold text-orange-600">{coupon.discount_type === 'percentage' ? `%${coupon.discount_value}` : `₺${coupon.discount_value}`}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
