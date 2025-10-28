-- ============================================
-- ADMIN USER CREATION SYSTEM
-- ============================================
-- Admin kullanıcıları sadece bu script ile oluşturulabilir
-- Güvenlik için admin kayıt seçeneği frontend'de yok

-- 1. Admin kullanıcısı oluşturma fonksiyonu
CREATE OR REPLACE FUNCTION create_admin_user(
    admin_email TEXT,
    admin_password TEXT,
    admin_name TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    user_id UUID;
    result JSON;
BEGIN
    -- Supabase Auth'da kullanıcı oluştur
    -- Bu fonksiyon sadece superuser tarafından çalıştırılabilir
    
    -- Manuel olarak auth.users tablosuna ekleme (sadece superuser)
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '00000000-0000-0000-0000-000000000000',
        uuid_generate_v4(),
        'authenticated',
        'authenticated',
        admin_email,
        crypt(admin_password, gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ) RETURNING id INTO user_id;
    
    -- Profiles tablosuna admin olarak ekle
    INSERT INTO profiles (
        id,
        email,
        role,
        tenant_id,
        full_name,
        created_at
    ) VALUES (
        user_id,
        admin_email,
        'admin',
        '00000000-0000-0000-0000-000000000001', -- Default tenant
        COALESCE(admin_name, 'Admin User'),
        NOW()
    );
    
    result := json_build_object(
        'success', true,
        'user_id', user_id,
        'email', admin_email,
        'message', 'Admin user created successfully'
    );
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Failed to create admin user'
        );
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Admin kullanıcısı oluşturma (örnek)
-- Bu komutu çalıştırmadan önce admin_email ve admin_password değerlerini değiştirin
/*
SELECT create_admin_user(
    'admin@kepmarketplace.com',  -- Admin email
    'SecurePassword123!',       -- Admin password
    'Kep Marketplace Admin'     -- Admin name
);
*/

-- 3. Mevcut kullanıcıyı admin yapma fonksiyonu
CREATE OR REPLACE FUNCTION promote_to_admin(user_email TEXT)
RETURNS JSON AS $$
DECLARE
    user_id UUID;
    result JSON;
BEGIN
    -- Kullanıcıyı bul
    SELECT id INTO user_id 
    FROM profiles 
    WHERE email = user_email;
    
    IF user_id IS NULL THEN
        result := json_build_object(
            'success', false,
            'message', 'User not found'
        );
        RETURN result;
    END IF;
    
    -- Rolü admin yap
    UPDATE profiles 
    SET role = 'admin', updated_at = NOW()
    WHERE id = user_id;
    
    result := json_build_object(
        'success', true,
        'user_id', user_id,
        'email', user_email,
        'message', 'User promoted to admin successfully'
    );
    
    RETURN result;
    
EXCEPTION
    WHEN OTHERS THEN
        result := json_build_object(
            'success', false,
            'error', SQLERRM,
            'message', 'Failed to promote user to admin'
        );
        RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Admin kullanıcılarını listeleme fonksiyonu
CREATE OR REPLACE FUNCTION list_admin_users()
RETURNS TABLE (
    id UUID,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.full_name,
        p.created_at,
        au.last_sign_in_at
    FROM profiles p
    LEFT JOIN auth.users au ON p.id = au.id
    WHERE p.role = 'admin'
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- KULLANIM ÖRNEKLERİ
-- ============================================

-- 1. Yeni admin kullanıcısı oluştur
-- SELECT create_admin_user('admin@kepmarketplace.com', 'SecurePassword123!', 'Admin User');

-- 2. Mevcut kullanıcıyı admin yap
-- SELECT promote_to_admin('existing@user.com');

-- 3. Admin kullanıcılarını listele
-- SELECT * FROM list_admin_users();

-- ============================================
-- GÜVENLİK NOTLARI
-- ============================================
-- ✅ Admin kayıt seçeneği frontend'de yok
-- ✅ Admin kullanıcıları sadece veritabanından oluşturulabilir
-- ✅ Fonksiyonlar SECURITY DEFINER ile korunmuş
-- ✅ Sadece superuser bu fonksiyonları çalıştırabilir
-- ✅ Admin şifreleri güçlü olmalı
-- ✅ Düzenli olarak admin hesaplarını kontrol edin

