'use client';

import { useState, useEffect } from 'react';
import { MFAService, MFAEnrollmentData } from '@/lib/mfa-service';

interface MFAEnrollmentProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function MFAEnrollment({ onComplete, onCancel }: MFAEnrollmentProps) {
  const [step, setStep] = useState<'enroll' | 'verify' | 'recovery-codes' | 'complete'>('enroll');
  const [enrollmentData, setEnrollmentData] = useState<MFAEnrollmentData | null>(null);
  const [factorId, setFactorId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [friendlyName, setFriendlyName] = useState('Authenticator App');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  // TOTP enrollment başlat
  const handleStartEnrollment = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await MFAService.enrollTOTP(friendlyName);
      setEnrollmentData(data);
      
      // Enrollment sonrası factor ID'yi al
      // Supabase auth.mfa.enroll response'unda factor ID döner, ama biz listFactors'dan alacağız
      const factors = await MFAService.listFactors();
      const latestFactor = factors[factors.length - 1];
      if (latestFactor) {
        setFactorId(latestFactor.id);
      }

      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Enrollment başlatılamadı');
    } finally {
      setLoading(false);
    }
  };

  // TOTP kodunu doğrula
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Lütfen 6 haneli kodu girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Enrollment sırasında verifyTOTP kullan (challenge otomatik oluşturulur)
      const verified = await MFAService.verifyTOTP(factorId, verificationCode);
      
      if (verified) {
        // Recovery codes oluştur
        await handleGenerateRecoveryCodes();
      } else {
        setError('Kod doğrulanamadı');
      }
    } catch (err: any) {
      setError(err.message || 'Kod doğrulanamadı');
    } finally {
      setLoading(false);
    }
  };

  // Recovery codes oluştur
  const handleGenerateRecoveryCodes = async () => {
    try {
      const codes = await MFAService.generateRecoveryCodes(10);
      setRecoveryCodes(codes.map(c => c.code));
      setShowRecoveryCodes(true);
      setStep('recovery-codes');
      
      await MFAService.logMFAAction('enroll', 'totp', factorId, true);
    } catch (err: any) {
      setError(err.message || 'Recovery codes oluşturulamadı');
    }
  };

  const handleComplete = () => {
    setStep('complete');
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">İki Faktörlü Kimlik Doğrulama (MFA) Kurulumu</h2>

      {step === 'enroll' && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cihaz Adı (Opsiyonel)
            </label>
            <input
              type="text"
              value={friendlyName}
              onChange={(e) => setFriendlyName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Örn: iPhone, Google Authenticator"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Adımlar:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Google Authenticator veya benzeri bir uygulama indirin</li>
              <li>Aşağıdaki butona tıklayın ve QR kodu tarayın</li>
              <li>Uygulamadan gelen 6 haneli kodu girin</li>
            </ol>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleStartEnrollment}
              disabled={loading}
              className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Yükleniyor...' : 'QR Kod Oluştur'}
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
            )}
          </div>
        </div>
      )}

      {step === 'verify' && enrollmentData && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Kodu Tarayın</h3>
            {enrollmentData.qr_code && (
              <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                <img
                  src={enrollmentData.qr_code}
                  alt="TOTP QR Code"
                  className="w-64 h-64"
                />
              </div>
            )}
            {enrollmentData.secret && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Manuel giriş için secret:</p>
                <code className="block bg-gray-100 px-4 py-2 rounded text-sm font-mono break-all">
                  {enrollmentData.secret}
                </code>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              6 Haneli Doğrulama Kodu
            </label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setVerificationCode(value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
              placeholder="000000"
              maxLength={6}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleVerifyCode}
              disabled={loading || verificationCode.length !== 6}
              className="flex-1 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Doğrulanıyor...' : 'Doğrula'}
            </button>
            <button
              onClick={() => setStep('enroll')}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50"
            >
              Geri
            </button>
          </div>
        </div>
      )}

      {step === 'recovery-codes' && showRecoveryCodes && (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Önemli: Recovery Codes'ları Saklayın</h3>
            <p className="text-sm text-yellow-800">
              Bu kodlar, telefonunuzu kaybederseniz veya Authenticator uygulamanıza erişemezseniz hesabınıza giriş yapmanızı sağlar.
              Bu kodları güvenli bir yerde saklayın - sadece bir kez gösterilecekler!
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recovery Codes:</h3>
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {recoveryCodes.map((code, index) => (
                <div
                  key={index}
                  className="bg-white px-3 py-2 rounded border border-gray-200 text-center"
                >
                  {code}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
          >
            Kodları Kaydettim, Devam Et
          </button>
        </div>
      )}

      {step === 'complete' && (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900">MFA Başarıyla Kuruldu!</h3>
          <p className="text-gray-600">
            Artık giriş yaparken iki faktörlü kimlik doğrulama kullanılacak.
          </p>
          <button
            onClick={handleComplete}
            className="mt-4 bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700"
          >
            Tamam
          </button>
        </div>
      )}
    </div>
  );
}

