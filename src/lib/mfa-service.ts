/**
 * MFA Service
 * Supabase MFA işlemleri için service layer
 */

import { supabase } from './supabase';

export interface MFAFactor {
  id: string;
  type: 'totp' | 'webauthn' | 'sms' | 'phone';
  friendly_name?: string;
  is_enabled: boolean;
  is_verified: boolean;
}

export interface RecoveryCode {
  code: string;
  code_hash: string;
}

export interface MFAEnrollmentData {
  qr_code?: string;
  secret?: string;
  uri?: string;
}

export class MFAService {
  /**
   * Kullanıcının MFA faktörlerini listele
   */
  static async listFactors(): Promise<MFAFactor[]> {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { data: factors, error } = await supabase.auth.mfa.listFactors();
      
      if (error) throw error;
      
      return factors.factors.map((factor: any) => ({
        id: factor.id,
        type: factor.factor_type || 'totp',
        friendly_name: factor.friendly_name,
        is_enabled: factor.status === 'verified',
        is_verified: factor.status === 'verified',
      }));
    } catch (error: any) {
      console.error('Error listing MFA factors:', error);
      throw error;
    }
  }

  /**
   * TOTP faktörü için enrollment başlat
   */
  static async enrollTOTP(friendlyName?: string): Promise<MFAEnrollmentData> {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: friendlyName || 'Authenticator App',
      });

      if (error) throw error;

      return {
        qr_code: data.qr_code,
        secret: data.secret,
        uri: data.uri,
      };
    } catch (error: any) {
      console.error('Error enrolling TOTP:', error);
      throw error;
    }
  }

  /**
   * TOTP kodunu doğrula ve faktörü aktif et (enrollment sırasında)
   */
  static async verifyTOTP(factorId: string, code: string): Promise<boolean> {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    try {
      // Önce challenge oluştur
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) throw challengeError;

      // Challenge'ı doğrula
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error verifying TOTP:', error);
      throw error;
    }
  }

  /**
   * MFA faktörünü devre dışı bırak
   */
  static async unenrollFactor(factorId: string): Promise<void> {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Error unenrolling factor:', error);
      throw error;
    }
  }

  /**
   * Giriş sırasında MFA doğrulaması
   */
  static async challengeMFA(factorId: string): Promise<{ challengeId: string }> {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (error) throw error;
      
      return {
        challengeId: data.id,
      };
    } catch (error: any) {
      console.error('Error challenging MFA:', error);
      throw error;
    }
  }

  /**
   * MFA challenge'ını doğrula
   */
  static async verifyChallenge(challengeId: string, code: string, factorId?: string): Promise<boolean> {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    try {
      const verifyParams: any = {
        challengeId,
        code,
      };

      // Factor ID varsa ekle
      if (factorId) {
        verifyParams.factorId = factorId;
      }

      const { data, error } = await supabase.auth.mfa.verify(verifyParams);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error verifying challenge:', error);
      throw error;
    }
  }

  /**
   * Recovery codes oluştur
   */
  static async generateRecoveryCodes(count: number = 10): Promise<RecoveryCode[]> {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('generate_recovery_codes', {
        p_user_id: user.id,
        p_count: count,
      });

      if (error) throw error;

      // Return recovery codes (sadece ilk seferinde gösterilir, hash edilmiş olarak DB'de saklanır)
      return (data || []).map((item: any) => ({
        code: item.code,
        code_hash: item.code_hash,
      }));
    } catch (error: any) {
      console.error('Error generating recovery codes:', error);
      throw error;
    }
  }

  /**
   * Recovery code ile doğrula
   */
  static async verifyRecoveryCode(code: string): Promise<boolean> {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.rpc('verify_recovery_code', {
        p_user_id: user.id,
        p_code: code,
      });

      if (error) throw error;
      return data === true;
    } catch (error: any) {
      console.error('Error verifying recovery code:', error);
      throw error;
    }
  }

  /**
   * MFA audit log ekle
   */
  static async logMFAAction(
    action: string,
    factorType?: string,
    factorId?: string,
    success: boolean = true,
    errorMessage?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    if (!supabase) {
      return; // Silent fail for audit logging
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc('log_mfa_action', {
        p_user_id: user.id,
        p_action: action,
        p_factor_type: factorType,
        p_factor_id: factorId,
        p_success: success,
        p_error_message: errorMessage,
        p_metadata: metadata || {},
      });
    } catch (error) {
      // Silent fail for audit logging
      console.error('Error logging MFA action:', error);
    }
  }

  /**
   * Kullanıcının MFA tercihlerini getir
   */
  static async getMFAPreferences(): Promise<any> {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_mfa_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found, bu normal olabilir
      return data;
    } catch (error: any) {
      console.error('Error getting MFA preferences:', error);
      throw error;
    }
  }

  /**
   * Kalan recovery codes sayısını getir
   */
  static async getRemainingRecoveryCodes(): Promise<number> {
    if (!supabase) {
      throw new Error('Supabase is not configured');
    }

    try {
      const preferences = await this.getMFAPreferences();
      return preferences?.remaining_recovery_codes || 0;
    } catch (error) {
      return 0;
    }
  }
}

