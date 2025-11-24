'use client';

import Link from 'next/link';

export default function SalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">Mesafeli Satış Sözleşmesi</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mesafeli Satış Sözleşmesi</h1>
          <p className="text-sm text-gray-500 mb-8">Son Güncelleme: 11 Kasım 2025</p>

          <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Taraflar</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="mb-2"><strong>SATICI:</strong></p>
                <p className="mb-2">KEPENEK İNŞAAT SAN. VE TİC. LTD.ŞTİ.</p>
                <p className="mb-2">Avsallar Mahallesi, İncekum Caddesi, Kübra İş Merkezi, No: 10, Alanya / Antalya</p>
                <p className="mb-2"><strong>Vergi Dairesi:</strong> Alanya Vergi Dairesi</p>
                <p className="mb-2"><strong>Vergi No:</strong> 5440052468</p>
                <p className="mb-2"><strong>Telefon:</strong> 0242 517 3440</p>
                <p className="mb-2"><strong>E-posta:</strong> info@keporganization.com</p>
                <p className="mb-2"><strong>Kep Adresi:</strong> kepenekinsaat@hs01.kep.tr</p>
                <p className="mt-4 mb-2"><strong>ALICI:</strong></p>
                <p>Platform üzerinden sipariş veren müşteri</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Konu</h2>
              <p>
                Bu sözleşme, Alıcı&apos;nın Kep Marketplace platformu üzerinden satın aldığı ürün ve hizmetlerin satışı ve teslimatına ilişkin hak ve yükümlülükleri düzenlemektedir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Sipariş ve Ödeme</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Siparişler platform üzerinden elektronik ortamda verilir</li>
                <li>Ödeme, güvenli ödeme sağlayıcıları (PayTR, Iyzico) üzerinden yapılır</li>
                <li>Fiyatlar KDV dahildir</li>
                <li>Kargo ücretleri ayrıca hesaplanır ve sipariş özetinde gösterilir</li>
                <li>Sipariş onayı e-posta ile gönderilir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">4. Teslimat</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Teslimat adresi sipariş sırasında belirtilir</li>
                <li>Teslimat süresi ürün/hizmet türüne göre değişir (1-3 iş günü)</li>
                <li>Kargo firması tarafından teslim edilir</li>
                <li>Teslimat sırasında hasarlı ürün kabul edilmemelidir</li>
                <li>Adres hatasından kaynaklanan gecikmelerden Satıcı sorumlu değildir</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">5. Cayma Hakkı</h2>
              <p className="font-semibold mb-2">5.1. Cayma Hakkı Süresi</p>
              <p>
                Tüketici, sözleşmeden 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkını kullanabilir.
              </p>

              <p className="font-semibold mb-2 mt-4">5.2. Cayma Hakkının Kullanılamayacağı Durumlar</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tüketicinin isteği ile kişiselleştirilmiş ürünler</li>
                <li>Hızlı bozulabilir veya son kullanma tarihi geçmiş ürünler</li>
                <li>Açıldıktan sonra sağlık ve hijyen açısından iade edilemeyecek ürünler</li>
                <li>Malzeme niteliği itibariyle geri gönderilemeyecek ürünler</li>
                <li>Hizmet sözleşmeleri (teslim edildikten sonra)</li>
              </ul>

              <p className="font-semibold mb-2 mt-4">5.3. Cayma Bildirimi</p>
              <p>
                Cayma hakkını kullanmak için aşağıdaki yöntemlerle bildirimde bulunabilirsiniz:
              </p>
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg mt-4">
                <p className="mb-2"><strong>E-posta:</strong> iade@keporganization.com</p>
                <p className="mb-2"><strong>Kep Adresi:</strong> kepenekinsaat@hs01.kep.tr</p>
                <p className="mb-2"><strong>Telefon:</strong> 0242 517 3440</p>
                <p><strong>Platform:</strong> Hesabım → Siparişlerim → İade Talep Et</p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">6. İade ve İade İşlemleri</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>İade edilecek ürün, kullanılmamış, hasarsız ve orijinal ambalajında olmalıdır</li>
                <li>İade kargo ücreti Alıcı&apos;ya aittir (ürün hatası varsa Satıcı&apos;ya aittir)</li>
                <li>Ürün iade edildikten sonra ödeme 14 gün içinde iade edilir</li>
                <li>İade işlemi aynı ödeme yöntemiyle yapılır</li>
                <li>Ürün hasarlı veya eksik ise iade kabul edilmez</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">7. Garanti ve Sorumluluk</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ürünler yasal garanti süresi içinde garanti kapsamındadır</li>
                <li>Garanti belgeleri ürünle birlikte teslim edilir</li>
                <li>Üretici garantisi geçerlidir</li>
                <li>Satıcı, ürünün ayıplı olmasından sorumludur</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">8. Şikayet ve İtiraz</h2>
              <p>
                Şikayet ve itirazlarınızı aşağıdaki kanallardan iletebilirsiniz:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <p className="mb-2"><strong>E-posta:</strong> sikayet@keporganization.com</p>
                <p className="mb-2"><strong>Kep Adresi:</strong> kepenekinsaat@hs01.kep.tr</p>
                <p className="mb-2"><strong>Telefon:</strong> 0242 517 3440</p>
                <p className="mb-2"><strong>Adres:</strong> Avsallar Mahallesi, İncekum Caddesi, Kübra İş Merkezi, No: 10, Alanya / Antalya</p>
                <p className="mt-4">
                  <strong>Tüketici Hakem Heyeti:</strong> Alanya Tüketici Hakem Heyeti
                </p>
                <p>
                  <strong>Tüketici Mahkemesi:</strong> Alanya Asliye Tüketici Mahkemesi
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">9. Kişisel Verilerin Korunması</h2>
              <p>
                Kişisel verilerinizin işlenmesi hakkında detaylı bilgi için{' '}
                <Link href="/kvkk" className="text-orange-600 hover:underline">
                  KVKK Aydınlatma Metni
                </Link>{' '}
                sayfamızı ziyaret edebilirsiniz.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">10. Uygulanacak Hukuk ve Yetki</h2>
              <p>
                Bu sözleşme Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıklar Alanya/Antalya mahkemelerinde çözülecektir.
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



