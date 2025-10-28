'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-orange-600">
            Ana Sayfa
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-sm text-gray-900 font-medium">Hakkımızda</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hakkımızda</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Avsallar ve Alanya bölgesinin en büyük dijital çarşısı olarak yerel esnaf ve müşterileri bir araya getiriyoruz.</p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Misyonumuz</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Kep Marketplace olarak, yerel işletmelerin dijitalleşmesini destekleyerek, müşterilerin ihtiyaç duyduğu ürün ve hizmetleri tek bir platformda buluşturuyoruz. Komşudan komşuya e-ticaret modeliyle güvenli, hızlı ve uygun fiyatlı alışveriş
            deneyimi sunuyoruz.
          </p>
          <p className="text-gray-700 leading-relaxed">Amacımız, Avsallar ve Alanya bölgesindeki tüm esnafın dijital dünyada varlık göstermesini sağlamak ve müşterilere yerel ürünlere kolay erişim imkanı sunmak.</p>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hızlı Teslimat</h3>
            <p className="text-sm text-gray-600">Bölgesel hızlı teslimat ağımızla siparişleriniz kapınızda</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Güvenli Alışveriş</h3>
            <p className="text-sm text-gray-600">SSL şifreleme ve güvenli ödeme sistemleri ile korumalı</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
            <div className="text-4xl mb-4">🏪</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Yerel Esnaf</h3>
            <p className="text-sm text-gray-600">500+ yerel işletme ve esnaf tek platformda</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-8 md:p-12 text-white mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Rakamlarla Kep Marketplace</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-sm opacity-90">Yerel Esnaf</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-sm opacity-90">Ürün Çeşidi</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">1-2</div>
              <div className="text-sm opacity-90">Gün Teslimat</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm opacity-90">Destek</div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bize Ulaşın</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Adres</h3>
              <p className="text-gray-600">
                Avsallar Mahallesi
                <br />
                İncekum Caddesi
                <br />
                Kübra İş Merkezi, No: 10
                <br />
                Alanya / Antalya
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">İletişim</h3>
              <p className="text-gray-600 mb-2">
                <strong>Telefon:</strong>{' '}
                <a href="tel:+902425173440" className="text-orange-600 hover:underline">
                  0242 517 34 40
                </a>
              </p>
              <p className="text-gray-600">
                <strong>E-posta:</strong>{' '}
                <a href="mailto:info@keporganization.com" className="text-orange-600 hover:underline">
                  info@keporganization.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
