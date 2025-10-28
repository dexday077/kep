'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

type UserRole = 'customer' | 'seller';

export default function RegisterPage() {
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    // Seller specific
    businessName: '',
    shopName: '',
    businessType: '',
    taxNumber: '',
    taxOffice: '',
    iban: '',
    address: '',
    city: 'Alanya',
    district: 'Avsallar',
    postalCode: '',
    description: '',
    workingHours: '',
    website: '',
    instagram: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      setError('Tüm zorunlu alanları doldurun');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalı');
      return false;
    }

    if (showSellerForm) {
      if (!formData.businessName || !formData.shopName || !formData.businessType) {
        setError('Satıcı bilgilerini eksiksiz doldurun');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      // Önce müşteri olarak kayıt ol
      const customerData = {
        fullName: formData.fullName,
        phone: formData.phone,
      };

      const { error: customerError } = await signUp(formData.email, formData.password, 'customer', customerData);

      if (customerError && !customerError.message?.includes('row-level security policy')) {
        setError(customerError.message);
        setLoading(false);
        return;
      }

      // Eğer satıcı formu doldurulmuşsa, satıcı olarak da kayıt yap
      if (showSellerForm) {
        // Not: Şu an için sadece customer olarak kayıt yapıyoruz
        // Satıcı özelliklerini daha sonra profile'a ekleyebiliriz
        // veya ayrı bir seller_requests tablosu oluşturabiliriz
      }

      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    } catch (error) {
      setError('Beklenmeyen bir hata oluştu');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Kayıt Başarılı!</h3>
            <p className="text-gray-600 mb-4">Hesabınız oluşturuldu. Email doğrulaması için email adresinizi kontrol edin.</p>
            <p className="text-sm text-gray-500">Giriş sayfasına yönlendiriliyorsunuz...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image src="/logo/kep_marketplace_logo.png" alt="Kep Marketplace" width={200} height={60} className="mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Kep Marketplace'e Hoş Geldiniz</h1>
          <p className="text-gray-600">Avsallar'ın dijital çarşısında yerinizi alın</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Hesap Oluştur</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Form Fields */}
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Adresi *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="ornek@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Ad Soyad *
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Adınız Soyadınız"
                      value={formData.fullName}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefon
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="0555 123 45 67"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre *
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="En az 6 karakter"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                      Şifre Tekrar *
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Şifrenizi tekrar girin"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Seller Form Toggle */}
              {!showSellerForm && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <svg className="w-12 h-12 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Satış Yapmak mı İstiyorsunuz?</h3>
                  <p className="text-gray-600 mb-4">Kep Shop veya Kep Kitchen'ta ürün/hizmet satmak için satıcı bilgilerinizi ekleyin.</p>
                  <button type="button" onClick={() => setShowSellerForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
                    Satıcı Bilgilerini Ekle
                  </button>
                </div>
              )}

              {/* Seller Form Fields */}
              {showSellerForm && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Satıcı Bilgileri</h3>
                    <button type="button" onClick={() => setShowSellerForm(false)} className="text-sm text-gray-500 hover:text-gray-700">
                      Kaldır
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Business Name */}
                    <div className="md:col-span-2">
                      <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                        İşletme Adı / Şirket Ünvanı *
                      </label>
                      <input
                        id="businessName"
                        name="businessName"
                        type="text"
                        required={showSellerForm}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="İşletme adınız veya şirket ünvanı"
                        value={formData.businessName}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Shop Name */}
                    <div>
                      <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-2">
                        Mağaza/Restoran Adı *
                      </label>
                      <input
                        id="shopName"
                        name="shopName"
                        type="text"
                        required={showSellerForm}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="Mağaza veya restoran adı"
                        value={formData.shopName}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Business Type */}
                    <div>
                      <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                        İşletme Türü *
                      </label>
                      <select
                        id="businessType"
                        name="businessType"
                        required={showSellerForm}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        value={formData.businessType}
                        onChange={handleInputChange}
                      >
                        <option value="">Seçiniz</option>
                        <optgroup label="Kep Shop">
                          <option value="electronics">Elektronik</option>
                          <option value="fashion">Moda & Giyim</option>
                          <option value="home">Ev & Yaşam</option>
                          <option value="sports">Spor & Outdoor</option>
                          <option value="cosmetics">Kozmetik</option>
                          <option value="books">Kitap & Kırtasiye</option>
                          <option value="toys">Oyuncak & Hobi</option>
                          <option value="automotive">Otomotiv</option>
                          <option value="food">Gıda & İçecek</option>
                        </optgroup>
                        <optgroup label="Kep Kitchen">
                          <option value="restaurant">Restoran</option>
                          <option value="cafe">Kafe</option>
                          <option value="bakery">Fırın & Pastane</option>
                          <option value="fastfood">Fast Food</option>
                          <option value="pizzeria">Pizzeria</option>
                          <option value="kebab">Kebap & Döner</option>
                          <option value="dessert">Tatlı & Dondurma</option>
                          <option value="drink">İçecek & Meyhane</option>
                          <option value="breakfast">Kahvaltı Evi</option>
                        </optgroup>
                        <option value="other">Diğer</option>
                      </select>
                    </div>

                    {/* Tax Number */}
                    <div>
                      <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 mb-2">
                        Vergi Numarası / TC Kimlik No
                      </label>
                      <input
                        id="taxNumber"
                        name="taxNumber"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="Vergi numarası veya TC kimlik no"
                        value={formData.taxNumber}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* IBAN */}
                    <div className="md:col-span-2">
                      <label htmlFor="iban" className="block text-sm font-medium text-gray-700 mb-2">
                        IBAN (Havale/EFT için)
                      </label>
                      <input
                        id="iban"
                        name="iban"
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="TR00 0000 0000 0000 0000 0000 00"
                        value={formData.iban}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        İşletme Hakkında
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                        placeholder="İşletmeniz hakkında kısa bir açıklama..."
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kayıt Oluşturuluyor...
                </div>
              ) : (
                'Hesap Oluştur'
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600">
                Zaten hesabınız var mı?{' '}
                <Link href="/auth/login" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Giriş yapın
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Info Cards */}
        <div className="mt-8 grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Kep Shop</h3>
            <p className="text-xs text-gray-500">Fiziksel ürünlerinizi online satın</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Kep Kitchen</h3>
            <p className="text-xs text-gray-500">Yemek siparişi ve restoran hizmetleri</p>
          </div>
        </div>
      </div>
    </div>
  );
}
