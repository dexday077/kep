'use client';

import Link from 'next/link';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">Çerez Politikası</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Çerez Politikası</h1>
          <p className="text-sm text-gray-500 mb-8">Son Güncelleme: 11 Kasım 2025</p>

          <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Çerez Nedir?</h2>
              <p>
                Çerezler (cookies), web sitelerini ziyaret ettiğinizde tarayıcınız tarafından cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler, site deneyiminizi iyileştirmek, site işlevselliğini sağlamak ve analiz yapmak için kullanılır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Hangi Çerezleri Kullanıyoruz?</h2>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">2.1. Zorunlu Çerezler</h3>
              <p>Bu çerezler sitenin çalışması için gereklidir ve kapatılamaz:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Oturum Çerezleri:</strong> Giriş yapmanızı ve oturumunuzu korur</li>
                <li><strong>Güvenlik Çerezleri:</strong> Güvenli bağlantı ve dolandırıcılık önleme</li>
                <li><strong>Sepet Çerezleri:</strong> Sepetinizdeki ürünleri hatırlar</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">2.2. Performans Çerezleri</h3>
              <p>Site performansını ölçmek ve iyileştirmek için:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Sayfa yükleme süreleri</li>
                <li>Kullanıcı davranış analizi</li>
                <li>Hata takibi</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">2.3. İşlevsellik Çerezleri</h3>
              <p>Kullanıcı tercihlerinizi hatırlamak için:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Dil tercihi</li>
                <li>Bölge ayarları</li>
                <li>Görüntüleme tercihleri</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">2.4. Pazarlama Çerezleri</h3>
              <p>Size özel içerik ve reklamlar göstermek için (izin verilmesi halinde):</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Kişiselleştirilmiş öneriler</li>
                <li>Reklam etkinliği ölçümü</li>
                <li>Sosyal medya entegrasyonları</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Üçüncü Taraf Çerezleri</h2>
              <p>Platformumuz aşağıdaki üçüncü taraf hizmetlerini kullanmaktadır:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Google Analytics:</strong> Site kullanım analizi</li>
                <li><strong>Supabase:</strong> Veritabanı ve kimlik doğrulama</li>
                <li><strong>Ödeme Sağlayıcıları:</strong> Güvenli ödeme işlemleri</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Çerezleri Nasıl Yönetebilirsiniz?</h2>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">4.1. Tarayıcı Ayarları</h3>
              <p>Çoğu tarayıcı çerezleri yönetmenize izin verir:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve güvenlik → Çerezler</li>
                <li><strong>Firefox:</strong> Seçenekler → Gizlilik ve Güvenlik → Çerezler</li>
                <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler</li>
                <li><strong>Edge:</strong> Ayarlar → Gizlilik → Çerezler</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">4.2. Site Ayarları</h3>
              <p>
                Çerez tercihlerinizi Hesabım → Ayarlar → Gizlilik bölümünden yönetebilirsiniz.
              </p>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-4">
                <p className="font-semibold text-amber-800 mb-2">⚠️ Önemli Not:</p>
                <p className="text-amber-700 text-sm">
                  Zorunlu çerezleri devre dışı bırakırsanız, sitenin bazı özellikleri çalışmayabilir (örneğin, giriş yapma, sepet kullanma).
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Çerez Saklama Süreleri</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Oturum Çerezleri:</strong> Tarayıcı kapatılınca silinir</li>
                <li><strong>Kalıcı Çerezler:</strong> 30 gün ile 2 yıl arasında saklanır</li>
                <li><strong>Analitik Çerezler:</strong> 2 yıl</li>
                <li><strong>Pazarlama Çerezleri:</strong> 1 yıl</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Güncellemeler</h2>
              <p>
                Bu Çerez Politikası zaman zaman güncellenebilir. Önemli değişiklikler site üzerinden duyurulacaktır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. İletişim</h2>
              <p>Çerez politikası ile ilgili sorularınız için:</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="mb-2"><strong>Şirket Ünvanı:</strong> KEPENEK İNŞAAT SAN. VE TİC. LTD.ŞTİ.</p>
                <p className="mb-2"><strong>Vergi No:</strong> 5440052468</p>
                <p className="mb-2"><strong>E-posta:</strong> privacy@keporganization.com</p>
                <p className="mb-2"><strong>Kep Adresi:</strong> kepenekinsaat@hs01.kep.tr</p>
                <p><strong>Telefon:</strong> 0242 517 3440</p>
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



