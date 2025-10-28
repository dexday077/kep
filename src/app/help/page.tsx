'use client';

import Link from 'next/link';

const faqCategories = [
  {
    id: 'shopping',
    title: 'Alışveriş',
    icon: '🛒',
    questions: [
      {
        q: 'Siparişimi nasıl veririm?',
        a: "Sepetinize ürünleri ekleyin, ödeme sayfasına gidin ve siparişinizi tamamlayın. Detaylı bilgi için 'Sepet' sayfasına bakabilirsiniz.",
      },
      {
        q: 'Kargo ücreti ne kadar?',
        a: '500 TL ve üzeri alışverişlerde ücretsiz kargo! 500 TL altı siparişlerde 29 TL kargo ücreti uygulanmaktadır.',
      },
      {
        q: 'Siparişimi nasıl iptal edebilirim?',
        a: 'Siparişiniz hazırlanmaya başlamadıysa hesabınızdan iptal edebilirsiniz. Daha fazla bilgi için sipariş detaylarınıza bakın.',
      },
    ],
  },
  {
    id: 'payment',
    title: 'Ödeme',
    icon: '💳',
    questions: [
      {
        q: 'Hangi ödeme yöntemleri kabul ediliyor?',
        a: 'Kredi kartı, banka kartı, kapıda ödeme ve havale/EFT ödeme yöntemlerini kabul ediyoruz.',
      },
      {
        q: 'Güvenli ödeme nasıl yapılır?',
        a: 'Tüm ödemeler SSL şifreleme ile korunmaktadır. Kart bilgileriniz asla saklanmaz.',
      },
      {
        q: 'İade işlemi ne kadar sürer?',
        a: 'İade talebi onaylandıktan sonra ödemeniz 3-5 iş günü içinde hesabınıza iade edilir.',
      },
    ],
  },
  {
    id: 'delivery',
    title: 'Kargo & Teslimat',
    icon: '🚚',
    questions: [
      {
        q: 'Siparişim ne zaman teslim edilir?',
        a: 'Avsallar ve Alanya bölgesinde 1-2 gün içinde teslimat yapılmaktadır. Kargo durumunu hesabınızdan takip edebilirsiniz.',
      },
      {
        q: 'Kargo takibi nasıl yapılır?',
        a: 'Siparişinizin durumunu "Siparişlerim" sayfasından takip edebilirsiniz. Kargo takip numaranız e-posta ve SMS ile gönderilir.',
      },
      {
        q: 'Teslimatta olmadım, ne yapmalıyım?',
        a: 'Kargo firması ile iletişime geçin veya bizimle iletişime geçin. Siparişiniz tekrar teslim edilecektir.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Hesap',
    icon: '👤',
    questions: [
      {
        q: 'Şifremi nasıl değiştirebilirim?',
        a: 'Hesabım > Ayarlar > Şifre Değiştir bölümünden şifrenizi değiştirebilirsiniz.',
      },
      {
        q: 'Adresimi nasıl eklerim?',
        a: 'Hesabım > Adreslerim sayfasından yeni adres ekleyebilir, mevcut adreslerinizi düzenleyebilirsiniz.',
      },
      {
        q: 'Sipariş geçmişimi nasıl görüntülerim?',
        a: 'Hesabım > Siparişlerim sayfasından tüm siparişlerinizi görüntüleyebilirsiniz.',
      },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">Yardım & Destek</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Yardım & Destek</h1>
          <p className="text-gray-600">Sıkça sorulan sorular ve destek bilgileri</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Contact Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">İletişim</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Telefon</p>
                  <a href="tel:+902425173440" className="text-orange-600 hover:underline">
                    0242 517 34 40
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">E-posta</p>
                  <a href="mailto:info@keporganization.com" className="text-orange-600 hover:underline">
                    info@keporganization.com
                  </a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Çalışma Saatleri</p>
                  <p className="text-gray-600 text-sm">Pazartesi - Cumartesi: 09:00 - 18:00</p>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Sorunuz mu var? Bizimle iletişime geçmekten çekinmeyin!</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {faqCategories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>{category.icon}</span>
                    {category.title}
                  </h2>
                  <div className="space-y-4">
                    {category.questions.map((item, index) => (
                      <details key={index} className="group">
                        <summary className="cursor-pointer font-semibold text-gray-900 py-2 hover:text-orange-600 transition-colors">{item.q}</summary>
                        <p className="text-gray-600 mt-2 pl-4 border-l-2 border-orange-200 py-2">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
