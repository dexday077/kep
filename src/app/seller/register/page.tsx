'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToastContext } from '@/context/ToastContext';
import Link from 'next/link';

export default function SellerRegisterPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { success, error: showError } = useToastContext();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    taxNumber: '',
    phone: '',
    address: '',
    city: 'Alanya',
    district: 'Avsallar',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      showError('Satıcı kaydı için önce giriş yapmalısınız');
      router.push('/auth/login');
      return;
    }

    // Validation
    if (!formData.shopName || !formData.phone || !formData.address) {
      showError('Lütfen zorunlu alanları doldurun');
      return;
    }

    setLoading(true);
    try {
      // Update user role to seller (this would be handled by backend)
      const { supabase } = await import('@/lib/supabase');

      // Update profile with seller information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: 'seller',
          shop_name: formData.shopName,
          tax_number: formData.taxNumber,
          phone: formData.phone,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      success('Başarılı', 'Satıcı kaydınız tamamlandı! Onay sonrası satış yapmaya başlayabilirsiniz.');
      router.push('/account');
    } catch (err: any) {
      console.error('Error registering as seller:', err);
      showError('Kayıt sırasında hata oluştu: ' + (err.message || 'Bilinmeyen hata'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">Kep'te Satış Yap</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kep'te Satış Yap</h1>
            <p className="text-gray-600">Ürünlerinizi milyonlarca müşteriye ulaştırın ve dijital dünyada satış yapmaya başlayın.</p>
          </div>

          {!user ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-6">Satıcı kaydı için önce giriş yapmalısınız</p>
              <Link href="/auth/login" className="btn btn-primary px-8">
                Giriş Yap
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mağaza Adı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="Örn: Avsallar Elektronik"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Vergi No</label>
                  <input
                    type="text"
                    value={formData.taxNumber}
                    onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="Vergi numaranız"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="0500 000 00 00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Adres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="Mağaza adresiniz"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">İlçe</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Şehir</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mağaza Açıklaması</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="Mağazanız hakkında kısa bir açıklama..."
                />
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Not:</strong> Satıcı kaydınız admin onayından sonra aktif olacaktır. Onay süreci 1-2 iş günü sürebilir.
                </p>
              </div>

              <div className="flex gap-4">
                <Link href="/" className="btn btn-ghost px-8">
                  İptal
                </Link>
                <button type="submit" disabled={loading} className="btn btn-primary px-8 flex-1">
                  {loading ? 'Kaydediliyor...' : 'Satıcı Kaydı Oluştur'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
