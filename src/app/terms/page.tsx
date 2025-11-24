'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">Kullanım Şartları</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Kullanım Şartları</h1>
          <p className="text-sm text-gray-500 mb-8">Son Güncelleme: 11 Kasım 2025</p>

          <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Genel Hükümler</h2>
              <p>
                Bu Kullanım Şartları, Kep Marketplace platformunu (&quot;Platform&quot;, &quot;Site&quot;) kullanırken geçerlidir. Platformu kullanarak, bu şartları kabul etmiş sayılırsınız. Şartları kabul etmiyorsanız, lütfen platformu kullanmayın.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Tanımlar</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Platform:</strong> Kep Marketplace web sitesi ve mobil uygulamaları</li>
                <li><strong>Kullanıcı:</strong> Platformu ziyaret eden veya kullanan herkes</li>
                <li><strong>Müşteri:</strong> Platform üzerinden alışveriş yapan kullanıcı</li>
                <li><strong>Satıcı:</strong> Platform üzerinden ürün/hizmet satan işletme</li>
                <li><strong>Hizmet:</strong> Kep Marketplace tarafından sunulan tüm hizmetler</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Hesap Oluşturma ve Güvenlik</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hesap oluştururken doğru ve güncel bilgiler vermelisiniz</li>
                <li>Hesap bilgilerinizin gizliliğinden siz sorumlusunuz</li>
                <li>Şifrenizi güvenli tutmalı ve üçüncü kişilerle paylaşmamalısınız</li>
                <li>Hesabınızda yapılan tüm işlemlerden siz sorumlusunuz</li>
                <li>Şüpheli aktivite tespit edilirse hesabınız askıya alınabilir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Platform Kullanımı</h2>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">4.1. İzin Verilen Kullanım</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Yasal amaçlarla platformu kullanabilirsiniz</li>
                <li>Ürün ve hizmetleri görüntüleyebilir ve satın alabilirsiniz</li>
                <li>Yasalara uygun içerik paylaşabilirsiniz</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">4.2. Yasaklanan Faaliyetler</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Yasadışı faaliyetlerde bulunmak</li>
                <li>Sahte bilgi vermek veya kimlik hırsızlığı yapmak</li>
                <li>Platformu hacklemek, zararlı yazılım yüklemek</li>
                <li>Spam, phishing veya dolandırıcılık yapmak</li>
                <li>Telif hakkı ihlali yapmak</li>
                <li>Diğer kullanıcıları rahatsız etmek veya taciz etmek</li>
                <li>Platformun işleyişini bozmaya çalışmak</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Satın Alma İşlemleri</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fiyatlar ve stok durumu değişebilir, kesin bilgi sipariş anında geçerlidir</li>
                <li>Ödeme işlemleri güvenli ödeme sağlayıcıları üzerinden yapılmaktadır</li>
                <li>Sipariş onayı e-posta ile gönderilir</li>
                <li>İptal ve iade koşulları{' '}
                  <Link href="/sales" className="text-orange-600 hover:underline">
                    Mesafeli Satış Sözleşmesi
                  </Link>{' '}
                  kapsamındadır
                </li>
                <li>Vergiler ve kargo ücretleri ayrıca hesaplanır</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. Satıcı Yükümlülükleri</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Doğru ve güncel ürün bilgileri sağlamalıdır</li>
                <li>Yasalara uygun ürün/hizmet satmalıdır</li>
                <li>Siparişleri zamanında teslim etmelidir</li>
                <li>Müşteri şikayetlerine zamanında yanıt vermelidir</li>
                <li>Platform komisyonlarını ödemekle yükümlüdür</li>
                <li>Vergi ve yasal yükümlülüklerini yerine getirmelidir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Fikri Mülkiyet</h2>
              <p>
                Platform içeriği (logo, tasarım, metin, görseller) KEPENEK İNŞAAT SAN. VE TİC. LTD.ŞTİ.&apos;ye aittir ve telif hakkı koruması altındadır. İzinsiz kullanım yasaktır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">8. Sorumluluk Reddi</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Platform &quot;olduğu gibi&quot; sunulmaktadır, garanti verilmez</li>
                <li>Kesintisiz hizmet garantisi verilmez</li>
                <li>Üçüncü taraf içeriklerden sorumlu değiliz</li>
                <li>Kullanıcı hatalarından kaynaklanan zararlardan sorumlu değiliz</li>
                <li>Yasal sınırlar içinde maksimum sorumluluk, ödenen tutarla sınırlıdır</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">9. İptal ve İade</h2>
              <p>
                İptal ve iade koşulları{' '}
                <Link href="/sales" className="text-orange-600 hover:underline">
                  Mesafeli Satış Sözleşmesi
                </Link>{' '}
                ve{' '}
                <Link href="/refund" className="text-orange-600 hover:underline">
                  İade Politikası
                </Link>{' '}
                sayfalarında detaylı olarak açıklanmıştır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">10. Değişiklikler ve Fesih</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Bu şartlar zaman zaman güncellenebilir</li>
                <li>Önemli değişiklikler bildirilecektir</li>
                <li>Şartları ihlal eden hesaplar askıya alınabilir veya kapatılabilir</li>
                <li>Platform kullanımınızı her zaman sonlandırabilirsiniz</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">11. Uygulanacak Hukuk ve Yetki</h2>
              <p>
                Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklar Alanya/Antalya mahkemelerinde çözülecektir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">12. İletişim</h2>
              <p>Kullanım şartları ile ilgili sorularınız için:</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="mb-2"><strong>Şirket Ünvanı:</strong> KEPENEK İNŞAAT SAN. VE TİC. LTD.ŞTİ.</p>
                <p className="mb-2"><strong>Vergi No:</strong> 5440052468</p>
                <p className="mb-2"><strong>E-posta:</strong> legal@keporganization.com</p>
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



