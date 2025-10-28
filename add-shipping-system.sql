-- ============================================
-- SHIPPING SYSTEM EKLEME
-- Kargo takibi için shipments tablosu ve webhook functions
-- ============================================

-- 1. SHIPMENTS TABLOSU
CREATE TABLE shipments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    
    -- Shipping Provider Info
    provider TEXT NOT NULL CHECK (provider IN ('yurtici', 'aras', 'mng', 'ptt', 'ups', 'dhl', 'manual')),
    tracking_number TEXT UNIQUE,
    provider_shipment_id TEXT, -- Provider'dan gelen shipment ID
    
    -- Shipping Details
    shipping_method TEXT DEFAULT 'standard' CHECK (shipping_method IN ('standard', 'express', 'overnight', 'pickup')),
    shipping_cost DECIMAL(10, 2) DEFAULT 0 CHECK (shipping_cost >= 0),
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    
    -- Address Information
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
    
    -- Package Details
    package_weight DECIMAL(8, 3), -- kg
    package_dimensions JSONB, -- {length, width, height} in cm
    package_value DECIMAL(10, 2), -- Declared value for insurance
    
    -- Status and Tracking
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'picked_up', 'in_transit', 'out_for_delivery', 
        'delivered', 'failed_delivery', 'returned', 'cancelled'
    )),
    status_history JSONB DEFAULT '[]', -- Array of status updates
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. SHIPPING_RATES TABLOSU (Kargo ücretleri)
CREATE TABLE shipping_rates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    
    -- Rate Configuration
    name TEXT NOT NULL, -- "Standard Shipping", "Express Delivery"
    provider TEXT NOT NULL CHECK (provider IN ('yurtici', 'aras', 'mng', 'ptt', 'ups', 'dhl')),
    shipping_method TEXT NOT NULL CHECK (shipping_method IN ('standard', 'express', 'overnight', 'pickup')),
    
    -- Rate Rules
    min_weight DECIMAL(8, 3) DEFAULT 0,
    max_weight DECIMAL(8, 3),
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_order_amount DECIMAL(10, 2),
    
    -- Geographic Rules
    allowed_cities TEXT[], -- NULL means all cities
    excluded_cities TEXT[],
    allowed_districts TEXT[], -- NULL means all districts
    excluded_districts TEXT[],
    
    -- Pricing
    base_rate DECIMAL(10, 2) NOT NULL CHECK (base_rate >= 0),
    rate_per_kg DECIMAL(10, 2) DEFAULT 0 CHECK (rate_per_kg >= 0),
    free_shipping_threshold DECIMAL(10, 2), -- Free shipping above this amount
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 0, -- Higher number = higher priority
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SHIPPING_ADDRESSES TABLOSU (Kayıtlı adresler)
CREATE TABLE shipping_addresses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    
    -- Address Details
    title TEXT NOT NULL, -- "Ev", "İş", "Villa"
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    district TEXT NOT NULL,
    postal_code TEXT,
    country TEXT DEFAULT 'Turkey',
    
    -- Address Type
    address_type TEXT DEFAULT 'home' CHECK (address_type IN ('home', 'work', 'other')),
    is_default BOOLEAN DEFAULT false,
    
    -- Location Data (for distance calculation)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- Metadata
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RLS POLICIES
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;

-- Shipments policies
CREATE POLICY "shipments_tenant_isolation" ON shipments 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

CREATE POLICY "shipments_customer_access" ON shipments 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = shipments.order_id 
            AND orders.customer_id = (SELECT auth.uid())
        ) OR
        auth_role() = 'admin'
    );

CREATE POLICY "shipments_seller_access" ON shipments 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = shipments.order_id 
            AND orders.seller_id = (SELECT auth.uid())
        ) OR
        auth_role() = 'admin'
    );

-- Shipping rates policies
CREATE POLICY "shipping_rates_tenant_isolation" ON shipping_rates 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

CREATE POLICY "shipping_rates_public_read" ON shipping_rates 
    FOR SELECT 
    USING (is_active = true);

CREATE POLICY "shipping_rates_admin_manage" ON shipping_rates 
    FOR ALL 
    USING (auth_role() = 'admin')
    WITH CHECK (auth_role() = 'admin');

-- Shipping addresses policies
CREATE POLICY "shipping_addresses_tenant_isolation" ON shipping_addresses 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

CREATE POLICY "shipping_addresses_own_access" ON shipping_addresses 
    FOR ALL 
    USING (
        (SELECT auth.uid()) = customer_id OR
        auth_role() = 'admin'
    )
    WITH CHECK (
        (SELECT auth.uid()) = customer_id OR
        auth_role() = 'admin'
    );

-- 5. INDEXLER
CREATE INDEX CONCURRENTLY idx_shipments_order_id ON shipments(order_id);
CREATE INDEX CONCURRENTLY idx_shipments_tenant_id ON shipments(tenant_id);
CREATE INDEX CONCURRENTLY idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX CONCURRENTLY idx_shipments_provider ON shipments(provider);
CREATE INDEX CONCURRENTLY idx_shipments_status ON shipments(status);
CREATE INDEX CONCURRENTLY idx_shipments_provider_shipment_id ON shipments(provider_shipment_id);

CREATE INDEX CONCURRENTLY idx_shipping_rates_tenant_id ON shipping_rates(tenant_id);
CREATE INDEX CONCURRENTLY idx_shipping_rates_provider ON shipping_rates(provider);
CREATE INDEX CONCURRENTLY idx_shipping_rates_is_active ON shipping_rates(is_active);
CREATE INDEX CONCURRENTLY idx_shipping_rates_priority ON shipping_rates(priority);

CREATE INDEX CONCURRENTLY idx_shipping_addresses_customer_id ON shipping_addresses(customer_id);
CREATE INDEX CONCURRENTLY idx_shipping_addresses_tenant_id ON shipping_addresses(tenant_id);
CREATE INDEX CONCURRENTLY idx_shipping_addresses_is_default ON shipping_addresses(is_default);

-- 6. TRIGGERS
CREATE TRIGGER update_shipments_updated_at 
    BEFORE UPDATE ON shipments
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_shipping_rates_updated_at 
    BEFORE UPDATE ON shipping_rates
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_shipping_addresses_updated_at 
    BEFORE UPDATE ON shipping_addresses
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 7. HELPER FUNCTIONS

-- Shipment oluştur
CREATE OR REPLACE FUNCTION create_shipment(
    order_uuid UUID,
    provider_name TEXT,
    shipping_method_name TEXT DEFAULT 'standard',
    tracking_num TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    shipment_id UUID;
    tenant_uuid UUID;
    order_data RECORD;
BEGIN
    -- Order bilgilerini al
    SELECT tenant_id, delivery_address, delivery_phone, customer_id
    INTO order_data
    FROM orders 
    WHERE id = order_uuid;
    
    IF order_data.tenant_id IS NULL THEN
        RAISE EXCEPTION 'Order not found';
    END IF;
    
    -- Shipment oluştur
    INSERT INTO shipments (
        order_id, tenant_id, provider, shipping_method, 
        tracking_number, recipient_address, recipient_phone
    )
    VALUES (
        order_uuid, order_data.tenant_id, provider_name, shipping_method_name,
        tracking_num, order_data.delivery_address, order_data.delivery_phone
    )
    RETURNING id INTO shipment_id;
    
    RETURN shipment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Shipment durumunu güncelle
CREATE OR REPLACE FUNCTION update_shipment_status(
    shipment_uuid UUID,
    new_status TEXT,
    status_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    updated_count INTEGER;
    current_history JSONB;
BEGIN
    -- Mevcut status history'yi al
    SELECT status_history INTO current_history
    FROM shipments 
    WHERE id = shipment_uuid;
    
    -- Yeni status update ekle
    current_history := current_history || jsonb_build_array(
        jsonb_build_object(
            'status', new_status,
            'timestamp', NOW(),
            'notes', status_notes
        )
    );
    
    -- Shipment'ı güncelle
    UPDATE shipments 
    SET 
        status = new_status,
        status_history = current_history,
        actual_delivery_date = CASE WHEN new_status = 'delivered' THEN CURRENT_DATE ELSE actual_delivery_date END,
        updated_at = NOW()
    WHERE id = shipment_uuid;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kargo ücreti hesapla
CREATE OR REPLACE FUNCTION calculate_shipping_cost(
    tenant_uuid UUID,
    order_amount DECIMAL(10, 2),
    package_weight DECIMAL(8, 3) DEFAULT 1.0,
    city_name TEXT DEFAULT NULL,
    district_name TEXT DEFAULT NULL
)
RETURNS DECIMAL(10, 2) AS $$
DECLARE
    shipping_cost DECIMAL(10, 2) := 0;
    rate_record RECORD;
BEGIN
    -- Uygun shipping rate'leri bul
    FOR rate_record IN
        SELECT * FROM shipping_rates
        WHERE tenant_id = tenant_uuid
        AND is_active = true
        AND min_order_amount <= order_amount
        AND (max_order_amount IS NULL OR max_order_amount >= order_amount)
        AND min_weight <= package_weight
        AND (max_weight IS NULL OR max_weight >= package_weight)
        AND (allowed_cities IS NULL OR city_name = ANY(allowed_cities))
        AND (excluded_cities IS NULL OR city_name != ALL(excluded_cities))
        AND (allowed_districts IS NULL OR district_name = ANY(allowed_districts))
        AND (excluded_districts IS NULL OR district_name != ALL(excluded_districts))
        ORDER BY priority DESC, base_rate ASC
        LIMIT 1
    LOOP
        -- Free shipping kontrolü
        IF rate_record.free_shipping_threshold IS NOT NULL 
           AND order_amount >= rate_record.free_shipping_threshold THEN
            RETURN 0;
        END IF;
        
        -- Kargo ücretini hesapla
        shipping_cost := rate_record.base_rate + (package_weight * rate_record.rate_per_kg);
        RETURN shipping_cost;
    END LOOP;
    
    -- Uygun rate bulunamadıysa default ücret
    RETURN 25.00; -- Default shipping cost
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Shipping address ekle
CREATE OR REPLACE FUNCTION add_shipping_address(
    customer_uuid UUID,
    address_title TEXT,
    address_data JSONB
)
RETURNS TABLE(
    id UUID,
    customer_id UUID,
    title TEXT,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    district TEXT,
    postal_code TEXT,
    is_default BOOLEAN,
    created_at TIMESTAMPTZ
) AS $$
DECLARE
    address_id UUID;
    tenant_uuid UUID;
    new_address RECORD;
BEGIN
    -- Customer bilgilerini al
    SELECT tenant_id INTO tenant_uuid
    FROM profiles 
    WHERE id = customer_uuid;
    
    IF tenant_uuid IS NULL THEN
        RAISE EXCEPTION 'Customer not found';
    END IF;
    
    -- Eğer default olarak işaretleniyorsa, diğerlerini false yap
    IF COALESCE((address_data->>'is_default')::boolean, false) = true THEN
        UPDATE shipping_addresses 
        SET is_default = false 
        WHERE customer_id = customer_uuid AND is_active = true;
    END IF;
    
    -- Address oluştur
    INSERT INTO shipping_addresses (
        customer_id, tenant_id, title, full_name, phone,
        address, city, district, postal_code, country,
        address_type, is_default, notes, is_active
    )
    VALUES (
        customer_uuid, tenant_uuid, address_title,
        COALESCE(address_data->>'full_name', address_data->>'fullName'),
        address_data->>'phone',
        COALESCE(address_data->>'address', ''),
        COALESCE(address_data->>'city', ''),
        COALESCE(address_data->>'district', ''),
        COALESCE(address_data->>'postal_code', address_data->>'postalCode', ''),
        COALESCE(address_data->>'country', 'Turkey'),
        COALESCE(address_data->>'address_type', 'home'),
        COALESCE((address_data->>'is_default')::boolean, (address_data->>'isDefault')::boolean, false),
        address_data->>'notes',
        true
    )
    RETURNING * INTO new_address;
    
    -- Return full address record
    RETURN QUERY SELECT 
        new_address.id,
        new_address.customer_id,
        new_address.title,
        new_address.full_name,
        new_address.phone,
        new_address.address,
        new_address.city,
        new_address.district,
        new_address.postal_code,
        new_address.is_default,
        new_address.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. VIEWS
-- Shipment detayları view'ı
CREATE VIEW shipment_details AS
SELECT 
    s.id,
    s.order_id,
    s.tracking_number,
    s.provider,
    s.status,
    s.shipping_method,
    s.shipping_cost,
    s.estimated_delivery_date,
    s.actual_delivery_date,
    s.created_at,
    o.total_amount as order_total,
    pr.full_name as customer_name,
    pr.email as customer_email
FROM shipments s
JOIN orders o ON s.order_id = o.id
JOIN profiles pr ON o.customer_id = pr.id;

-- 9. SAMPLE DATA (Test için)
-- Sample shipping rates
INSERT INTO shipping_rates (tenant_id, name, provider, shipping_method, base_rate, rate_per_kg, free_shipping_threshold, priority)
VALUES 
('00000000-0000-0000-0000-000000000001', 'Standard Shipping', 'yurtici', 'standard', 15.00, 2.00, 200.00, 1),
('00000000-0000-0000-0000-000000000001', 'Express Delivery', 'yurtici', 'express', 25.00, 3.00, 300.00, 2),
('00000000-0000-0000-0000-000000000001', 'Overnight', 'aras', 'overnight', 35.00, 4.00, 500.00, 3);

-- ============================================
-- SHIPPING SYSTEM EKLENDİ!
-- ============================================
-- shipments, shipping_rates, shipping_addresses tabloları oluşturuldu
-- RLS politikaları ayarlandı
-- Helper fonksiyonlar eklendi
-- Views oluşturuldu
-- ============================================





