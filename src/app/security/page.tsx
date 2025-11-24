'use client';

import Link from 'next/link';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">Ödeme Güvenliği</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Ödeme Güvenliği</h1>
          <p className="text-sm text-gray-500 mb-8">Son Güncelleme: 11 Kasım 2025</p>

          <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. SSL Şifreleme</h2>
              <p>
                Kep Marketplace, tüm veri aktarımlarını 256-bit SSL/TLS şifreleme ile korumaktadır. Bu, bankacılık seviyesinde güvenlik anlamına gelir.
              </p>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mt-4">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="font-semibold text-green-800">Güvenli Bağlantı Aktif</p>
                </div>
                <p className="text-green-700 text-sm mt-2">
                  Tarayıcınızın adres çubuğunda kilit simgesi görüyorsanız, bağlantınız güvenlidir.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Ödeme Güvenliği</h2>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">2.1. Güvenli Ödeme Sağlayıcıları</h3>
              <p>
                Tüm ödeme işlemleri, Türkiye&apos;nin önde gelen ödeme kuruluşları aracılığıyla gerçekleştirilmektedir:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>PayTR:</strong> PCI-DSS uyumlu, güvenli ödeme altyapısı</li>
                <li><strong>Iyzico:</strong> Bankacılık seviyesinde güvenlik standartları</li>
                <li><strong>3D Secure:</strong> Tüm kredi kartı işlemlerinde zorunlu</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">2.2. Kart Bilgileri</h3>
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <p className="font-semibold text-amber-800 mb-2">⚠️ Önemli:</p>
                <ul className="list-disc pl-6 space-y-1 text-amber-700 text-sm">
                  <li>Kart bilgileriniz asla bizim sunucularımızda saklanmaz</li>
                  <li>Tüm ödeme verileri ödeme sağlayıcılarının güvenli sunucularında işlenir</li>
                  <li>Kart bilgilerinize sadece ödeme sağlayıcıları erişebilir</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Veri Güvenliği</h2>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">3.1. Veri Koruma</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kişisel verileriniz KVKK uyumlu şekilde korunmaktadır</li>
                <li>Düzenli güvenlik denetimleri yapılmaktadır</li>
                <li>Veri yedekleme ve felaket kurtarma planları mevcuttur</li>
                <li>Erişim kontrolü ve yetkilendirme sistemleri aktif</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">3.2. Güvenlik Standartları</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>PCI-DSS uyumluluğu (Ödeme Kartı Endüstrisi Veri Güvenliği Standardı)</li>
                <li>ISO 27001 bilgi güvenliği yönetim sistemi (hedefleniyor)</li>
                <li>Düzenli penetrasyon testleri</li>
                <li>Güvenlik açığı taramaları</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Dolandırıcılık Önleme</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Otomatik dolandırıcılık tespit sistemleri</li>
                <li>Şüpheli işlem uyarıları</li>
                <li>IP adresi ve konum kontrolü</li>
                <li>İşlem limitleri ve doğrulama adımları</li>
                <li>24/7 güvenlik izleme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Güvenli Alışveriş İpuçları</h2>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <p className="font-semibold text-blue-900 mb-3">Siz de güvenliğinize dikkat edin:</p>
                <ul className="list-disc pl-6 space-y-2 text-blue-800 text-sm">
                  <li>Güçlü ve benzersiz şifreler kullanın</li>
                  <li>Herkese açık Wi-Fi ağlarında alışveriş yapmayın</li>
                  <li>Tarayıcınızı güncel tutun</li>
                  <li>Şüpheli e-postalara tıklamayın</li>
                  <li>Hesap aktivitelerinizi düzenli kontrol edin</li>
                  <li>Çıkış yapmayı unutmayın (özellikle paylaşılan cihazlarda)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Güvenlik İhlali Bildirimi</h2>
              <p>
                Güvenlik ihlali şüpheniz varsa, derhal bizimle iletişime geçin:
              </p>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg mt-4">
                <p className="mb-2"><strong>Şirket Ünvanı:</strong> KEPENEK İNŞAAT SAN. VE TİC. LTD.ŞTİ.</p>
                <p className="mb-2"><strong>E-posta:</strong> security@keporganization.com</p>
                <p className="mb-2"><strong>Kep Adresi:</strong> kepenekinsaat@hs01.kep.tr</p>
                <p className="mb-2"><strong>Telefon:</strong> 0242 517 3440</p>
                <p className="text-sm text-red-700">
                  Güvenlik ihlalleri 7/24 izlenmekte ve derhal müdahale edilmektedir.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Sertifikalar ve Uyumluluk</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">✅ SSL Sertifikası</p>
                  <p className="text-sm text-gray-600">256-bit şifreleme</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">✅ PCI-DSS Uyumlu</p>
                  <p className="text-sm text-gray-600">Ödeme güvenliği standardı</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">✅ KVKK Uyumlu</p>
                  <p className="text-sm text-gray-600">Kişisel veri koruma</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">✅ 3D Secure</p>
                  <p className="text-sm text-gray-600">Kart doğrulama</p>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link href="/" className="text-orange-600 hover:text-orange-700 font-semibold">
              ← Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



