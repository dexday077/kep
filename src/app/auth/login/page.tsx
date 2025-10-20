"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-100/40 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
        
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
                  Kep <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Marketplace</span>
                </h1>
                <div className="absolute -inset-2 bg-blue-100 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full -z-10"></div>
              </div>
            </Link>
            <div className="mt-8 relative">
              <h2 className="text-3xl font-bold text-gray-900 animate-fade-in">
                Hoş Geldiniz 👋
              </h2>
              <p className="mt-3 text-lg text-gray-600 animate-fade-in animation-delay-200">
                Hesabınıza giriş yapın
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="relative animate-fade-in-up animation-delay-400">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/50 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-100/50 to-transparent rounded-full blur-2xl"></div>

              <form className="space-y-6 relative" onSubmit={handleSubmit}>
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
                    className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
                    placeholder="ornek@email.com"
                  />
                </div>

                <div className="animate-slide-in-left animation-delay-100">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    🔒 Şifre
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:border-blue-300 focus:scale-[1.02]"
                    placeholder="Şifreniz"
                  />
                </div>

                <div className="flex items-center justify-between animate-slide-in-left animation-delay-200">
                  <div className="flex items-center group">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all duration-300"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer group-hover:text-blue-600 transition-colors">
                      Beni Hatırla
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-blue-600 hover:text-blue-700 transition-all duration-300 hover:underline">
                      Şifremi Unuttum?
                    </a>
                  </div>
                </div>

                <div className="animate-slide-in-left animation-delay-300">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-4 px-4 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:scale-105 overflow-hidden"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                    
                    {loading ? (
                      <span className="flex items-center relative z-10">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Giriş yapılıyor...
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center">
                        🚀 Giriş Yap
                      </span>
                    )}
                  </button>
                </div>

                <div className="text-center text-sm animate-fade-in animation-delay-400">
                  <span className="text-gray-600">Hesabınız yok mu?</span>{" "}
                  <Link
                    href="/auth/register"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-all duration-300 hover:underline"
                  >
                    Kayıt Olun
                  </Link>
                </div>
              </form>

              {/* Social Login Options */}
              <div className="mt-8 animate-fade-in animation-delay-500">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">veya devam et</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="group w-full inline-flex justify-center items-center py-3 px-4 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Google
                  </button>

                  <button
                    type="button"
                    className="group w-full inline-flex justify-center items-center py-3 px-4 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="text-center animate-fade-in animation-delay-600">
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
