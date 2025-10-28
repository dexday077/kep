-- ============================================
-- MULTI-TENANT SUPPORT TEST SORGULARI
-- ============================================

-- 1. TENANTS TABLOSU KONTROLÜ
SELECT 'Tenants Table Check:' as test_name;
SELECT id, name, slug, is_active, created_at FROM tenants ORDER BY created_at;

-- 2. TENANT_ID KOLONLARI KONTROLÜ
SELECT 'Profiles with tenant_id:' as test_name;
SELECT COUNT(*) as count, COUNT(tenant_id) as with_tenant_id FROM profiles;

SELECT 'Products with tenant_id:' as test_name;
SELECT COUNT(*) as count, COUNT(tenant_id) as with_tenant_id FROM products;

SELECT 'Categories with tenant_id:' as test_name;
SELECT COUNT(*) as count, COUNT(tenant_id) as with_tenant_id FROM categories;

-- 3. HELPER FONKSİYONLARI TEST ET
SELECT 'Helper Functions Test:' as test_name;

-- Test auth_tenant() function (bu fonksiyon sadece authenticated user için çalışır)
-- SELECT auth_tenant() as current_tenant;

-- Test auth_role() function
-- SELECT auth_role() as current_role;

-- Test auth_user_id() function
-- SELECT auth_user_id() as current_user_id;

-- 4. RLS POLİTİKALARI KONTROLÜ
SELECT 'RLS Policies Check:' as test_name;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('tenants', 'profiles', 'products', 'categories', 'orders', 'reviews')
ORDER BY tablename, policyname;

-- 5. INDEXLER KONTROLÜ
SELECT 'Indexes Check:' as test_name;
SELECT indexname, tablename, indexdef 
FROM pg_indexes 
WHERE tablename IN ('tenants', 'profiles', 'products', 'categories', 'orders', 'reviews')
AND indexname LIKE '%tenant%'
ORDER BY tablename, indexname;

-- 6. SAMPLE DATA KONTROLÜ
SELECT 'Sample Data Check:' as test_name;
SELECT 
    'Default Tenant' as tenant_name,
    COUNT(*) as profile_count
FROM profiles 
WHERE tenant_id = '00000000-0000-0000-0000-000000000001';

-- 7. TENANT İZOLASYON TESTİ (Manuel test için)
-- Bu sorgular farklı tenant'ların birbirini göremediğini test eder
SELECT 'Tenant Isolation Test (Manual):' as test_name;
SELECT 
    'Profiles by tenant:' as test_type,
    tenant_id,
    COUNT(*) as profile_count
FROM profiles 
GROUP BY tenant_id
ORDER BY tenant_id;

-- 8. CONSTRAINT KONTROLÜ
SELECT 'Constraints Check:' as test_name;
SELECT 
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
WHERE tc.table_name IN ('tenants', 'profiles', 'products', 'categories', 'orders', 'reviews')
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name LIKE '%tenant%'
ORDER BY tc.table_name, tc.constraint_name;

-- ============================================
-- TEST SONUÇLARI DEĞERLENDİRME
-- ============================================
-- ✅ Başarılı olması gerekenler:
-- 1. Tenants tablosunda en az 1 kayıt olmalı (default tenant)
-- 2. Tüm tablolarda tenant_id kolonları NOT NULL olmalı
-- 3. RLS politikaları tenant_isolation içermeli
-- 4. Indexler tenant_id için oluşturulmuş olmalı
-- 5. Foreign key constraint'ler tenant_id için olmalı

-- ❌ Hata durumları:
-- 1. tenant_id kolonları NULL ise
-- 2. RLS politikaları eksikse
-- 3. Indexler eksikse
-- 4. Foreign key constraint'ler eksikse

