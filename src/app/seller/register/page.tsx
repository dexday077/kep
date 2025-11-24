'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToastContext } from '@/context/ToastContext';
import Link from 'next/link';
import { fetchUnsplashImage } from '@/lib/unsplash';

export default function SellerRegisterPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { success, error: showError } = useToastContext();
  const [loading, setLoading] = useState(false);
  const heroFallback = 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=900&fit=crop&q=80';
  const ctaFallback = 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=1200&h=900&fit=crop&q=80';
  const [heroImage, setHeroImage] = useState<string>(heroFallback);
  const [ctaImage, setCtaImage] = useState<string>(ctaFallback);
  const sellerBenefits = [
    {
      title: '30 Dakikada Teslimat Ağı',
      description: 'Yerel kuryelerimiz ile siparişlerinizi aynı gün içinde müşterilere ulaştırın.',
      icon: '⚡',
    },
    {
      title: 'Komisyon Avantajları',
      description: 'Minimum komisyon oranları ve erken ödeme seçenekleriyle nakit akışınızı koruyun.',
      icon: '💸',
    },
    {
      title: 'Profesyonel Satıcı Paneli',
      description: 'Stok, sipariş ve kampanya yönetimini tek panelden yönetin.',
      icon: '📊',
    },
    {
      title: 'Yerel Destek Ekibi',
      description: '7/24 aktif destek ekibi ve eğitim içerikleriyle satışlarınızı büyütün.',
      icon: '🤝',
    },
  ];

  const onboardingSteps = [
    { title: '1. Kayıt Olun', description: 'Bilgilerinizi paylaşın ve satıcı profilinizi oluşturun.' },
    { title: '2. Onay Süreci', description: 'Ekibimiz mağazanızı hızlıca doğrulasın.' },
    { title: '3. Ürün Ekleyin', description: 'Ürünlerinizi kolayca yükleyin, kampanyalar oluşturun.' },
    { title: '4. Satışa Başlayın', description: 'Siparişlerinizi takip edin, kazancınızı artırın.' },
  ];

  useEffect(() => {
    let active = true;

    const loadImages = async () => {
      const [hero, cta] = await Promise.all([
        fetchUnsplashImage('local marketplace vendor', heroFallback),
        fetchUnsplashImage('business handshake partnership', ctaFallback, 'landscape'),
      ]);

      if (active) {
        setHeroImage(hero);
        setCtaImage(cta);
      }
    };

    loadImages();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">Kep&apos;te Satış Yap</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kep&apos;te Satış Yap</h1>
            <p className="text-gray-600">Ürünlerinizi milyonlarca müşteriye ulaştırın ve dijital dünyada satış yapmaya başlayın.</p>
          </div>

          {!user ? (
            <div className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-semibold">
                    <span>Satıcı Ekosistemine Katılın</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    Kep Marketplace ile satışa başlayın, yerel müşterilere anında ulaşın.
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Kep Marketplace, yerel esnaf ve üreticilerin dijitalde büyümesi için tasarlandı. Ürünlerinizi ekleyin,
                    satışlarınızı artırın ve profesyonel destekle işinizi ölçeklendirin.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link href="/auth/register?seller=true" className="btn btn-primary px-8 py-3 text-base">
                      Hemen Satıcı Ol
                    </Link>
                    <Link href="/auth/login" className="btn btn-ghost px-8 py-3 text-base">
                      Zaten Hesabım Var
                    </Link>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-2xl shadow-xl">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${heroImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/85 via-orange-600/85 to-red-600/80" />
                  <div className="relative text-white p-10 space-y-5">
                    <h3 className="text-xl font-semibold">Neden Kep Marketplace?</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <span className="mt-1">📦</span>
                        <p>Yerel kargo ağı ile aynı gün teslimat.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="mt-1">📈</span>
                        <p>Satıcı panelinden gerçek zamanlı sipariş takibi.</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="mt-1">🎯</span>
                        <p>Hedefli kampanyalarla satışlarınızı hızla artırın.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sellerBenefits.map((benefit) => (
                  <div key={benefit.title} className="flex items-start gap-4 bg-orange-50 border border-orange-100 rounded-xl p-5">
                    <div className="text-3xl">{benefit.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{benefit.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Satışa Başlama Süreci</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {onboardingSteps.map((step) => (
                    <div key={step.title} className="relative">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shadow-md">{step.title.split('.')[0]}</div>
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 h-full">
                        <h4 className="text-sm font-semibold text-gray-900 mb-2">{step.title}</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl border border-orange-200 shadow-lg text-center">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${ctaImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="absolute inset-0 bg-orange-500/80" />
                <div className="relative p-8 text-white space-y-4">
                  <h3 className="text-2xl font-bold">Hazır mısınız?</h3>
                  <p className="text-white/90">Şimdi kaydolun, ürünlerinizi dakikalar içinde satışa açın.</p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link href="/auth/register?seller=true" className="btn btn-primary px-10 py-3 text-base">
                      Satıcı Kaydı Oluştur
                    </Link>
                    <Link href="/auth/login" className="btn btn-ghost px-10 py-3 text-base">
                      Giriş Yap
                    </Link>
                  </div>
                </div>
              </div>
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
