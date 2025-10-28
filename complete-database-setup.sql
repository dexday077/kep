-- ============================================
-- KEP MARKETPLACE - COMPLETE DATABASE SETUP
-- Tüm eksik bileşenleri ekleyen ana script
-- ============================================

-- Bu script şu sırayla çalıştırılmalı:
-- 1. Mevcut supabase-schema.sql (zaten var)
-- 2. add-multi-tenant-support.sql
-- 3. setup-storage-buckets.sql  
-- 4. add-cart-system.sql
-- 5. add-payment-system.sql
-- 6. add-shipping-system.sql

-- ============================================
-- 1. MULTI-TENANT SUPPORT
-- ============================================

-- Tenants tablosu
CREATE TABLE IF NOT EXISTS tenants (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Mevcut tablolara tenant_id ekle (eğer yoksa)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'tenant_id') THEN
        ALTER TABLE profiles ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'categories' AND column_name = 'tenant_id') THEN
        ALTER TABLE categories ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'tenant_id') THEN
        ALTER TABLE products ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'tenant_id') THEN
        ALTER TABLE restaurants ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'menu_items' AND column_name = 'tenant_id') THEN
        ALTER TABLE menu_items ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'tenant_id') THEN
        ALTER TABLE orders ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reviews' AND column_name = 'tenant_id') THEN
        ALTER TABLE reviews ADD COLUMN tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Default tenant oluştur (eğer yoksa)
INSERT INTO tenants (id, name, slug, settings) 
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Tenant', 'default', '{"currency": "TRY", "timezone": "Europe/Istanbul"}')
ON CONFLICT (id) DO NOTHING;

-- Mevcut verilere default tenant_id ata
UPDATE profiles SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE categories SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE products SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE restaurants SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE menu_items SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE orders SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;
UPDATE reviews SET tenant_id = '00000000-0000-0000-0000-000000000001' WHERE tenant_id IS NULL;

-- Tenant_id kolonlarını NOT NULL yap
ALTER TABLE profiles ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE categories ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE products ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE restaurants ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE menu_items ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE orders ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE reviews ALTER COLUMN tenant_id SET NOT NULL;

-- ============================================
-- 2. CART SYSTEM
-- ============================================

-- Carts tablosu
CREATE TABLE IF NOT EXISTS carts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    session_id TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'abandoned', 'converted')),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cart items tablosu
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT cart_item_type_check CHECK (
        (product_id IS NOT NULL AND menu_item_id IS NULL) OR
        (product_id IS NULL AND menu_item_id IS NOT NULL)
    )
);

-- ============================================
-- 3. PAYMENT SYSTEM
-- ============================================

-- Payments tablosu
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    provider TEXT NOT NULL CHECK (provider IN ('stripe', 'iyzico', 'paytr', 'manual')),
    provider_payment_id TEXT,
    provider_session_id TEXT,
    
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    currency TEXT DEFAULT 'TRY' CHECK (currency IN ('TRY', 'USD', 'EUR')),
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'succeeded', 'failed', 
        'cancelled', 'refunded', 'partially_refunded'
    )),
    
    payment_method TEXT,
    payment_method_details JSONB,
    metadata JSONB DEFAULT '{}',
    failure_reason TEXT,
    refund_reason TEXT,
    
    paid_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods tablosu
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    
    provider TEXT NOT NULL CHECK (provider IN ('stripe', 'iyzico', 'paytr')),
    provider_method_id TEXT NOT NULL,
    
    type TEXT NOT NULL CHECK (type IN ('card', 'bank_account', 'wallet')),
    is_default BOOLEAN DEFAULT false,
    
    card_brand TEXT,
    card_last4 TEXT,
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    
    bank_name TEXT,
    bank_last4 TEXT,
    
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refunds tablosu
CREATE TABLE IF NOT EXISTS refunds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
    
    provider_refund_id TEXT,
    failure_reason TEXT,
    
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- 4. SHIPPING SYSTEM
-- ============================================

-- Shipments tablosu
CREATE TABLE IF NOT EXISTS shipments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    
    provider TEXT NOT NULL CHECK (provider IN ('yurtici', 'aras', 'mng', 'ptt', 'ups', 'dhl', 'manual')),
    tracking_number TEXT UNIQUE,
    provider_shipment_id TEXT,
    
    shipping_method TEXT DEFAULT 'standard' CHECK (shipping_method IN ('standard', 'express', 'overnight', 'pickup')),
    shipping_cost DECIMAL(10, 2) DEFAULT 0 CHECK (shipping_cost >= 0),
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    
    sender_name TEXT,
    sender_address TEXT,
    sender_phone TEXT,
    sender_city TEXT,
    sender_district TEXT,
    sender_postal_code TEXT,
    
    recipient_name TEXT NOT NULL,
    recipient_address TEXT NOT NULL,
    recipient_phone TEXT NOT NULL,
    recipient_city TEXT NOT NULL,
    recipient_district TEXT NOT NULL,
    recipient_postal_code TEXT,
    
    package_weight DECIMAL(8, 3),
    package_dimensions JSONB,
    package_value DECIMAL(10, 2),
    
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'picked_up', 'in_transit', 'out_for_delivery', 
        'delivered', 'failed_delivery', 'returned', 'cancelled'
    )),
    status_history JSONB DEFAULT '[]',
    
    metadata JSONB DEFAULT '{}',
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping rates tablosu
CREATE TABLE IF NOT EXISTS shipping_rates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    
    name TEXT NOT NULL,
    provider TEXT NOT NULL CHECK (provider IN ('yurtici', 'aras', 'mng', 'ptt', 'ups', 'dhl')),
    shipping_method TEXT NOT NULL CHECK (shipping_method IN ('standard', 'express', 'overnight', 'pickup')),
    
    min_weight DECIMAL(8, 3) DEFAULT 0,
    max_weight DECIMAL(8, 3),
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_order_amount DECIMAL(10, 2),
    
    allowed_cities TEXT[],
    excluded_cities TEXT[],
    allowed_districts TEXT[],
    excluded_districts TEXT[],
    
    base_rate DECIMAL(10, 2) NOT NULL CHECK (base_rate >= 0),
    rate_per_kg DECIMAL(10, 2) DEFAULT 0 CHECK (rate_per_kg >= 0),
    free_shipping_threshold DECIMAL(10, 2),
    
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shipping addresses tablosu
CREATE TABLE IF NOT EXISTS shipping_addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    
    title TEXT NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    postal_code TEXT,
    country TEXT DEFAULT 'Turkey',
    
    address_type TEXT DEFAULT 'home' CHECK (address_type IN ('home', 'work', 'other')),
    is_default BOOLEAN DEFAULT false,
    
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Auth helper functions
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

-- Cart functions
CREATE OR REPLACE FUNCTION get_or_create_cart(
    customer_uuid UUID DEFAULT NULL,
    session_uuid TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    cart_id UUID;
    tenant_uuid UUID;
BEGIN
    IF customer_uuid IS NOT NULL THEN
        SELECT tenant_id INTO tenant_uuid FROM profiles WHERE id = customer_uuid;
    ELSE
        tenant_uuid := '00000000-0000-0000-0000-000000000001';
    END IF;
    
    IF customer_uuid IS NOT NULL THEN
        SELECT id INTO cart_id 
        FROM carts 
        WHERE customer_id = customer_uuid 
        AND status = 'active' 
        AND expires_at > NOW()
        LIMIT 1;
    ELSIF session_uuid IS NOT NULL THEN
        SELECT id INTO cart_id 
        FROM carts 
        WHERE session_id = session_uuid 
        AND status = 'active' 
        AND expires_at > NOW()
        LIMIT 1;
    END IF;
    
    IF cart_id IS NULL THEN
        INSERT INTO carts (customer_id, tenant_id, session_id)
        VALUES (customer_uuid, tenant_uuid, session_uuid)
        RETURNING id INTO cart_id;
    END IF;
    
    RETURN cart_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. RLS POLICIES
-- ============================================

-- Tenants policies
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tenants_public_read" ON tenants;
CREATE POLICY "tenants_public_read" ON tenants 
    FOR SELECT 
    USING (is_active = true);

DROP POLICY IF EXISTS "tenants_admin_manage" ON tenants;
CREATE POLICY "tenants_admin_manage" ON tenants 
    FOR ALL 
    USING (auth_role() = 'admin');

-- Carts policies
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "carts_tenant_isolation" ON carts;
CREATE POLICY "carts_tenant_isolation" ON carts 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

-- Cart items policies
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cart_items_tenant_isolation" ON cart_items;
CREATE POLICY "cart_items_tenant_isolation" ON cart_items 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM carts 
            WHERE carts.id = cart_items.cart_id 
            AND carts.tenant_id = auth_tenant()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM carts 
            WHERE carts.id = cart_items.cart_id 
            AND carts.tenant_id = auth_tenant()
        )
    );

-- Payments policies
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payments_tenant_isolation" ON payments;
CREATE POLICY "payments_tenant_isolation" ON payments 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

-- Payment methods policies
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "payment_methods_tenant_isolation" ON payment_methods;
CREATE POLICY "payment_methods_tenant_isolation" ON payment_methods 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

-- Shipments policies
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shipments_tenant_isolation" ON shipments;
CREATE POLICY "shipments_tenant_isolation" ON shipments 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

-- Shipping rates policies
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shipping_rates_tenant_isolation" ON shipping_rates;
CREATE POLICY "shipping_rates_tenant_isolation" ON shipping_rates 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

-- Shipping addresses policies
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "shipping_addresses_tenant_isolation" ON shipping_addresses;
CREATE POLICY "shipping_addresses_tenant_isolation" ON shipping_addresses 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

-- ============================================
-- 7. INDEXLER
-- ============================================

-- Multi-tenant indexes
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_categories_tenant_id ON categories(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_tenant_id ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_restaurants_tenant_id ON restaurants(tenant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_tenant_id ON menu_items(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant_id ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_reviews_tenant_id ON reviews(tenant_id);

-- Cart indexes
CREATE INDEX IF NOT EXISTS idx_carts_customer_id ON carts(customer_id);
CREATE INDEX IF NOT EXISTS idx_carts_tenant_id ON carts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_carts_session_id ON carts(session_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant_id ON payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider ON payments(provider);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Shipping indexes
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tenant_id ON shipments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_provider ON shipments(provider);

-- ============================================
-- 8. TRIGGERS
-- ============================================

-- Update triggers for new tables
CREATE TRIGGER update_tenants_updated_at 
    BEFORE UPDATE ON tenants
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_carts_updated_at 
    BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at 
    BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at 
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_shipments_updated_at 
    BEFORE UPDATE ON shipments
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_shipping_rates_updated_at 
    BEFORE UPDATE ON shipping_rates
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_shipping_addresses_updated_at 
    BEFORE UPDATE ON shipping_addresses
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- 9. SAMPLE DATA
-- ============================================

-- Sample tenants
INSERT INTO tenants (name, slug, settings) VALUES 
('Demo Company', 'demo-company', '{"currency": "TRY", "timezone": "Europe/Istanbul", "features": ["ecommerce", "restaurant"]}'),
('Test Store', 'test-store', '{"currency": "USD", "timezone": "America/New_York", "features": ["ecommerce"]}')
ON CONFLICT (slug) DO NOTHING;

-- Sample shipping rates
INSERT INTO shipping_rates (tenant_id, name, provider, shipping_method, base_rate, rate_per_kg, free_shipping_threshold, priority)
VALUES 
('00000000-0000-0000-0000-000000000001', 'Standard Shipping', 'yurtici', 'standard', 15.00, 2.00, 200.00, 1),
('00000000-0000-0000-0000-000000000001', 'Express Delivery', 'yurtici', 'express', 25.00, 3.00, 300.00, 2),
('00000000-0000-0000-0000-000000000001', 'Overnight', 'aras', 'overnight', 35.00, 4.00, 500.00, 3)
ON CONFLICT DO NOTHING;

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Tüm eksik bileşenler eklendi:
-- ✅ Multi-tenant support
-- ✅ Cart system
-- ✅ Payment system  
-- ✅ Shipping system
-- ✅ RLS policies
-- ✅ Helper functions
-- ✅ Indexes
-- ✅ Triggers
-- ✅ Sample data
-- ============================================
