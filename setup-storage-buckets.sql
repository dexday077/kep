-- ============================================
-- STORAGE BUCKETS KURULUMU
-- Supabase Storage bucketları ve politikaları
-- ============================================

-- 1. BUCKET'LARI OLUŞTUR
-- Not: Bu komutlar Supabase Dashboard > Storage > New Bucket ile de yapılabilir

-- Products bucket (ürün görselleri)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'products',
    'products',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Avatars bucket (kullanıcı avatarları)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'avatars',
    'avatars',
    true,
    2097152, -- 2MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Documents bucket (belgeler, sertifikalar)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documents',
    'documents',
    false, -- Private bucket
    10485760, -- 10MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Temp bucket (geçici dosyalar)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'temp',
    'temp',
    false, -- Private bucket
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
);

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- 2. PRODUCTS BUCKET POLICIES
-- Herkes ürün görsellerini görebilir
CREATE POLICY "products_public_read" ON storage.objects
    FOR SELECT 
    USING (bucket_id = 'products');

-- Sadece seller'lar ve admin'ler ürün görseli yükleyebilir
CREATE POLICY "products_seller_upload" ON storage.objects
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'products' AND
        (
            auth_role() = 'seller' OR 
            auth_role() = 'admin'
        )
    );

-- Sadece dosya sahibi veya admin silebilir
CREATE POLICY "products_owner_delete" ON storage.objects
    FOR DELETE 
    USING (
        bucket_id = 'products' AND
        (
            auth.uid()::text = (storage.foldername(name))[1] OR
            auth_role() = 'admin'
        )
    );

-- 3. AVATARS BUCKET POLICIES
-- Herkes avatar görebilir
CREATE POLICY "avatars_public_read" ON storage.objects
    FOR SELECT 
    USING (bucket_id = 'avatars');

-- Sadece kendi avatarını yükleyebilir
CREATE POLICY "avatars_own_upload" ON storage.objects
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Sadece kendi avatarını güncelleyebilir
CREATE POLICY "avatars_own_update" ON storage.objects
    FOR UPDATE 
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Sadece kendi avatarını silebilir
CREATE POLICY "avatars_own_delete" ON storage.objects
    FOR DELETE 
    USING (
        bucket_id = 'avatars' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- 4. DOCUMENTS BUCKET POLICIES (Private)
-- Sadece dosya sahibi görebilir
CREATE POLICY "documents_own_read" ON storage.objects
    FOR SELECT 
    USING (
        bucket_id = 'documents' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Sadece seller'lar ve admin'ler belge yükleyebilir
CREATE POLICY "documents_seller_upload" ON storage.objects
    FOR INSERT 
    WITH CHECK (
        bucket_id = 'documents' AND
        (
            auth_role() = 'seller' OR 
            auth_role() = 'admin'
        )
    );

-- Sadece dosya sahibi veya admin silebilir
CREATE POLICY "documents_owner_delete" ON storage.objects
    FOR DELETE 
    USING (
        bucket_id = 'documents' AND
        (
            auth.uid()::text = (storage.foldername(name))[1] OR
            auth_role() = 'admin'
        )
    );

-- 5. TEMP BUCKET POLICIES (Private)
-- Sadece dosya sahibi görebilir
CREATE POLICY "temp_own_read" ON storage.objects
    FOR SELECT 
    USING (
        bucket_id = 'temp' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Herkes geçici dosya yükleyebilir
CREATE POLICY "temp_anyone_upload" ON storage.objects
    FOR INSERT 
    WITH CHECK (bucket_id = 'temp');

-- Sadece dosya sahibi silebilir
CREATE POLICY "temp_owner_delete" ON storage.objects
    FOR DELETE 
    USING (
        bucket_id = 'temp' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- 6. SIGNED URL GENERATION FUNCTION
CREATE OR REPLACE FUNCTION generate_signed_url(
    bucket_name TEXT,
    file_path TEXT,
    expires_in INTEGER DEFAULT 3600
)
RETURNS TEXT AS $$
DECLARE
    signed_url TEXT;
BEGIN
    -- Bu fonksiyon Edge Function'da implement edilecek
    -- Şimdilik placeholder
    RETURN 'https://' || bucket_name || '.supabase.co/storage/v1/object/sign/' || bucket_name || '/' || file_path;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. FILE CLEANUP FUNCTION
CREATE OR REPLACE FUNCTION cleanup_temp_files()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- 24 saatten eski temp dosyaları sil
    DELETE FROM storage.objects 
    WHERE bucket_id = 'temp' 
    AND created_at < NOW() - INTERVAL '24 hours';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SAMPLE FILE STRUCTURE
-- ============================================
-- products/
--   ├── {product_id}/
--   │   ├── main.jpg
--   │   ├── gallery/
--   │   │   ├── 1.jpg
--   │   │   └── 2.jpg
--   │   └── thumbnails/
--   │       └── main_thumb.jpg
--
-- avatars/
--   ├── {user_id}/
--   │   └── avatar.jpg
--
-- documents/
--   ├── {user_id}/
--   │   ├── business_license.pdf
--   │   └── tax_certificate.pdf
--
-- temp/
--   ├── {user_id}/
--   │   └── temp_upload.jpg

-- ============================================
-- STORAGE BUCKETS KURULDU!
-- ============================================
-- 4 bucket oluşturuldu: products, avatars, documents, temp
-- Tüm politikalar ayarlandı
-- Helper fonksiyonlar eklendi
-- ============================================










