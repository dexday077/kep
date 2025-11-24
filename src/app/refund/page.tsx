'use client';

import Link from 'next/link';

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">İptal ve İade Politikası</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">İptal ve İade Politikası</h1>
          <p className="text-sm text-gray-500 mb-8">Son Güncelleme: 11 Kasım 2025</p>

          <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Cayma Hakkı</h2>
              <p>
                6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, tüketiciler 14 (on dört) gün içinde cayma hakkını kullanabilir.
              </p>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
                <p className="font-semibold text-blue-900 mb-2">Cayma Hakkı Süresi:</p>
                <p className="text-blue-800 text-sm">
                  Siparişin teslim alındığı tarihten itibaren 14 gün içinde cayma hakkınızı kullanabilirsiniz.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. İptal İşlemleri</h2>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">2.1. Sipariş İptali</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Siparişiniz hazırlanmaya başlamadıysa, hesabınızdan iptal edebilirsiniz</li>
                <li>Hazırlanmaya başlanan siparişler için satıcı ile iletişime geçiniz</li>
                <li>İptal edilen siparişlerin ödemesi 3-5 iş günü içinde iade edilir</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">2.2. İptal Bildirimi</h3>
              <p>İptal talebinizi aşağıdaki yöntemlerle iletebilirsiniz:</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Hesabım → Siparişlerim → İptal Et</li>
                  <li>E-posta: iade@keporganization.com</li>
                  <li>Kep Adresi: kepenekinsaat@hs01.kep.tr</li>
                  <li>Telefon: 0242 517 3440</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. İade Koşulları</h2>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-4">3.1. İade Edilebilir Ürünler</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ürün kullanılmamış, hasarsız ve orijinal ambalajında olmalıdır</li>
                <li>Etiketler ve faturalar ürünle birlikte gönderilmelidir</li>
                <li>Ürünün orijinal durumunda olması gerekir</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">3.2. İade Edilemeyecek Ürünler</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kişiselleştirilmiş ürünler</li>
                <li>Hızlı bozulabilir gıda ürünleri</li>
                <li>Açıldıktan sonra sağlık ve hijyen açısından iade edilemeyecek ürünler (iç çamaşırı, mayo vb.)</li>
                <li>Dijital içerikler (indirilmiş, kullanılmış)</li>
                <li>Son kullanma tarihi geçmiş ürünler</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. İade İşlem Adımları</h2>
              <ol className="list-decimal pl-6 space-y-3">
                <li>
                  <strong>İade Talebi Oluşturun:</strong> Hesabım → Siparişlerim → İade Talep Et
                </li>
                <li>
                  <strong>İade Nedeni Belirtin:</strong> Formu doldurun ve neden seçin
                </li>
                <li>
                  <strong>Onay Bekleyin:</strong> İade talebiniz 1-2 iş günü içinde onaylanır
                </li>
                <li>
                  <strong>Ürünü Gönderin:</strong> Onay sonrası kargo bilgileri size iletilecektir
                </li>
                <li>
                  <strong>İnceleme:</strong> Ürün kontrol edildikten sonra ödeme iade edilir
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. İade Kargo Ücretleri</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Normal İade:</strong> Kargo ücreti müşteriye aittir
                </li>
                <li>
                  <strong>Ürün Hatası/Defolu:</strong> Kargo ücreti satıcıya aittir
                </li>
                <li>
                  <strong>Yanlış Ürün:</strong> Kargo ücreti satıcıya aittir
                </li>
                <li>
                  <strong>500 TL ve Üzeri İade:</strong> Ücretsiz iade kargo (ürün hatası yoksa müşteriye aittir)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. İade Ödeme Süresi</h2>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Ürün kontrol edildikten sonra ödeme 3-5 iş günü içinde iade edilir</li>
                  <li>İade, aynı ödeme yöntemiyle yapılır (kredi kartı → kredi kartı, havale → havale)</li>
                  <li>Banka işlem süreleri nedeniyle gecikme olabilir</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Değişim</h2>
              <p>
                Ürün değişimi için önce iade işlemi yapılır, sonra yeni ürün siparişi verilir. Değişim kargo ücreti müşteriye aittir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">8. Garanti ve Arızalı Ürünler</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Garanti kapsamındaki arızalı ürünler için ücretsiz tamir veya değişim yapılır</li>
                <li>Garanti süresi üretici garantisi ile belirlenir</li>
                <li>Arızalı ürünler için kargo ücreti satıcıya aittir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">9. İletişim</h2>
              <p>İptal ve iade ile ilgili sorularınız için:</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="mb-2"><strong>Şirket Ünvanı:</strong> KEPENEK İNŞAAT SAN. VE TİC. LTD.ŞTİ.</p>
                <p className="mb-2"><strong>Vergi No:</strong> 5440052468</p>
                <p className="mb-2"><strong>E-posta:</strong> iade@keporganization.com</p>
                <p className="mb-2"><strong>Kep Adresi:</strong> kepenekinsaat@hs01.kep.tr</p>
                <p className="mb-2"><strong>Telefon:</strong> 0242 517 3440</p>
                <p className="mb-2"><strong>Çalışma Saatleri:</strong> Pazartesi - Cuma, 09:00 - 18:00</p>
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



