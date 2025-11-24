'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import MFAVerification from '@/components/mfa/MFAVerification';
import { MFAService } from '@/lib/mfa-service';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [mfaFactorId, setMfaFactorId] = useState<string>('');
  const { signIn, userRole } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn(email, password);

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    // MFA kontrolü
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // MFA faktörlerini kontrol et
          const factors = await MFAService.listFactors();
          
          if (factors.length > 0 && factors.some(f => f.is_enabled && f.is_verified)) {
            // Aktif MFA faktörü var
            const activeFactor = factors.find(f => f.is_enabled && f.is_verified);
            if (activeFactor) {
              setMfaFactorId(activeFactor.id);
              setRequiresMFA(true);
              setLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        // MFA kontrolü başarısız oldu, normal girişe devam et
        console.warn('MFA check failed, continuing with normal login:', err);
      }
    }

    // Normal giriş (MFA yok)
    if (userRole === 'admin') {
      router.push('/admin');
    } else if (userRole === 'seller') {
      router.push('/seller');
    } else {
      router.push('/');
    }
    setLoading(false);
  };

  const handleMFAVerified = async () => {
    // MFA doğrulandı, kullanıcıyı yönlendir
    if (userRole === 'admin') {
      router.push('/admin');
    } else if (userRole === 'seller') {
      router.push('/seller');
    } else {
      router.push('/');
    }
  };

  // MFA verification ekranı göster
  if (requiresMFA && mfaFactorId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-6">
              <Image src="/logo/kep_marketplace_logo.svg" alt="Kep Marketplace" width={200} height={60} className="mx-auto" />
            </Link>
          </div>
          <MFAVerification
            factorId={mfaFactorId}
            onVerified={handleMFAVerified}
            onError={(errorMsg) => setError(errorMsg)}
          />
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image src="/logo/kep_marketplace_logo.svg" alt="Kep Marketplace" width={200} height={60} className="mx-auto" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Giriş Yapın</h1>
          <p className="text-gray-600">Kep Marketplace&apos;e hoş geldiniz</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Adresi
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Şifrenizi girin"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
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
                  Giriş Yapılıyor...
                </div>
              ) : (
                'Giriş Yap'
              )}
            </button>

            {/* Links */}
            <div className="text-center space-y-2">
              <p className="text-gray-600">
                Hesabınız yok mu?{' '}
                <Link href="/auth/register" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Kayıt olun
                </Link>
              </p>
              <p className="text-sm text-gray-500">
                <Link href="/auth/forgot-password" className="text-orange-600 hover:text-orange-700">
                  Şifremi unuttum
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Platform Info */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Kep Shop</h3>
              <p className="text-xs text-gray-500">Online Alışveriş</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Kep Kitchen</h3>
              <p className="text-xs text-gray-500">Yemek Siparişi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
