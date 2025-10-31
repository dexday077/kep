-- ============================================
-- MULTI-TENANT SUPPORT EKLEME
-- Mevcut şemaya tenant_id kolonları ve tenants tablosu ekler
-- ============================================

-- 1. TENANTS TABLOSU OLUŞTUR
CREATE TABLE tenants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MEVCUT TABLOLARA TENANT_ID EKLE
ALTER TABLE profiles ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE categories ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE products ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE restaurants ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE menu_items ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE orders ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
ALTER TABLE reviews ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;

-- 3. TENANT_ID KOLONLARINI NOT NULL YAP (mevcut veriler için default değer)
-- Önce default tenant oluştur
INSERT INTO tenants (id, name, slug, settings) VALUES 
('00000000-0000-0000-0000-000000000001', 'Default Tenant', 'default', '{"currency": "TRY", "timezone": "Europe/Istanbul"}');

-- Mevcut verilere default tenant_id ata
UPDATE profiles SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE categories SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE products SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE restaurants SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE menu_items SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE orders SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE reviews SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;

-- Şimdi NOT NULL yap
ALTER TABLE profiles ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE categories ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE products ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE restaurants ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE menu_items ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE orders ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE reviews ALTER COLUMN tenant_id SET NOT NULL;

-- 4. TENANTS TABLOSU İÇİN RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tenants_public_read" ON tenants 
    FOR SELECT 
    USING (is_active = true);

CREATE POLICY "tenants_admin_manage" ON tenants 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = (SELECT auth.uid()) 
            AND profiles.role = 'admin'
        )
    );

-- 5. HELPER FONKSİYONLARI EKLE
CREATE OR REPLACE FUNCTION auth_tenant()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT tenant_id FROM profiles 
        WHERE id = (SELECT auth.uid())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION auth_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role FROM profiles 
        WHERE id = (SELECT auth.uid())
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION auth_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 6. MEVCUT RLS POLİTİKALARINI GÜNCELLE
-- Profiles politikalarını güncelle
DROP POLICY IF EXISTS "Profiles access policy" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;

CREATE POLICY "profiles_tenant_isolation" ON profiles 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

-- Categories politikalarını güncelle
DROP POLICY IF EXISTS "Categories access policy" ON categories;

CREATE POLICY "categories_tenant_isolation" ON categories 
    FOR ALL 
    USING (
        tenant_id = auth_tenant() AND (
            is_active = true OR 
            auth_role() = 'admin'
        )
    )
    WITH CHECK (
        tenant_id = auth_tenant() AND 
        auth_role() = 'admin'
    );

-- Products politikalarını güncelle
DROP POLICY IF EXISTS "Products access policy" ON products;

CREATE POLICY "products_tenant_isolation" ON products 
    FOR ALL 
    USING (
        tenant_id = auth_tenant() AND (
            is_active = true OR 
            (SELECT auth.uid()) = seller_id OR 
            auth_role() = 'admin'
        )
    )
    WITH CHECK (
        tenant_id = auth_tenant() AND 
        (SELECT auth.uid()) = seller_id AND 
        auth_role() IN ('seller', 'admin')
    );

-- Orders politikalarını güncelle
DROP POLICY IF EXISTS "Orders access policy" ON orders;

CREATE POLICY "orders_tenant_isolation" ON orders 
    FOR ALL 
    USING (
        tenant_id = auth_tenant() AND (
            (SELECT auth.uid()) = customer_id OR 
            (SELECT auth.uid()) = seller_id OR 
            auth_role() = 'admin'
        )
    )
    WITH CHECK (
        tenant_id = auth_tenant() AND (
            (SELECT auth.uid()) = customer_id OR 
            (SELECT auth.uid()) = seller_id OR 
            auth_role() = 'admin'
        )
    );

-- Reviews politikalarını güncelle
DROP POLICY IF EXISTS "Reviews access policy" ON reviews;

CREATE POLICY "reviews_tenant_isolation" ON reviews 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (
        tenant_id = auth_tenant() AND 
        (SELECT auth.uid()) = customer_id
    );

-- 7. INDEXLER EKLE
CREATE INDEX CONCURRENTLY idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX CONCURRENTLY idx_categories_tenant_id ON categories(tenant_id);
CREATE INDEX CONCURRENTLY idx_products_tenant_id ON products(tenant_id);
CREATE INDEX CONCURRENTLY idx_restaurants_tenant_id ON restaurants(tenant_id);
CREATE INDEX CONCURRENTLY idx_menu_items_tenant_id ON menu_items(tenant_id);
CREATE INDEX CONCURRENTLY idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX CONCURRENTLY idx_reviews_tenant_id ON reviews(tenant_id);

-- 8. TRIGGER EKLE
CREATE TRIGGER update_tenants_updated_at 
    BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 9. SAMPLE TENANT DATA
INSERT INTO tenants (name, slug, settings) VALUES 
('Demo Company', 'demo-company', '{"currency": "TRY", "timezone": "Europe/Istanbul", "features": ["ecommerce", "restaurant"]}'),
('Test Store', 'test-store', '{"currency": "USD", "timezone": "America/New_York", "features": ["ecommerce"]}');

-- 10. DOĞRULAMA
-- Test sorguları
SELECT 'Tenants count:' as info, COUNT(*) as count FROM tenants;
SELECT 'Profiles with tenant_id:' as info, COUNT(*) as count FROM profiles WHERE tenant_id IS NOT NULL;
SELECT 'Products with tenant_id:' as info, COUNT(*) as count FROM products WHERE tenant_id IS NOT NULL;

-- ============================================
-- MULTI-TENANT SUPPORT EKLENDİ!
-- ============================================
-- Artık tüm tablolar tenant_id ile izole edildi
-- RLS politikaları güncellendi
-- Helper fonksiyonlar eklendi
-- ============================================










