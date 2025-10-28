-- ============================================
-- BASİT VE GÜVENLİ ADMIN KULLANICISI OLUŞTURMA
-- ============================================

-- Yöntem 1: Supabase Auth ile Admin Oluşturma (Önerilen)
-- Bu yöntem Supabase'in kendi auth sistemini kullanır

-- 1. Önce normal bir kullanıcı kaydı yapın (auth/register sayfasından)
-- 2. Sonra bu SQL'i çalıştırarak o kullanıcıyı admin yapın:

-- Mevcut kullanıcıyı admin yap (email'i değiştirin)
UPDATE profiles 
SET role = 'admin',
    updated_at = NOW()
WHERE email = 'admin@kepmarketplace.com';

-- Kontrol et
SELECT 
    id,
    email,
    role,
    full_name,
    created_at
FROM profiles
WHERE email = 'admin@kepmarketplace.com';

-- ============================================
-- ALTERNATİF: Manuel Admin Oluşturma
-- ============================================

-- Eğer kullanıcı yoksa, önce normal kayıt sayfasından kayıt olun
-- Sonra yukarıdaki UPDATE komutu ile admin yapın

-- ============================================
-- HIZLI TEST: Test Admin Oluşturma
-- ============================================

-- 1. Önce test email ile normal kayıt olun (auth/register)
-- 2. Sonra bu SQL ile admin yapın:

-- Test için admin yapma (email'i kendi email'inizle değiştirin)
UPDATE profiles 
SET role = 'admin',
    updated_at = NOW()
WHERE email = 'test@example.com'; -- Buraya kendi email'inizi yazın

-- 3. Kontrol edin
SELECT 
    email,
    role,
    full_name,
    tenant_id,
    created_at
FROM profiles
WHERE role = 'admin';

-- ============================================
-- GÜVENLİK NOTLARI
-- ============================================
-- ✅ Admin kullanıcıları sadece veritabanından oluşturulabilir
-- ✅ Normal kayıt + SQL update = Güvenli admin oluşturma
-- ✅ Şifreler Supabase Auth'da güvenli şekilde saklanır
-- ✅ Email doğrulaması yapılabilir
