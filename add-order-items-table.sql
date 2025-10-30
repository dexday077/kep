-- ============================================
-- ORDER_ITEMS TABLOSU EKLEME
-- Daha normalize edilmiş sipariş yapısı için
-- ============================================

-- Order items tablosu oluştur
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS politikaları
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_tenant_isolation" ON order_items 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

CREATE POLICY "order_items_customer_access" ON order_items 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.customer_id = (SELECT auth.uid())
        ) OR
        auth_role() = 'admin'
    );

CREATE POLICY "order_items_seller_access" ON order_items 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND orders.seller_id = (SELECT auth.uid())
        ) OR
        auth_role() = 'admin'
    );

-- Indexler
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_tenant_id ON order_items(tenant_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- Trigger
CREATE TRIGGER update_order_items_updated_at 
    BEFORE UPDATE ON order_items
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- ORDER_ITEMS TABLOSU EKLENDİ!
-- ============================================
-- Artık hem orders.items (jsonb) hem de order_items tablosu var
-- Function'lar istediği yapıyı kullanabilir
-- ============================================









