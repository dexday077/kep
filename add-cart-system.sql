-- ============================================
-- CART SYSTEM EKLEME
-- Sepet yönetimi için carts ve cart_items tabloları
-- ============================================

-- 1. CARTS TABLOSU
CREATE TABLE carts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    session_id TEXT, -- Guest cart için
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'abandoned', 'converted')),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CART_ITEMS TABLOSU
CREATE TABLE cart_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cart_id UUID REFERENCES carts(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE, -- Restaurant order için
    menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE, -- Menu item için
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
    notes TEXT, -- Özel notlar (örn: "az tuzlu")
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint: Ya product_id ya da menu_item_id olmalı
    CONSTRAINT cart_item_type_check CHECK (
        (product_id IS NOT NULL AND menu_item_id IS NULL) OR
        (product_id IS NULL AND menu_item_id IS NOT NULL)
    )
);

-- 3. RLS POLICIES
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Carts policies
CREATE POLICY "carts_tenant_isolation" ON carts 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

CREATE POLICY "carts_own_access" ON carts 
    FOR ALL 
    USING (
        (SELECT auth.uid()) = customer_id OR
        session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
    )
    WITH CHECK (
        (SELECT auth.uid()) = customer_id OR
        session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
    );

-- Cart items policies
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

CREATE POLICY "cart_items_own_access" ON cart_items 
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM carts 
            WHERE carts.id = cart_items.cart_id 
            AND (
                (SELECT auth.uid()) = carts.customer_id OR
                carts.session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
            )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM carts 
            WHERE carts.id = cart_items.cart_id 
            AND (
                (SELECT auth.uid()) = carts.customer_id OR
                carts.session_id = current_setting('request.jwt.claims', true)::json->>'session_id'
            )
        )
    );

-- 4. INDEXLER
CREATE INDEX CONCURRENTLY idx_carts_customer_id ON carts(customer_id);
CREATE INDEX CONCURRENTLY idx_carts_tenant_id ON carts(tenant_id);
CREATE INDEX CONCURRENTLY idx_carts_session_id ON carts(session_id);
CREATE INDEX CONCURRENTLY idx_carts_status ON carts(status);
CREATE INDEX CONCURRENTLY idx_carts_expires_at ON carts(expires_at);

CREATE INDEX CONCURRENTLY idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX CONCURRENTLY idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX CONCURRENTLY idx_cart_items_restaurant_id ON cart_items(restaurant_id);
CREATE INDEX CONCURRENTLY idx_cart_items_menu_item_id ON cart_items(menu_item_id);

-- 5. TRIGGERS
CREATE TRIGGER update_carts_updated_at 
    BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at 
    BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 6. HELPER FUNCTIONS

-- Cart toplam fiyatını hesapla
CREATE OR REPLACE FUNCTION calculate_cart_total(cart_uuid UUID)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
    total DECIMAL(10, 2);
BEGIN
    SELECT COALESCE(SUM(total_price), 0)
    INTO total
    FROM cart_items
    WHERE cart_id = cart_uuid;
    
    RETURN total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aktif sepeti getir veya oluştur
CREATE OR REPLACE FUNCTION get_or_create_cart(
    customer_uuid UUID DEFAULT NULL,
    session_uuid TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    cart_id UUID;
    tenant_uuid UUID;
BEGIN
    -- Tenant ID'yi al
    IF customer_uuid IS NOT NULL THEN
        SELECT tenant_id INTO tenant_uuid FROM profiles WHERE id = customer_uuid;
    ELSE
        -- Default tenant kullan
        tenant_uuid := '00000000-0000-0000-0000-000000000001';
    END IF;
    
    -- Aktif sepet ara
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
    
    -- Sepet bulunamadıysa oluştur
    IF cart_id IS NULL THEN
        INSERT INTO carts (customer_id, tenant_id, session_id)
        VALUES (customer_uuid, tenant_uuid, session_uuid)
        RETURNING id INTO cart_id;
    END IF;
    
    RETURN cart_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sepete ürün ekle
CREATE OR REPLACE FUNCTION add_to_cart(
    cart_uuid UUID,
    product_uuid UUID DEFAULT NULL,
    menu_item_uuid UUID DEFAULT NULL,
    item_quantity INTEGER DEFAULT 1,
    item_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    item_id UUID;
    unit_price DECIMAL(10, 2);
    total_price DECIMAL(10, 2);
BEGIN
    -- Fiyatı al
    IF product_uuid IS NOT NULL THEN
        SELECT price INTO unit_price FROM products WHERE id = product_uuid;
    ELSIF menu_item_uuid IS NOT NULL THEN
        SELECT price INTO unit_price FROM menu_items WHERE id = menu_item_uuid;
    ELSE
        RAISE EXCEPTION 'Either product_id or menu_item_id must be provided';
    END IF;
    
    total_price := unit_price * item_quantity;
    
    -- Aynı ürün zaten sepette mi kontrol et
    IF product_uuid IS NOT NULL THEN
        SELECT id INTO item_id 
        FROM cart_items 
        WHERE cart_id = cart_uuid AND product_id = product_uuid;
        
        IF item_id IS NOT NULL THEN
            -- Miktarı güncelle
            UPDATE cart_items 
            SET quantity = quantity + item_quantity,
                total_price = (quantity + item_quantity) * unit_price,
                updated_at = NOW()
            WHERE id = item_id;
            RETURN item_id;
        END IF;
    ELSIF menu_item_uuid IS NOT NULL THEN
        SELECT id INTO item_id 
        FROM cart_items 
        WHERE cart_id = cart_uuid AND menu_item_id = menu_item_uuid;
        
        IF item_id IS NOT NULL THEN
            -- Miktarı güncelle
            UPDATE cart_items 
            SET quantity = quantity + item_quantity,
                total_price = (quantity + item_quantity) * unit_price,
                updated_at = NOW()
            WHERE id = item_id;
            RETURN item_id;
        END IF;
    END IF;
    
    -- Yeni item ekle
    INSERT INTO cart_items (
        cart_id, product_id, menu_item_id, quantity, 
        unit_price, total_price, notes
    )
    VALUES (
        cart_uuid, product_uuid, menu_item_uuid, item_quantity,
        unit_price, total_price, item_notes
    )
    RETURNING id INTO item_id;
    
    RETURN item_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sepetten ürün çıkar
CREATE OR REPLACE FUNCTION remove_from_cart(
    cart_uuid UUID,
    item_uuid UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM cart_items 
    WHERE cart_id = cart_uuid AND id = item_uuid;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Sepeti temizle
CREATE OR REPLACE FUNCTION clear_cart(cart_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM cart_items WHERE cart_id = cart_uuid;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eski sepetleri temizle (cron job için)
CREATE OR REPLACE FUNCTION cleanup_expired_carts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- 30 günden eski sepetleri sil
    DELETE FROM carts 
    WHERE expires_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. VIEWS
-- Sepet detayları view'ı
CREATE VIEW cart_details AS
SELECT 
    c.id as cart_id,
    c.customer_id,
    c.tenant_id,
    c.status,
    c.expires_at,
    c.created_at,
    COUNT(ci.id) as item_count,
    COALESCE(SUM(ci.total_price), 0) as total_amount,
    COALESCE(SUM(ci.quantity), 0) as total_quantity
FROM carts c
LEFT JOIN cart_items ci ON c.id = ci.cart_id
GROUP BY c.id, c.customer_id, c.tenant_id, c.status, c.expires_at, c.created_at;

-- 8. SAMPLE DATA (Test için)
-- Test kullanıcısı için sepet oluştur
INSERT INTO carts (customer_id, tenant_id, status) 
SELECT 
    id, 
    tenant_id, 
    'active'
FROM profiles 
WHERE role = 'customer' 
LIMIT 1;

-- ============================================
-- CART SYSTEM EKLENDİ!
-- ============================================
-- carts ve cart_items tabloları oluşturuldu
-- RLS politikaları ayarlandı
-- Helper fonksiyonlar eklendi
-- Views oluşturuldu
-- ============================================





