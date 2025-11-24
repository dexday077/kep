'use client';

import Link from 'next/link';

export default function KVKKPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">KVKK Aydınlatma Metni</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">KVKK Aydınlatma Metni</h1>
          <p className="text-sm text-gray-500 mb-8">Son Güncelleme: 11 Kasım 2025</p>

          <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Veri Sorumlusu</h2>
              <p>
                <strong>KEPENEK İNŞAAT SAN. VE TİC. LTD.ŞTİ.</strong> olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamında veri sorumlusu sıfatıyla, kişisel verilerinizin işlenmesi ve korunması konusunda aşağıdaki bilgilendirmeyi yapmaktayız.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="mb-2"><strong>Şirket Ünvanı:</strong> KEPENEK İNŞAAT SAN. VE TİC. LTD.ŞTİ.</p>
                <p className="mb-2"><strong>Adres:</strong> Avsallar Mahallesi, İncekum Caddesi, Kübra İş Merkezi, No: 10, Alanya / Antalya</p>
                <p className="mb-2"><strong>Vergi Dairesi:</strong> Alanya Vergi Dairesi</p>
                <p className="mb-2"><strong>Vergi No:</strong> 5440052468</p>
                <p className="mb-2"><strong>Telefon:</strong> 0242 517 3440</p>
                <p className="mb-2"><strong>E-posta:</strong> info@keporganization.com</p>
                <p><strong>Kep Adresi:</strong> kepenekinsaat@hs01.kep.tr</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. İşlenen Kişisel Veriler</h2>
              <p>Kep Marketplace platformunda aşağıdaki kişisel verileriniz işlenmektedir:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, TC kimlik numarası (satıcılar için)</li>
                <li><strong>İletişim Bilgileri:</strong> E-posta adresi, telefon numarası, adres bilgileri</li>
                <li><strong>Mali Bilgiler:</strong> IBAN, fatura bilgileri (satıcılar için)</li>
                <li><strong>İşlem Bilgileri:</strong> Sipariş geçmişi, ödeme bilgileri, teslimat adresleri</li>
                <li><strong>Teknik Bilgiler:</strong> IP adresi, çerez bilgileri, tarayıcı bilgileri</li>
                <li><strong>Kullanım Bilgileri:</strong> Site kullanım verileri, tercihler, favoriler</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Kişisel Verilerin İşlenme Amaçları</h2>
              <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>E-ticaret platformu hizmetlerinin sunulması ve yönetimi</li>
                <li>Sipariş işlemlerinin gerçekleştirilmesi ve takibi</li>
                <li>Ödeme işlemlerinin güvenli şekilde yürütülmesi</li>
                <li>Müşteri hizmetleri ve destek süreçlerinin yönetimi</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                <li>Pazarlama ve iletişim faaliyetlerinin yürütülmesi (izin verilmesi halinde)</li>
                <li>Site güvenliği ve dolandırıcılık önleme</li>
                <li>İstatistiksel analizler ve raporlama</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Kişisel Verilerin İşlenme Hukuki Sebepleri</h2>
              <p>Kişisel verileriniz KVKK&apos;nın 5. ve 6. maddelerinde belirtilen aşağıdaki hukuki sebeplere dayanarak işlenmektedir:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Açık rızanız</li>
                <li>Sözleşmenin kurulması veya ifası ile doğrudan ilgili olması</li>
                <li>Yasal yükümlülüğün yerine getirilmesi</li>
                <li>Haklı menfaatlerimiz (güvenlik, hizmet kalitesi vb.)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Kişisel Verilerin Aktarımı</h2>
              <p>
                Kişisel verileriniz, hizmetlerimizin sunulması amacıyla aşağıdaki üçüncü taraflarla paylaşılabilir:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li><strong>Ödeme Kuruluşları:</strong> PayTR, Iyzico gibi ödeme sağlayıcıları (ödeme işlemleri için)</li>
                <li><strong>Kargo Firmaları:</strong> Teslimat hizmetleri için</li>
                <li><strong>Bulut Hizmet Sağlayıcıları:</strong> Supabase, Vercel (veri depolama ve hosting)</li>
                <li><strong>Yasal Otoriteler:</strong> Yasal yükümlülükler gereği</li>
              </ul>
              <p className="mt-4">
                Verileriniz yurt dışına aktarılmamaktadır. Tüm veriler Türkiye sınırları içinde işlenmektedir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Kişisel Verilerin Saklanma Süresi</h2>
              <p>
                Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve yasal saklama süreleri (örneğin, ticari kayıtlar için 10 yıl) boyunca saklanmaktadır. Bu süre sonunda verileriniz güvenli şekilde silinmektedir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. KVKK Kapsamındaki Haklarınız</h2>
              <p>KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse bilgi talep etme</li>
                <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içi/yurt dışı aktarılan üçüncü kişileri bilme</li>
                <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                <li>KVKK&apos;da öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme</li>
                <li>Düzeltme, silme, yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
                <li>İşlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
                <li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">8. Haklarınızı Kullanma Yöntemi</h2>
              <p>
                KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki yöntemlerle başvurabilirsiniz:
              </p>
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mt-4">
                <p className="mb-2"><strong>E-posta:</strong> kvkk@keporganization.com</p>
                <p className="mb-2"><strong>Kep Adresi:</strong> kepenekinsaat@hs01.kep.tr</p>
                <p className="mb-2"><strong>Posta:</strong> Avsallar Mahallesi, İncekum Caddesi, Kübra İş Merkezi, No: 10, Alanya / Antalya</p>
                <p className="mb-2"><strong>Telefon:</strong> 0242 517 3440</p>
                <p><strong>Not:</strong> Başvurularınız kimlik tespiti yapıldıktan sonra en geç 30 gün içinde yanıtlanacaktır.</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">9. Güvenlik</h2>
              <p>
                Kişisel verilerinizin güvenliği için SSL şifreleme, güvenli sunucu altyapısı ve erişim kontrolü gibi teknik ve idari tedbirler alınmaktadır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">10. Değişiklikler</h2>
              <p>
                Bu aydınlatma metni, yasal düzenlemelerdeki değişiklikler veya hizmetlerimizdeki güncellemeler nedeniyle güncellenebilir. Güncel versiyon her zaman bu sayfada yayınlanmaktadır.
              </p>
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



