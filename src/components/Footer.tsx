import Link from "next/link";

export default function Footer() {
	return (
		<footer className="border-t border-black/5 py-12 mt-16 bg-white/60 backdrop-blur supports-[backdrop-filter]:bg-white/70">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-sm">
					<div>
						<h3 className="mb-3 font-semibold text-slate-900">Kategoriler</h3>
						<ul className="space-y-2 text-slate-600">
							<li><Link href="#">Elektronik</Link></li>
							<li><Link href="#">Moda</Link></li>
							<li><Link href="#">Ev & Yaşam</Link></li>
							<li><Link href="#">Spor</Link></li>
						</ul>
					</div>
					<div>
						<h3 className="mb-3 font-semibold text-slate-900">Müşteri</h3>
						<ul className="space-y-2 text-slate-600">
							<li><Link href="#">Yardım</Link></li>
							<li><Link href="#">İadeler</Link></li>
							<li><Link href="#">Sipariş Takip</Link></li>
							<li><Link href="#">Güvenlik</Link></li>
						</ul>
					</div>
					<div>
					<h3 className="mb-3 font-semibold text-slate-900">Kep Marketplace</h3>
					<ul className="space-y-2 text-slate-600">
						<li><Link href="/about">Hakkımızda</Link></li>
						<li><Link href="/careers">Kariyer</Link></li>
						<li><Link href="/press">Basın</Link></li>
						<li><Link href="/contact">İletişim</Link></li>
					</ul>
					</div>
					<div>
						<h3 className="mb-3 font-semibold text-slate-900">Hukuk</h3>
						<ul className="space-y-2 text-slate-600">
							<li><Link href="#">KVKK</Link></li>
							<li><Link href="#">Çerez Politikası</Link></li>
							<li><Link href="#">Kullanım Şartları</Link></li>
							<li><Link href="#">Mesafeli Satış</Link></li>
						</ul>
					</div>
				</div>
				<div className="mt-10 flex items-center justify-between text-xs text-slate-500">
					<p>© {new Date().getFullYear()} Kep Marketplace</p>
					<div className="flex gap-3">
						<a href="#" aria-label="Twitter">𝕏</a>
						<a href="#" aria-label="Instagram">IG</a>
						<a href="#" aria-label="Facebook">f</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
