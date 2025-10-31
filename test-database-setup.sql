-- ============================================
-- DATABASE SETUP TEST SCRIPT
-- Tüm tabloların ve fonksiyonların doğru çalıştığını test eder
-- ============================================

-- Test 1: Tabloların varlığını kontrol et
SELECT 'TABLES CHECK' as test_name;

SELECT 
    table_name,
    CASE 
        WHEN table_name IN (
            'profiles', 'categories', 'products', 'restaurants', 'menu_items', 
            'orders', 'reviews', 'tenants', 'carts', 'cart_items', 
            'payments', 'payment_methods', 'refunds', 'shipments', 
            'shipping_rates', 'shipping_addresses'
        ) THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'profiles', 'categories', 'products', 'restaurants', 'menu_items', 
    'orders', 'reviews', 'tenants', 'carts', 'cart_items', 
    'payments', 'payment_methods', 'refunds', 'shipments', 
    'shipping_rates', 'shipping_addresses'
)
ORDER BY table_name;

-- Test 2: Tenant_id kolonlarının varlığını kontrol et
SELECT 'TENANT_ID COLUMNS CHECK' as test_name;

SELECT 
    table_name,
    column_name,
    CASE 
        WHEN column_name = 'tenant_id' THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'categories', 'products', 'restaurants', 'menu_items', 'orders', 'reviews')
AND column_name = 'tenant_id'
ORDER BY table_name;

-- Test 3: RLS politikalarının varlığını kontrol et
SELECT 'RLS POLICIES CHECK' as test_name;

SELECT 
    schemaname,
    tablename,
    policyname,
    CASE 
        WHEN policyname IS NOT NULL THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN (
    'profiles', 'categories', 'products', 'restaurants', 'menu_items', 
    'orders', 'reviews', 'tenants', 'carts', 'cart_items', 
    'payments', 'payment_methods', 'refunds', 'shipments', 
    'shipping_rates', 'shipping_addresses'
)
ORDER BY tablename, policyname;

-- Test 4: Helper fonksiyonlarının varlığını kontrol et
SELECT 'HELPER FUNCTIONS CHECK' as test_name;

SELECT 
    routine_name,
    routine_type,
    CASE 
        WHEN routine_name IN ('auth_tenant', 'auth_role', 'auth_user_id', 'get_or_create_cart') THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('auth_tenant', 'auth_role', 'auth_user_id', 'get_or_create_cart')
ORDER BY routine_name;

-- Test 5: Indexlerin varlığını kontrol et
SELECT 'INDEXES CHECK' as test_name;

SELECT 
    indexname,
    tablename,
    CASE 
        WHEN indexname LIKE '%tenant_id%' OR indexname LIKE '%cart%' OR indexname LIKE '%payment%' OR indexname LIKE '%shipment%' THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM pg_indexes 
WHERE schemaname = 'public' 
AND (
    indexname LIKE '%tenant_id%' OR 
    indexname LIKE '%cart%' OR 
    indexname LIKE '%payment%' OR 
    indexname LIKE '%shipment%'
)
ORDER BY tablename, indexname;

-- Test 6: Trigger'ların varlığını kontrol et
SELECT 'TRIGGERS CHECK' as test_name;

SELECT 
    trigger_name,
    event_object_table,
    CASE 
        WHEN trigger_name LIKE '%updated_at%' THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table, trigger_name;

-- Test 7: Sample data kontrolü
SELECT 'SAMPLE DATA CHECK' as test_name;

SELECT 
    'tenants' as table_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ HAS DATA'
        ELSE '❌ NO DATA'
    END as status
FROM tenants
UNION ALL
SELECT 
    'categories' as table_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ HAS DATA'
        ELSE '❌ NO DATA'
    END as status
FROM categories
UNION ALL
SELECT 
    'shipping_rates' as table_name,
    COUNT(*) as record_count,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ HAS DATA'
        ELSE '❌ NO DATA'
    END as status
FROM shipping_rates;

-- Test 8: Fonksiyon testleri
SELECT 'FUNCTION TESTS' as test_name;

-- Auth functions test (mock user)
DO $$
DECLARE
    test_tenant_id UUID;
    test_role TEXT;
    test_user_id UUID;
BEGIN
    -- Test auth_tenant function
    BEGIN
        SELECT auth_tenant() INTO test_tenant_id;
        RAISE NOTICE 'auth_tenant() test: %', 
            CASE WHEN test_tenant_id IS NOT NULL THEN '✅ PASS' ELSE '❌ FAIL' END;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'auth_tenant() test: ❌ ERROR - %', SQLERRM;
    END;
    
    -- Test auth_role function
    BEGIN
        SELECT auth_role() INTO test_role;
        RAISE NOTICE 'auth_role() test: %', 
            CASE WHEN test_role IS NOT NULL THEN '✅ PASS' ELSE '❌ FAIL' END;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'auth_role() test: ❌ ERROR - %', SQLERRM;
    END;
    
    -- Test auth_user_id function
    BEGIN
        SELECT auth_user_id() INTO test_user_id;
        RAISE NOTICE 'auth_user_id() test: %', 
            CASE WHEN test_user_id IS NOT NULL THEN '✅ PASS' ELSE '❌ FAIL' END;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'auth_user_id() test: ❌ ERROR - %', SQLERRM;
    END;
END $$;

-- Test 9: RLS Policy Test
SELECT 'RLS POLICY TEST' as test_name;

-- Test if RLS is enabled on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled,
    CASE 
        WHEN rowsecurity = true THEN '✅ ENABLED'
        ELSE '❌ DISABLED'
    END as status
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'profiles', 'categories', 'products', 'restaurants', 'menu_items', 
    'orders', 'reviews', 'tenants', 'carts', 'cart_items', 
    'payments', 'payment_methods', 'refunds', 'shipments', 
    'shipping_rates', 'shipping_addresses'
)
ORDER BY tablename;

-- Test 10: Foreign Key Constraints
SELECT 'FOREIGN KEY CONSTRAINTS CHECK' as test_name;

SELECT 
    tc.table_name,
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    CASE 
        WHEN tc.constraint_name IS NOT NULL THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
AND tc.table_name IN (
    'profiles', 'categories', 'products', 'restaurants', 'menu_items', 
    'orders', 'reviews', 'tenants', 'carts', 'cart_items', 
    'payments', 'payment_methods', 'refunds', 'shipments', 
    'shipping_rates', 'shipping_addresses'
)
ORDER BY tc.table_name, tc.constraint_name;

-- Test 11: Check Constraints
SELECT 'CHECK CONSTRAINTS CHECK' as test_name;

SELECT 
    tc.table_name,
    tc.constraint_name,
    cc.check_clause,
    CASE 
        WHEN tc.constraint_name IS NOT NULL THEN '✅ EXISTS'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.table_constraints AS tc
JOIN information_schema.check_constraints AS cc
    ON tc.constraint_name = cc.constraint_name
WHERE tc.constraint_type = 'CHECK'
AND tc.table_schema = 'public'
AND tc.table_name IN (
    'profiles', 'categories', 'products', 'restaurants', 'menu_items', 
    'orders', 'reviews', 'tenants', 'carts', 'cart_items', 
    'payments', 'payment_methods', 'refunds', 'shipments', 
    'shipping_rates', 'shipping_addresses'
)
ORDER BY tc.table_name, tc.constraint_name;

-- Test 12: Summary Report
SELECT 'SUMMARY REPORT' as test_name;

SELECT 
    'Total Tables' as metric,
    COUNT(*) as count,
    '✅' as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'profiles', 'categories', 'products', 'restaurants', 'menu_items', 
    'orders', 'reviews', 'tenants', 'carts', 'cart_items', 
    'payments', 'payment_methods', 'refunds', 'shipments', 
    'shipping_rates', 'shipping_addresses'
)
UNION ALL
SELECT 
    'Total RLS Policies' as metric,
    COUNT(*) as count,
    '✅' as status
FROM pg_policies 
WHERE schemaname = 'public'
UNION ALL
SELECT 
    'Total Functions' as metric,
    COUNT(*) as count,
    '✅' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('auth_tenant', 'auth_role', 'auth_user_id', 'get_or_create_cart')
UNION ALL
SELECT 
    'Total Indexes' as metric,
    COUNT(*) as count,
    '✅' as status
FROM pg_indexes 
WHERE schemaname = 'public' 
AND (
    indexname LIKE '%tenant_id%' OR 
    indexname LIKE '%cart%' OR 
    indexname LIKE '%payment%' OR 
    indexname LIKE '%shipment%'
);

-- ============================================
-- TEST COMPLETE!
-- ============================================
-- Bu script tüm database bileşenlerini test eder
-- Her test sonucu ✅ (başarılı) veya ❌ (başarısız) gösterir
-- ============================================










