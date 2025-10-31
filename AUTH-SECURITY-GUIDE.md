# 🔐 Supabase Auth Güvenlik Ayarları Rehberi

Bu rehber, Supabase linter uyarılarını gidermek için gerekli auth güvenlik ayarlarını açıklar.

## 🚨 Mevcut Uyarılar

### 1. Leaked Password Protection Disabled

**Uyarı**: Compromised password protection devre dışı
**Çözüm**: HaveIBeenPwned.org entegrasyonunu etkinleştir

### 2. Insufficient MFA Options

**Uyarı**: Çok az MFA seçeneği etkin
**Çözüm**: Daha fazla MFA yöntemi etkinleştir

## 🛠️ Çözüm Adımları

### 1. Supabase Dashboard'a Giriş

1. [Supabase Dashboard](https://supabase.com/dashboard) açın
2. Projenizi seçin
3. **Authentication** > **Settings** bölümüne gidin

### 2. Leaked Password Protection Etkinleştir

1. **Password Protection** bölümünü bulun
2. **"Enable leaked password protection"** seçeneğini işaretleyin
3. **Save** butonuna tıklayın

### 3. MFA (Multi-Factor Authentication) Ayarları

1. **Multi-Factor Authentication** bölümünü bulun
2. Aşağıdaki seçenekleri etkinleştirin:
   - ✅ **TOTP (Time-based One-Time Password)**
   - ✅ **SMS Authentication** (opsiyonel)
   - ✅ **Email OTP** (opsiyonel)

### 4. Ek Güvenlik Ayarları (Önerilen)

1. **Password Requirements**:

   - Minimum 8 karakter
   - Büyük harf, küçük harf, rakam ve özel karakter zorunluluğu

2. **Session Management**:

   - Session timeout: 24 saat
   - Refresh token rotation: Etkin

3. **Rate Limiting**:
   - Login attempts: 5 deneme/5 dakika
   - Password reset: 3 deneme/saat

## 📋 Supabase Dashboard Adımları

### Authentication Settings URL

```
https://supabase.com/dashboard/project/[PROJECT_ID]/auth/settings
```

### Gerekli Ayarlar

```json
{
  "password_protection": {
    "enabled": true,
    "provider": "haveibeenpwned"
  },
  "mfa": {
    "totp": true,
    "sms": false,
    "email_otp": false
  },
  "password_requirements": {
    "min_length": 8,
    "require_uppercase": true,
    "require_lowercase": true,
    "require_numbers": true,
    "require_symbols": true
  }
}
```

## ✅ Doğrulama

Ayarları yaptıktan sonra:

1. Supabase linter'ı tekrar çalıştırın
2. Auth uyarılarının giderildiğini kontrol edin
3. Test kullanıcısı ile MFA'yı test edin

## 🔗 Faydalı Linkler

- [Supabase Auth MFA Guide](https://supabase.com/docs/guides/auth/auth-mfa)
- [Password Security Guide](https://supabase.com/docs/guides/auth/password-security)
- [HaveIBeenPwned Integration](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

## ⚠️ Önemli Notlar

- MFA ayarları kullanıcı deneyimini etkileyebilir
- SMS MFA için ek ücret gerekebilir
- Production ortamında tüm güvenlik ayarlarını etkinleştirin
- Test ortamında önce MFA'yı test edin

---

**Son Güncelleme**: $(date)
**Versiyon**: 1.0










