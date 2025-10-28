export default function PressPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-4">Basın</h1>
      <p className="text-gray-700 leading-7 mb-4">Basın ilişkileri ve medya kit talepleri için lütfen iletişime geçin.</p>
      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>
          <strong>Basın iletişim:</strong>{' '}
          <a href="mailto:info@keporganization.com" className="text-orange-600 hover:underline">
            info@keporganization.com
          </a>
        </li>
        <li>
          <strong>Telefon:</strong>{' '}
          <a href="tel:+902425173440" className="text-orange-600 hover:underline">
            0242 517 34 40
          </a>
        </li>
        <li>Logo ve marka kullanım rehberi istek üzerine paylaşılır.</li>
      </ul>
    </main>
  );
}
