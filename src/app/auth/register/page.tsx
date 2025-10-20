"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"customer" | "seller" | "admin">("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

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
                Email adresinize doğrulama linki gönderildi.
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

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-100/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-grid-slate-100 bg-[size:50px_50px] opacity-30"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Logo and Header with Animation */}
          <div className="text-center animate-fade-in-down">
            <Link href="/" className="inline-block group">
              <div className="relative">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 transition-all duration-300 group-hover:scale-110">
                  Kep <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Marketplace</span>
                </h1>
                <div className="absolute -inset-2 bg-purple-100 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full -z-10"></div>
              </div>
            </Link>
            <div className="mt-8 relative">
              <h2 className="text-3xl font-bold text-gray-900 animate-fade-in">
                Aramıza Katılın 🎉
              </h2>
              <p className="mt-3 text-lg text-gray-600 animate-fade-in animation-delay-200">
                Yeni bir hesap oluşturun
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="relative animate-fade-in-up animation-delay-400">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/50 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-pink-100/50 to-transparent rounded-full blur-2xl"></div>

              <form className="space-y-5 relative" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 backdrop-blur-sm border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm animate-shake flex items-center">
                    <span className="mr-2">⚠️</span>
                    {error}
                  </div>
                )}

                <div className="animate-slide-in-left">
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

                <div className="animate-slide-in-left animation-delay-100">
                  <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                    👤 Rol Seçin
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-purple-300 cursor-pointer"
                      value={role}
                      onChange={(e) =>
                        setRole(e.target.value as "customer" | "seller" | "admin")
                      }
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

                <div className="animate-slide-in-left animation-delay-200">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    🔒 Şifre
                  </label>
                  <input
                    id="password"
                    name="password"
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

                <div className="animate-slide-in-left animation-delay-300">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    🔐 Şifre Tekrar
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-purple-300 focus:scale-[1.02]"
                    placeholder="Şifrenizi tekrar girin"
                  />
                </div>

                <div className="animate-slide-in-left animation-delay-400">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-4 px-4 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden"
                  >
                    {/* Button shine effect */}
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
                      <span className="relative z-10 flex items-center">
                        ✨ Kayıt Ol
                      </span>
                    )}
                  </button>
                </div>

                <div className="text-center text-sm animate-fade-in animation-delay-500">
                  <span className="text-gray-600">Zaten hesabınız var mı?</span>{" "}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-purple-600 hover:text-purple-700 transition-all duration-300 hover:underline"
                  >
                    Giriş Yapın
                  </Link>
                </div>

                <p className="text-xs text-center text-gray-500 animate-fade-in animation-delay-600">
                  Kayıt olarak{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-700 hover:underline transition-all">
                    Kullanım Koşulları
                  </a>
                  {" "}ve{" "}
                  <a href="#" className="text-purple-600 hover:text-purple-700 hover:underline transition-all">
                    Gizlilik Politikası
                  </a>
                  'nı kabul etmiş olursunuz.
                </p>
              </form>
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

        @keyframes slide-in-left {
          0% { opacity: 0; transform: translateX(-20px); }
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
        .animate-slide-in-left { animation: slide-in-left 0.5s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }

        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animation-delay-400 { animation-delay: 0.4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-600 { animation-delay: 0.6s; }
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
