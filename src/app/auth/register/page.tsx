'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { fetchUnsplashImage } from '@/lib/unsplash';

function RegisterPageContent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const heroFallback = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=900&fit=crop&q=80';
  const ctaFallback = 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=1200&h=900&fit=crop&q=80';
  const [heroImage, setHeroImage] = useState<string>(heroFallback);
  const [ctaImage, setCtaImage] = useState<string>(ctaFallback);
  const steps = [
    { title: 'Hesap Bilgileri', description: 'Email, şifre ve iletişim' },
    { title: 'Onay', description: 'Bilgileri kontrol et ve gönder' },
  ];
  const totalSteps = steps.length;
  const progressPercent = totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 100;

  useEffect(() => {
    if (searchParams?.get('seller') === 'true') {
      router.replace('/seller/register');
    }
  }, [searchParams, router]);

  useEffect(() => {
    let isMounted = true;

    const loadImages = async () => {
      const [hero, cta] = await Promise.all([
        fetchUnsplashImage('modern marketplace storefront', heroFallback),
        fetchUnsplashImage('business teamwork meeting', ctaFallback, 'portrait'),
      ]);

      if (isMounted) {
        setHeroImage(hero);
        setCtaImage(cta);
      }
    };

    loadImages();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (currentStep !== totalSteps) {
      setAcceptTerms(false);
    }
  }, [currentStep, totalSteps]);

  const validateStep = (step: number) => {
    if (step === 1) {
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
    }

    if (step === totalSteps) {
      if (!acceptTerms) {
        setError('Kaydı tamamlamak için kullanım koşullarını ve KVKK metnini kabul etmelisiniz.');
        return false;
      }
    }

    return true;
  };

  const completeRegistration = async () => {
    setLoading(true);
    setError('');

    try {
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

      // Eğer satıcı formu doldurulmuşsa, ek bilgiler ayrı bir süreçte işlenecek
      // TODO: Supabase profil kayıtlarını satıcı alanlarıyla genişlet

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

  const handleStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateStep(currentStep)) {
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    await completeRegistration();
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
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

        <style jsx>{`
          @keyframes bounce-slow {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-10px);
            }
          }

          @keyframes progress {
            0% {
              width: 0%;
            }
            100% {
              width: 100%;
            }
          }

          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-bounce-slow {
            animation: bounce-slow 2s ease-in-out infinite;
          }
          .animate-progress {
            animation: progress 2s ease-in-out;
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Marketing Column */}
          <div className="space-y-8">
            <Link href="/" className="inline-block">
              <Image src="/logo/kep_marketplace_logo.svg" alt="Kep Marketplace" width={220} height={64} className="mx-auto lg:mx-0" />
            </Link>
            <div className="relative rounded-3xl overflow-hidden shadow-lg border border-white/60">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${heroImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="relative bg-white/85 backdrop-blur-sm p-8 lg:p-10 h-full">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-semibold mb-5">
                <span>Topluluğa Katılın</span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">Kep Marketplace&apos;e Hoş Geldiniz</h1>
              <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                Avsallar&apos;ın dijital çarşısında yerinizi alın. Müşteri ve satıcılar için tek bir çatı altında güvenli alışveriş ve hızlı teslimat deneyimi sunuyoruz.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: '⚡', title: 'Hızlı Teslimat Ağı' },
                  { icon: '📊', title: 'Profesyonel Satıcı Paneli' },
                  { icon: '💬', title: '7/24 Destek' },
                  { icon: '🔒', title: 'Güvenli Ödemeler' },
                ].map((feature) => (
                  <div key={feature.title} className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-sm font-semibold text-gray-800">{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Kep Shop', description: 'Fiziksel ürünlerinizi online satın', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
                { title: 'Kep Kitchen', description: 'Yemek siparişi ve restoran hizmetleri', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
                { title: 'Kampanyalar', description: 'Özel kampanya desteği ile satışınızı artırın', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
                { title: 'Analitik', description: 'Sipariş ve performans analitiği', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
              ].map((card) => (
                <div key={card.title} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 ${card.iconBg} rounded-full flex items-center justify-center mb-3`}>
                    <svg className={`w-5 h-5 ${card.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">{card.title}</h3>
                  <p className="text-xs text-gray-500">{card.description}</p>
                </div>
              ))}
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/60 shadow-lg">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${ctaImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/85 via-orange-600/80 to-red-600/80" />
              <div className="relative p-6 lg:p-8 h-full text-white space-y-4">
                <h3 className="text-lg font-semibold">Nasıl Çalışır?</h3>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Hesap Oluşturun', description: 'Müşteri veya satıcı hesap bilgilerinizle hemen kaydolun.' },
                    { step: '2', title: 'Onay Süreci', description: 'Satıcı başvurunuz ekibimiz tarafından hızla incelenir.' },
                    { step: '3', title: 'Ürünlerinizi Ekleyin', description: 'Stoklarınızı yönetin, kampanyalar oluşturun.' },
                    { step: '4', title: 'Satışa Başlayın', description: 'Güvenli ödeme altyapısı ve hızlı teslimat ağı ile kazancınızı büyütün.' },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center font-semibold border border-white/30">
                        {item.step}
                      </span>
                      <div>
                        <h4 className="text-sm font-semibold">{item.title}</h4>
                        <p className="text-xs text-white/85">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div>
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Hesap Oluştur</h2>
                  <p className="text-sm text-gray-500">Dakikalar içinde Kep Marketplace hesabınızı oluşturun.</p>
                </div>
                <Link href="/auth/login" className="text-sm text-orange-600 hover:text-orange-700 font-semibold">
                  Zaten üyeyim
                </Link>
              </div>

              <div className="mb-8">
                <div className="relative">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200"></div>
                  <div className="absolute top-5 left-0 h-0.5 bg-orange-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                  <div className="relative grid gap-4" style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}>
                    {steps.map((step, index) => {
                      const stepNumber = index + 1;
                      const isCompleted = stepNumber < currentStep;
                      const isActive = stepNumber === currentStep;
                      return (
                        <div key={step.title} className="flex flex-col items-center text-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-semibold transition-all ${
                              isActive || isCompleted ? 'border-orange-500 bg-orange-500 text-white shadow-lg' : 'border-gray-300 bg-white text-gray-500'
                            }`}
                          >
                            {stepNumber}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</p>
                            <p className="text-xs text-gray-500">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <form onSubmit={handleStepSubmit} className="space-y-6">
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Kişisel Bilgiler</h3>
                      <div className="grid md:grid-cols-2 gap-4">
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

                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
                      <div className="mb-4">
                        <svg className="w-12 h-12 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Satış Yapmak mı İstiyorsunuz?</h3>
                      <p className="text-gray-600 mb-4">Kep Shop veya Kep Kitchen&apos;da ürün ve hizmet satmak için satıcı başvuru formunu kullanın.</p>
                      <Link
                        href="/seller/register"
                        className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
                      >
                        Satıcı Başvurusu
                      </Link>
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Hesap Özeti</h3>
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Ad Soyad</p>
                          <p className="font-semibold text-gray-900">{formData.fullName || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Email</p>
                          <p className="font-semibold text-gray-900 break-all">{formData.email || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Telefon</p>
                          <p className="font-semibold text-gray-900">{formData.phone || '-'}</p>
                        </div>
                      </div>
            </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
                      <h4 className="text-sm font-semibold text-gray-900">Son Adım</h4>
                      <p className="text-sm text-gray-600">
                        Kaydınızı tamamlamadan önce bilgilerinizi gözden geçirin ve kullanım koşullarını onaylayın. Satıcı olmak istiyorsanız, başvurunuzu ayrı satıcı kayıt sayfası üzerinden tamamlayabilirsiniz.
                      </p>
                      <label className="flex items-start gap-3">
                        <input type="checkbox" className="mt-1 h-5 w-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                        <span className="text-sm text-gray-600">
                          Kep Marketplace kullanım koşullarını ve KVKK metnini okudum, kabul ediyorum. Satıcı olarak kaydoluyorsam, doğrulama sürecinin ardından satışa başlayacağımı biliyorum.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

            {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="w-full sm:w-auto px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                      disabled={loading}
                    >
                      Geri
                    </button>
                  ) : (
                    <span className="hidden sm:block" />
                  )}
            <button
              type="submit"
              disabled={loading}
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-white transition-all ${
                      currentStep === totalSteps
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                        : 'bg-orange-500 hover:bg-orange-600'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {currentStep === totalSteps ? (
                      loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kayıt Oluşturuluyor...
                </div>
              ) : (
                        'Kaydı Tamamla'
                      )
                    ) : (
                      'Devam Et'
              )}
            </button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  Hesabınız var mı?{' '}
                  <Link href="/auth/login" className="font-semibold text-orange-600 hover:text-orange-700">
                  Giriş yapın
                </Link>
            </div>
          </form>
        </div>

            <div className="mt-6 text-center text-sm text-gray-500">
              <span>Kaydolarak kullanım koşullarımızı ve KVKK politikamızı kabul etmiş olursunuz.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  );
}
