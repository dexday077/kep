-- ============================================
-- UPDATE add_shipping_address FUNCTION
-- Sadece fonksiyonu günceller, tabloları etkilemez
-- ============================================

-- Önce mevcut fonksiyonu sil (varsa)
DROP FUNCTION IF EXISTS add_shipping_address(UUID, TEXT, JSONB);

-- Güncellenmiş fonksiyonu oluştur
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
    v_tenant_id UUID;
    v_addr_id UUID;
    v_customer_id UUID;
    v_title TEXT;
    v_full_name TEXT;
    v_phone TEXT;
    v_address TEXT;
    v_city TEXT;
    v_district TEXT;
    v_postal_code TEXT;
    v_is_default BOOLEAN;
    v_created_at TIMESTAMPTZ;
BEGIN
    -- Customer bilgilerini al
    SELECT p.tenant_id INTO v_tenant_id
    FROM profiles p
    WHERE p.id = customer_uuid;
    
    IF v_tenant_id IS NULL THEN
        RAISE EXCEPTION 'Customer not found';
    END IF;
    
    -- Eğer default olarak işaretleniyorsa, diğerlerini false yap
    IF COALESCE((address_data->>'is_default')::boolean, false) = true 
       OR COALESCE((address_data->>'isDefault')::boolean, false) = true THEN
        UPDATE shipping_addresses sa
        SET is_default = false 
        WHERE sa.customer_id = customer_uuid 
          AND sa.is_active = true;
    END IF;
    
    -- Address oluştur
    INSERT INTO shipping_addresses (
        customer_id, tenant_id, title, full_name, phone,
        address, city, district, postal_code, country,
        address_type, is_default, notes, is_active
    )
    VALUES (
        customer_uuid, v_tenant_id, address_title,
        COALESCE(address_data->>'full_name', address_data->>'fullName'),
        address_data->>'phone',
        COALESCE(address_data->>'address', ''),
        COALESCE(address_data->>'city', ''),
        COALESCE(address_data->>'district', ''),
        COALESCE(address_data->>'postal_code', address_data->>'postalCode', ''),
        COALESCE(address_data->>'country', 'Turkey'),
        COALESCE(address_data->>'address_type', 'home'),
        COALESCE(
            (address_data->>'is_default')::boolean, 
            (address_data->>'isDefault')::boolean, 
            false
        ),
        address_data->>'notes',
        true
    )
    RETURNING 
        shipping_addresses.id,
        shipping_addresses.customer_id,
        shipping_addresses.title,
        shipping_addresses.full_name,
        shipping_addresses.phone,
        shipping_addresses.address,
        shipping_addresses.city,
        shipping_addresses.district,
        shipping_addresses.postal_code,
        shipping_addresses.is_default,
        shipping_addresses.created_at
    INTO 
        v_addr_id,
        v_customer_id,
        v_title,
        v_full_name,
        v_phone,
        v_address,
        v_city,
        v_district,
        v_postal_code,
        v_is_default,
        v_created_at;
    
    -- Return full address record
    RETURN QUERY SELECT 
        v_addr_id,
        v_customer_id,
        v_title,
        v_full_name,
        v_phone,
        v_address,
        v_city,
        v_district,
        v_postal_code,
        v_is_default,
        v_created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- FONKSİYON GÜNCELLENDİ!
-- ============================================
