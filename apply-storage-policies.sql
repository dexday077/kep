-- ============================================
-- STORAGE POLICIES UYGULAMA
-- Bucket'lar zaten oluşturulmuş, sadece politikaları ekliyoruz
-- ============================================

-- 1. PRODUCTS BUCKET POLICIES
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

-- 2. AVATARS BUCKET POLICIES
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

-- 3. DOCUMENTS BUCKET POLICIES (Private)
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

-- 4. TEMP BUCKET POLICIES (Private)
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
-- STORAGE POLICIES UYGULANDI!
-- ============================================
-- Tüm bucket'lar için güvenlik politikaları eklendi
-- Artık dosya yükleme/indirme güvenli
-- ============================================










