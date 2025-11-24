'use client';

import { useState } from 'react';
import { MFAService } from '@/lib/mfa-service';

interface MFAVerificationProps {
  factorId: string;
  onVerified: () => void;
  onError?: (error: string) => void;
  onUseRecoveryCode?: () => void;
}

export default function MFAVerification({
  factorId,
  onVerified,
  onError,
  onUseRecoveryCode,
}: MFAVerificationProps) {
  const [code, setCode] = useState('');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      setError('Lütfen 6 haneli kodu girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Challenge oluştur
      const challenge = await MFAService.challengeMFA(factorId);
      
      // Challenge'ı doğrula
      const verified = await MFAService.verifyChallenge(challenge.challengeId, code, factorId);
      
      if (verified) {
        await MFAService.logMFAAction('login_success', 'totp', factorId, true);
        onVerified();
      } else {
        setError('Kod doğrulanamadı');
        await MFAService.logMFAAction('login_failure', 'totp', factorId, false, 'Invalid code');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Kod doğrulanamadı';
      setError(errorMessage);
      await MFAService.logMFAAction('login_failure', 'totp', factorId, false, errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRecoveryCode = async () => {
    if (!recoveryCode || recoveryCode.trim().length === 0) {
      setError('Lütfen recovery code girin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const verified = await MFAService.verifyRecoveryCode(recoveryCode.trim());
      
      if (verified) {
        await MFAService.logMFAAction('login_success', 'recovery_code', undefined, true);
        onVerified();
      } else {
        setError('Recovery code geçersiz veya kullanılmış');
        await MFAService.logMFAAction('login_failure', 'recovery_code', undefined, false, 'Invalid or used recovery code');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Recovery code doğrulanamadı';
      setError(errorMessage);
      await MFAService.logMFAAction('login_failure', 'recovery_code', undefined, false, errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">İki Faktörlü Kimlik Doğrulama</h2>

      {!useRecoveryCode ? (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authenticator uygulamanızdan 6 haneli kodu girin
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setCode(value);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-2xl tracking-widest font-mono"
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleVerifyCode}
            disabled={loading || code.length !== 6}
            className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Doğrulanıyor...' : 'Doğrula'}
          </button>

          <div className="text-center">
            <button
              onClick={() => setUseRecoveryCode(true)}
              className="text-sm text-orange-600 hover:text-orange-700 underline"
            >
              Recovery code kullanmak istiyorum
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recovery Code
            </label>
            <input
              type="text"
              value={recoveryCode}
              onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
              placeholder="XXXX-XXXX"
              autoFocus
            />
            <p className="mt-2 text-sm text-gray-500">
              Recovery code'unuzu girin (XXXX-XXXX formatında)
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleVerifyRecoveryCode}
            disabled={loading || !recoveryCode.trim()}
            className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Doğrulanıyor...' : 'Doğrula'}
          </button>

          <div className="text-center">
            <button
              onClick={() => {
                setUseRecoveryCode(false);
                setRecoveryCode('');
                setError('');
              }}
              className="text-sm text-orange-600 hover:text-orange-700 underline"
            >
              Authenticator kodunu kullanmak istiyorum
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

