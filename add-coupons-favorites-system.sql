-- ============================================
-- COUPONS & FAVORITES SYSTEM
-- İndirim kuponları ve favori ürünler için tablolar
-- ============================================

-- 1. COUPONS (İndirim Kuponları) Tablosu
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL CHECK (discount_value > 0),
    minimum_purchase DECIMAL(10, 2) DEFAULT 0,
    maximum_discount DECIMAL(10, 2),
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. USER_COUPONS (Kullanıcı Kuponları) Tablosu
CREATE TABLE IF NOT EXISTS user_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, coupon_id)
);

-- 3. FAVORITES (Favori Ürünler) Tablosu
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_tenant ON coupons(tenant_id);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active, valid_from, valid_until);

CREATE INDEX IF NOT EXISTS idx_user_coupons_user ON user_coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_coupons_coupon ON user_coupons(coupon_id);
CREATE INDEX IF NOT EXISTS idx_user_coupons_used ON user_coupons(used_at);

CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product ON favorites(product_id);

-- 5. RLS Policies for Coupons
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coupons are viewable by everyone"
    ON coupons FOR SELECT
    USING (true);

-- 6. RLS Policies for User Coupons
ALTER TABLE user_coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own coupons"
    ON user_coupons FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can claim coupons"
    ON user_coupons FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coupon usage"
    ON user_coupons FOR UPDATE
    USING (auth.uid() = user_id);

-- 7. RLS Policies for Favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
    ON favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
    ON favorites FOR DELETE
    USING (auth.uid() = user_id);

-- 8. Helper Function: Validate Coupon
CREATE OR REPLACE FUNCTION validate_coupon(
    p_code VARCHAR(50),
    p_user_id UUID,
    p_amount DECIMAL(10, 2)
)
RETURNS TABLE (
    valid BOOLEAN,
    discount_amount DECIMAL(10, 2),
    message TEXT,
    coupon_id UUID
) AS $$
DECLARE
    v_coupon coupons%ROWTYPE;
    v_user_coupon_count INTEGER;
    v_discount_amount DECIMAL(10, 2);
BEGIN
    -- Get coupon
    SELECT * INTO v_coupon
    FROM coupons
    WHERE code = p_code
      AND is_active = true
      AND (valid_until IS NULL OR valid_until > NOW())
      AND valid_from <= NOW();

    -- Check if coupon exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Kupon bulunamadı veya geçersiz'::TEXT, NULL::UUID;
        RETURN;
    END IF;

    -- Check minimum purchase
    IF p_amount < COALESCE(v_coupon.minimum_purchase, 0) THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 
            FORMAT('Bu kupon en az %s TL tutarında alışveriş için geçerlidir', v_coupon.minimum_purchase)::TEXT,
            v_coupon.id;
        RETURN;
    END IF;

    -- Check if user already used this coupon
    SELECT COUNT(*) INTO v_user_coupon_count
    FROM user_coupons
    WHERE user_id = p_user_id
      AND coupon_id = v_coupon.id
      AND used_at IS NOT NULL;

    IF v_user_coupon_count > 0 THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Bu kuponu daha önce kullandınız'::TEXT, v_coupon.id;
        RETURN;
    END IF;

    -- Check usage limit
    IF v_coupon.usage_limit IS NOT NULL AND v_coupon.usage_count >= v_coupon.usage_limit THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Bu kuponun kullanım limiti dolmuş'::TEXT, v_coupon.id;
        RETURN;
    END IF;

    -- Calculate discount
    IF v_coupon.discount_type = 'percentage' THEN
        v_discount_amount := (p_amount * v_coupon.discount_value) / 100;
        IF v_coupon.maximum_discount IS NOT NULL AND v_discount_amount > v_coupon.maximum_discount THEN
            v_discount_amount := v_coupon.maximum_discount;
        END IF;
    ELSE
        v_discount_amount := LEAST(v_coupon.discount_value, p_amount);
    END IF;

    RETURN QUERY SELECT true, v_discount_amount, 'Kupon geçerli'::TEXT, v_coupon.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Helper Function: Claim Coupon
CREATE OR REPLACE FUNCTION claim_coupon(
    p_code VARCHAR(50),
    p_user_id UUID
)
RETURNS TABLE (
    success BOOLEAN,
    message TEXT,
    coupon_id UUID
) AS $$
DECLARE
    v_coupon_id UUID;
BEGIN
    -- Validate coupon
    SELECT coupon_id INTO v_coupon_id
    FROM validate_coupon(p_code, p_user_id, 0)
    WHERE valid = true;

    IF v_coupon_id IS NULL THEN
        RETURN QUERY SELECT false, 'Kupon geçersiz'::TEXT, NULL::UUID;
        RETURN;
    END IF;

    -- Check if already claimed
    IF EXISTS (
        SELECT 1 FROM user_coupons
        WHERE user_id = p_user_id AND coupon_id = v_coupon_id
    ) THEN
        RETURN QUERY SELECT false, 'Bu kuponu zaten aldınız'::TEXT, v_coupon_id;
        RETURN;
    END IF;

    -- Claim coupon
    INSERT INTO user_coupons (user_id, coupon_id)
    VALUES (p_user_id, v_coupon_id)
    ON CONFLICT (user_id, coupon_id) DO NOTHING;

    RETURN QUERY SELECT true, 'Kupon başarıyla eklendi'::TEXT, v_coupon_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Sample Coupons (Optional - Test için)
INSERT INTO coupons (code, title, description, discount_type, discount_value, minimum_purchase, valid_until) VALUES
('HOSGELDIN10', 'Hoş Geldin %10 İndirim', 'İlk alışverişinizde %10 indirim', 'percentage', 10, 100, NOW() + INTERVAL '30 days'),
('MILLI2024', 'Milli Bayram Özel', '500 TL ve üzeri alışverişlerde 50 TL indirim', 'fixed', 50, 500, NOW() + INTERVAL '60 days'),
('YENI2024', 'Yeni Yıl Kampanyası', 'Tüm ürünlerde %20 indirim', 'percentage', 20, 200, NOW() + INTERVAL '90 days')
ON CONFLICT (code) DO NOTHING;

-- ============================================
-- SQL SCRIPT BAŞARIYLA TAMAMLANDI!
-- ============================================

