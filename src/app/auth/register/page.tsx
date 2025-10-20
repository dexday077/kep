"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

type Step = 1 | 2 | 3 | 4;

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const router = useRouter();
  const { signUp } = useAuth();
  
  // Form states
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"customer" | "seller" | "admin">("customer");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleNext = () => {
    setError("");
    
    // Validation for each step
    if (currentStep === 1) {
      if (!email || !email.includes("@")) {
        setError("Geçerli bir email adresi girin");
        return;
      }
    } else if (currentStep === 2) {
      if (!firstName || !lastName) {
        setError("Ad ve soyad zorunludur");
        return;
      }
      if (!phone) {
        setError("Telefon numarası zorunludur");
        return;
      }
    } else if (currentStep === 3) {
      if (!address || !city || !district) {
        setError("Adres bilgileri zorunludur");
        return;
      }
    }
    
    setCurrentStep((prev) => (prev + 1) as Step);
  };

  const handleBack = () => {
    setError("");
    setCurrentStep((prev) => (prev - 1) as Step);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalı");
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, role);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-green-50">
        <div className="max-w-md w-full space-y-8 text-center animate-fade-in-up">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 shadow-2xl">
            <div className="text-6xl mb-4 animate-bounce-slow">✅</div>
            <div className="text-green-800">
              <h3 className="text-2xl font-bold mb-2">Kayıt Başarılı!</h3>
              <p className="text-lg mb-2">
                Hesabınız başarıyla oluşturuldu.
              </p>
              <p className="text-sm text-green-600">Giriş sayfasına yönlendiriliyorsunuz...</p>
              <div className="mt-6">
                <div className="w-full h-2 bg-green-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 rounded-full animate-progress"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
          .animate-progress { animation: progress 2s ease-in-out; }
          .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        `}</style>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6 animate-slide-in">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Email Adresiniz</h3>
              <p className="text-gray-600">Hesabınız için kullanacağınız email adresini girin</p>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                ✉️ E-posta Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-purple-300 focus:scale-[1.02]"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                👤 Hesap Türü
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-purple-300 cursor-pointer"
                  value={role}
                  onChange={(e) => setRole(e.target.value as "customer" | "seller" | "admin")}
                >
                  <option value="customer">🛍️ Müşteri</option>
                  <option value="seller">🏪 Satıcı</option>
                  <option value="admin">⚙️ Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5 animate-slide-in">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Kişisel Bilgileriniz</h3>
              <p className="text-gray-600">İsim, soyisim ve telefon bilgilerinizi girin</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  👤 Ad
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-purple-300 focus:scale-[1.02]"
                  placeholder="Adınız"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  👤 Soyad
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-purple-300 focus:scale-[1.02]"
                  placeholder="Soyadınız"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                📱 Telefon Numarası
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-purple-300 focus:scale-[1.02]"
                placeholder="+90 5XX XXX XX XX"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5 animate-slide-in">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Adres Bilgileriniz</h3>
              <p className="text-gray-600">Teslimat için adres bilgilerinizi girin</p>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Adres
              </label>
              <textarea
                id="address"
                required
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-purple-300 resize-none"
                placeholder="Mahalle, sokak, bina no, daire no"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                  🏙️ İl
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-purple-300 focus:scale-[1.02]"
                  placeholder="İl"
                />
              </div>

              <div>
                <label htmlFor="district" className="block text-sm font-semibold text-gray-700 mb-2">
                  🏘️ İlçe
                </label>
                <input
                  id="district"
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-purple-300 focus:scale-[1.02]"
                  placeholder="İlçe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 mb-2">
                📮 Posta Kodu <span className="text-gray-400 text-xs">(Opsiyonel)</span>
              </label>
              <input
                id="postalCode"
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-purple-300 focus:scale-[1.02]"
                placeholder="34000"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5 animate-slide-in">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Şifre Belirleyin</h3>
              <p className="text-gray-600">Hesabınız için güvenli bir şifre oluşturun</p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                🔒 Şifre
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-purple-300 focus:scale-[1.02]"
                placeholder="En az 6 karakter"
                minLength={6}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                🔐 Şifre Tekrar
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-purple-300 focus:scale-[1.02]"
                placeholder="Şifrenizi tekrar girin"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-2">✨ Kayıt Özeti:</p>
              <ul className="space-y-1 text-xs">
                <li>📧 {email}</li>
                <li>👤 {firstName} {lastName}</li>
                <li>📱 {phone}</li>
                <li>📍 {city}, {district}</li>
                <li>👔 {role === "customer" ? "Müşteri" : role === "seller" ? "Satıcı" : "Admin"}</li>
              </ul>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-100/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-grid-slate-100 bg-[size:50px_50px] opacity-30"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header */}
          <div className="text-center animate-fade-in-down">
            <Link href="/" className="inline-block group">
              <div className="relative">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 transition-all duration-300 group-hover:scale-110">
                  Kep <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Marketplace</span>
                </h1>
              </div>
            </Link>
            <div className="mt-8">
              <h2 className="text-3xl font-bold text-gray-900">Aramıza Katılın 🎉</h2>
              <p className="mt-3 text-lg text-gray-600">Adım {currentStep} / 4</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full transition-all duration-300 ${
                    step <= currentStep
                      ? "text-purple-600 bg-purple-200"
                      : "text-gray-400 bg-gray-200"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${(currentStep / 4) * 100}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
              ></div>
            </div>
          </div>

          {/* Form Card */}
          <div className="relative animate-fade-in-up">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20"></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/50 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-100/50 to-transparent rounded-full blur-2xl"></div>

              <form onSubmit={currentStep === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="relative">
                {error && (
                  <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-shake flex items-center">
                    <span className="mr-2">⚠️</span>
                    {error}
                  </div>
                )}

                {renderStepContent()}

                {/* Buttons */}
                <div className="mt-8 flex gap-3">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 py-3.5 px-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                    >
                      ← Geri
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex-1 flex justify-center py-3.5 px-4 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    
                    {loading ? (
                      <span className="flex items-center relative z-10">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Kayıt oluşturuluyor...
                      </span>
                    ) : (
                      <span className="relative z-10">
                        {currentStep === 4 ? "✨ Kayıt Tamamla" : "İleri →"}
                      </span>
                    )}
                  </button>
                </div>
              </form>

              {currentStep === 1 && (
                <div className="mt-6 text-center text-sm">
                  <span className="text-gray-600">Zaten hesabınız var mı?</span>{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-purple-600 hover:text-purple-700 transition-all duration-300 hover:underline"
                  >
                    Giriş Yapın
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="text-center animate-fade-in animation-delay-700">
            <Link
              href="/"
              className="group inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes slide-in {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-blob { animation: blob 7s infinite; }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-slide-in { animation: slide-in 0.5s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }

        .animation-delay-700 { animation-delay: 0.7s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        .bg-grid-slate-100 {
          background-image: linear-gradient(to right, rgb(241 245 249) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(241 245 249) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
}
