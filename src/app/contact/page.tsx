export default function ContactPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-4">İletişim</h1>
      <p className="text-gray-700 mb-6">Her türlü soru ve öneriniz için bize ulaşın.</p>
      <div className="rounded-lg border border-gray-200 p-6 bg-white">
        <div className="text-sm text-gray-700 mb-2">
          <strong>E-posta:</strong>{' '}
          <a href="mailto:info@keporganization.com" className="text-orange-600 hover:underline">
            info@keporganization.com
          </a>
        </div>
        <div className="text-sm text-gray-700 mb-2">
          <strong>Telefon:</strong>{' '}
          <a href="tel:+902425173440" className="text-orange-600 hover:underline">
            0242 517 34 40
          </a>
        </div>
        <div className="text-sm text-gray-700">Adres: Avsallar Mahallesi, İncekum Caddesi, Alanya / Antalya</div>
      </div>
    </main>
  );
}
