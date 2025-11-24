export default function PressPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-4">Basın</h1>
      <p className="text-gray-700 leading-7 mb-4">Basın ilişkileri ve medya kit talepleri için lütfen iletişime geçin.</p>
      <div className="rounded-lg border border-gray-200 p-6 bg-white mb-6">
        <p className="text-sm font-semibold text-gray-900 mb-2">KEPENEK İNŞAAT SAN. VE TİC. LTD.ŞTİ.</p>
        <p className="text-sm text-gray-700 mb-1"><strong>Vergi No:</strong> 5440052468</p>
        <p className="text-sm text-gray-700"><strong>Vergi Dairesi:</strong> Alanya Vergi Dairesi</p>
      </div>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>
          <strong>Basın iletişim:</strong>{' '}
          <a href="mailto:info@keporganization.com" className="text-orange-600 hover:underline">
            info@keporganization.com
          </a>
        </li>
        <li>
          <strong>Kep Adresi:</strong>{' '}
          <a href="mailto:kepenekinsaat@hs01.kep.tr" className="text-orange-600 hover:underline">
            kepenekinsaat@hs01.kep.tr
          </a>
        </li>
        <li>
          <strong>Telefon:</strong>{' '}
          <a href="tel:+902425173440" className="text-orange-600 hover:underline">
            0242 517 3440
          </a>
        </li>
        <li>Logo ve marka kullanım rehberi istek üzerine paylaşılır.</li>
      </ul>
    </main>
  );
}
