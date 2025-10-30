-- ============================================
-- PAYMENT SYSTEM EKLEME
-- Ödeme işlemleri için payments tablosu ve webhook functions
-- ============================================

-- 1. PAYMENTS TABLOSU
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Payment Provider Info
    provider TEXT NOT NULL CHECK (provider IN ('stripe', 'iyzico', 'paytr', 'manual')),
    provider_payment_id TEXT, -- Provider'dan gelen payment ID
    provider_session_id TEXT, -- Stripe session ID gibi
    
    -- Payment Details
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    currency TEXT DEFAULT 'TRY' CHECK (currency IN ('TRY', 'USD', 'EUR')),
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'succeeded', 'failed', 
        'cancelled', 'refunded', 'partially_refunded'
    )),
    
    -- Payment Method
    payment_method TEXT, -- 'card', 'bank_transfer', 'cash', etc.
    payment_method_details JSONB, -- Card last 4 digits, bank info, etc.
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    failure_reason TEXT,
    refund_reason TEXT,
    
    -- Timestamps
    paid_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. PAYMENT_METHODS TABLOSU (Kayıtlı ödeme yöntemleri)
CREATE TABLE payment_methods (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    
    -- Provider Info
    provider TEXT NOT NULL CHECK (provider IN ('stripe', 'iyzico', 'paytr')),
    provider_method_id TEXT NOT NULL, -- Provider'dan gelen method ID
    
    -- Method Details
    type TEXT NOT NULL CHECK (type IN ('card', 'bank_account', 'wallet')),
    is_default BOOLEAN DEFAULT false,
    
    -- Card Details (masked)
    card_brand TEXT, -- 'visa', 'mastercard', etc.
    card_last4 TEXT,
    card_exp_month INTEGER,
    card_exp_year INTEGER,
    
    -- Bank Details (masked)
    bank_name TEXT,
    bank_last4 TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. REFUNDS TABLOSU
CREATE TABLE refunds (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    
    -- Refund Details
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    reason TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed')),
    
    -- Provider Info
    provider_refund_id TEXT,
    failure_reason TEXT,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- 4. RLS POLICIES
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;

-- Payments policies
CREATE POLICY "payments_tenant_isolation" ON payments 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

CREATE POLICY "payments_customer_access" ON payments 
    FOR SELECT 
    USING (
        (SELECT auth.uid()) = customer_id OR
        auth_role() = 'admin'
    );

CREATE POLICY "payments_seller_access" ON payments 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = payments.order_id 
            AND orders.seller_id = (SELECT auth.uid())
        ) OR
        auth_role() = 'admin'
    );

-- Payment methods policies
CREATE POLICY "payment_methods_tenant_isolation" ON payment_methods 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

CREATE POLICY "payment_methods_own_access" ON payment_methods 
    FOR ALL 
    USING (
        (SELECT auth.uid()) = customer_id OR
        auth_role() = 'admin'
    )
    WITH CHECK (
        (SELECT auth.uid()) = customer_id OR
        auth_role() = 'admin'
    );

-- Refunds policies
CREATE POLICY "refunds_tenant_isolation" ON refunds 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

CREATE POLICY "refunds_admin_access" ON refunds 
    FOR ALL 
    USING (auth_role() = 'admin')
    WITH CHECK (auth_role() = 'admin');

-- 5. INDEXLER
CREATE INDEX CONCURRENTLY idx_payments_order_id ON payments(order_id);
CREATE INDEX CONCURRENTLY idx_payments_tenant_id ON payments(tenant_id);
CREATE INDEX CONCURRENTLY idx_payments_customer_id ON payments(customer_id);
CREATE INDEX CONCURRENTLY idx_payments_provider ON payments(provider);
CREATE INDEX CONCURRENTLY idx_payments_status ON payments(status);
CREATE INDEX CONCURRENTLY idx_payments_provider_payment_id ON payments(provider_payment_id);

CREATE INDEX CONCURRENTLY idx_payment_methods_customer_id ON payment_methods(customer_id);
CREATE INDEX CONCURRENTLY idx_payment_methods_tenant_id ON payment_methods(tenant_id);
CREATE INDEX CONCURRENTLY idx_payment_methods_provider ON payment_methods(provider);
CREATE INDEX CONCURRENTLY idx_payment_methods_is_default ON payment_methods(is_default);

CREATE INDEX CONCURRENTLY idx_refunds_payment_id ON refunds(payment_id);
CREATE INDEX CONCURRENTLY idx_refunds_tenant_id ON refunds(tenant_id);
CREATE INDEX CONCURRENTLY idx_refunds_status ON refunds(status);

-- 6. TRIGGERS
CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at 
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 7. HELPER FUNCTIONS

-- Payment oluştur
CREATE OR REPLACE FUNCTION create_payment(
    order_uuid UUID,
    provider_name TEXT,
    payment_amount DECIMAL(10, 2),
    payment_currency TEXT DEFAULT 'TRY',
    provider_session_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    payment_id UUID;
    customer_uuid UUID;
    tenant_uuid UUID;
BEGIN
    -- Order bilgilerini al
    SELECT customer_id, tenant_id 
    INTO customer_uuid, tenant_uuid
    FROM orders 
    WHERE id = order_uuid;
    
    IF customer_uuid IS NULL THEN
        RAISE EXCEPTION 'Order not found';
    END IF;
    
    -- Payment oluştur
    INSERT INTO payments (
        order_id, tenant_id, customer_id, provider, 
        amount, currency, provider_session_id
    )
    VALUES (
        order_uuid, tenant_uuid, customer_uuid, provider_name,
        payment_amount, payment_currency, provider_session_id
    )
    RETURNING id INTO payment_id;
    
    RETURN payment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Payment durumunu güncelle
CREATE OR REPLACE FUNCTION update_payment_status(
    payment_uuid UUID,
    new_status TEXT,
    provider_payment_id TEXT DEFAULT NULL,
    failure_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE payments 
    SET 
        status = new_status,
        provider_payment_id = COALESCE(provider_payment_id, payments.provider_payment_id),
        failure_reason = COALESCE(failure_reason, payments.failure_reason),
        paid_at = CASE WHEN new_status = 'succeeded' THEN NOW() ELSE paid_at END,
        failed_at = CASE WHEN new_status = 'failed' THEN NOW() ELSE failed_at END,
        updated_at = NOW()
    WHERE id = payment_uuid;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Refund oluştur
CREATE OR REPLACE FUNCTION create_refund(
    payment_uuid UUID,
    refund_amount DECIMAL(10, 2),
    refund_reason TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    refund_id UUID;
    tenant_uuid UUID;
BEGIN
    -- Payment bilgilerini al
    SELECT tenant_id INTO tenant_uuid
    FROM payments 
    WHERE id = payment_uuid;
    
    IF tenant_uuid IS NULL THEN
        RAISE EXCEPTION 'Payment not found';
    END IF;
    
    -- Refund oluştur
    INSERT INTO refunds (
        payment_id, tenant_id, amount, reason
    )
    VALUES (
        payment_uuid, tenant_uuid, refund_amount, refund_reason
    )
    RETURNING id INTO refund_id;
    
    RETURN refund_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Payment method ekle
CREATE OR REPLACE FUNCTION add_payment_method(
    customer_uuid UUID,
    provider_name TEXT,
    provider_method_id TEXT,
    method_type TEXT,
    method_details JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    method_id UUID;
    tenant_uuid UUID;
BEGIN
    -- Customer bilgilerini al
    SELECT tenant_id INTO tenant_uuid
    FROM profiles 
    WHERE id = customer_uuid;
    
    IF tenant_uuid IS NULL THEN
        RAISE EXCEPTION 'Customer not found';
    END IF;
    
    -- Eğer default olarak işaretleniyorsa, diğerlerini false yap
    IF (method_details->>'is_default')::boolean = true THEN
        UPDATE payment_methods 
        SET is_default = false 
        WHERE customer_id = customer_uuid;
    END IF;
    
    -- Payment method oluştur
    INSERT INTO payment_methods (
        customer_id, tenant_id, provider, provider_method_id,
        type, is_default, metadata
    )
    VALUES (
        customer_uuid, tenant_uuid, provider_name, provider_method_id,
        method_type, COALESCE((method_details->>'is_default')::boolean, false), method_details
    )
    RETURNING id INTO method_id;
    
    RETURN method_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. VIEWS
-- Payment detayları view'ı
CREATE VIEW payment_details AS
SELECT 
    p.id,
    p.order_id,
    p.customer_id,
    p.provider,
    p.amount,
    p.currency,
    p.status,
    p.payment_method,
    p.paid_at,
    p.failed_at,
    p.created_at,
    o.total_amount as order_total,
    pr.full_name as customer_name,
    pr.email as customer_email
FROM payments p
JOIN orders o ON p.order_id = o.id
JOIN profiles pr ON p.customer_id = pr.id;

-- 9. SAMPLE DATA (Test için)
-- Test payment method
INSERT INTO payment_methods (customer_id, tenant_id, provider, provider_method_id, type, is_default, metadata)
SELECT 
    id, 
    tenant_id, 
    'stripe', 
    'pm_test_1234567890', 
    'card', 
    true,
    '{"card_brand": "visa", "card_last4": "4242", "card_exp_month": 12, "card_exp_year": 2025}'::jsonb
FROM profiles 
WHERE role = 'customer' 
LIMIT 1;

-- ============================================
-- PAYMENT SYSTEM EKLENDİ!
-- ============================================
-- payments, payment_methods, refunds tabloları oluşturuldu
-- RLS politikaları ayarlandı
-- Helper fonksiyonlar eklendi
-- Views oluşturuldu
-- ============================================









