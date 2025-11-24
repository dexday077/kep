'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">Gizlilik Politikası</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Gizlilik Politikası</h1>
          <p className="text-sm text-gray-500 mb-8">Son Güncelleme: 11 Kasım 2025</p>

          <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Giriş</h2>
              <p>
                Kep Marketplace (&quot;Biz&quot;, &quot;Bizim&quot;, &quot;Platform&quot;) olarak, gizliliğinize saygı duyuyor ve kişisel bilgilerinizin korunmasına önem veriyoruz. Bu Gizlilik Politikası, platformumuzu kullanırken topladığımız bilgileri, bu bilgileri nasıl kullandığımızı ve paylaştığımızı açıklamaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Toplanan Bilgiler</h2>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">2.1. Sizin Tarafınızdan Sağlanan Bilgiler</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hesap oluştururken: ad, soyad, e-posta, telefon, şifre</li>
                <li>Sipariş verirken: teslimat adresi, fatura bilgileri</li>
                <li>Satıcı kaydı sırasında: işletme bilgileri, vergi numarası, IBAN</li>
                <li>İletişim formları: mesaj içeriği, iletişim bilgileri</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">2.2. Otomatik Toplanan Bilgiler</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP adresi ve konum bilgileri</li>
                <li>Tarayıcı türü ve sürümü</li>
                <li>İşletim sistemi bilgileri</li>
                <li>Site kullanım verileri (sayfa görüntülemeleri, tıklamalar, süre)</li>
                <li>Çerezler ve benzeri teknolojiler</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Bilgilerin Kullanımı</h2>
              <p>Toplanan bilgiler aşağıdaki amaçlarla kullanılmaktadır:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Platform hizmetlerinin sunulması ve iyileştirilmesi</li>
                <li>Sipariş işlemlerinin gerçekleştirilmesi</li>
                <li>Müşteri hizmetleri ve destek sağlanması</li>
                <li>Güvenlik ve dolandırıcılık önleme</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>Pazarlama ve iletişim (izin verilmesi halinde)</li>
                <li>İstatistiksel analizler ve raporlama</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Bilgi Paylaşımı</h2>
              <p>Kişisel bilgileriniz aşağıdaki durumlarda paylaşılabilir:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Hizmet Sağlayıcılar:</strong> Ödeme işlemcileri, kargo firmaları, bulut hizmet sağlayıcıları</li>
                <li><strong>Yasal Gereklilikler:</strong> Mahkeme kararları, yasal düzenlemeler</li>
                <li><strong>İş Ortakları:</strong> Güvenilir iş ortaklarımız (gizlilik anlaşmaları ile)</li>
                <li><strong>İzin Verdiğiniz Durumlar:</strong> Açık rızanız ile</li>
              </ul>
              <p className="mt-4">
                <strong>Önemli:</strong> Bilgileriniz asla üçüncü taraflara satılmamakta veya pazarlama amaçlı kullanılmamaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Veri Güvenliği</h2>
              <p>Verilerinizin güvenliği için aşağıdaki önlemleri almaktayız:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>SSL/TLS şifreleme (256-bit)</li>
                <li>Güvenli sunucu altyapısı ve erişim kontrolü</li>
                <li>Düzenli güvenlik denetimleri</li>
                <li>Personel eğitimleri ve gizlilik protokolleri</li>
                <li>Veri yedekleme ve felaket kurtarma planları</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Çerezler</h2>
              <p>
                Platformumuz, hizmet kalitesini artırmak ve kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır. Çerez kullanımı hakkında detaylı bilgi için{' '}
                <Link href="/cookies" className="text-orange-600 hover:underline">
                  Çerez Politikası
                </Link>{' '}
                sayfamızı ziyaret edebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Veri Saklama</h2>
              <p>
                Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve yasal saklama süreleri (ticari kayıtlar için 10 yıl) boyunca saklanmaktadır. Bu süre sonunda verileriniz güvenli şekilde silinmektedir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">8. Haklarınız</h2>
              <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Kişisel verilerinize erişim</li>
                <li>Düzeltme ve güncelleme</li>
                <li>Silme talep etme</li>
                <li>İtiraz etme</li>
                <li>Veri taşınabilirliği</li>
              </ul>
              <p className="mt-4">
                Haklarınızı kullanmak için: <strong>kvkk@keporganization.com</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">9. Çocukların Gizliliği</h2>
              <p>
                Platformumuz 18 yaş altındaki kullanıcılar için tasarlanmamıştır. Bilerek 18 yaş altındaki kişilerden kişisel bilgi toplamıyoruz. Eğer bir ebeveyn veya vasi olarak, çocuğunuzun bize bilgi verdiğini düşünüyorsanız, lütfen bizimle iletişime geçin.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">10. Değişiklikler</h2>
              <p>
                Bu Gizlilik Politikası zaman zaman güncellenebilir. Önemli değişiklikler e-posta veya site bildirimi ile duyurulacaktır. Güncel versiyon her zaman bu sayfada yayınlanmaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">11. İletişim</h2>
              <p>Gizlilik ile ilgili sorularınız için:</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="mb-2"><strong>Şirket Ünvanı:</strong> KEPENEK İNŞAAT SAN. VE TİC. LTD.ŞTİ.</p>
                <p className="mb-2"><strong>Vergi No:</strong> 5440052468</p>
                <p className="mb-2"><strong>E-posta:</strong> privacy@keporganization.com</p>
                <p className="mb-2"><strong>Kep Adresi:</strong> kepenekinsaat@hs01.kep.tr</p>
                <p className="mb-2"><strong>Telefon:</strong> 0242 517 3440</p>
                <p><strong>Adres:</strong> Avsallar Mahallesi, İncekum Caddesi, Kübra İş Merkezi, No: 10, Alanya / Antalya</p>
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



