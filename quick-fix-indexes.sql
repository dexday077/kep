-- ============================================
-- QUICK FIX: CREATE INDEXES WITHOUT CONCURRENTLY
-- Supabase SQL Editor'da çalıştırılabilir
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
CREATE INDEX IF NOT EXISTS idx_carts_status ON carts(status);
CREATE INDEX IF NOT EXISTS idx_carts_expires_at ON carts(expires_at);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_restaurant_id ON cart_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_menu_item_id ON cart_items(menu_item_id);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant_id ON payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_customer_id ON payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider ON payments(provider);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_provider_payment_id ON payments(provider_payment_id);

CREATE INDEX IF NOT EXISTS idx_payment_methods_customer_id ON payment_methods(customer_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_tenant_id ON payment_methods(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_provider ON payment_methods(provider);
CREATE INDEX IF NOT EXISTS idx_payment_methods_is_default ON payment_methods(is_default);

CREATE INDEX IF NOT EXISTS idx_refunds_payment_id ON refunds(payment_id);
CREATE INDEX IF NOT EXISTS idx_refunds_tenant_id ON refunds(tenant_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);

-- Shipping indexes
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tenant_id ON shipments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_provider ON shipments(provider);
CREATE INDEX IF NOT EXISTS idx_shipments_provider_shipment_id ON shipments(provider_shipment_id);

CREATE INDEX IF NOT EXISTS idx_shipping_rates_tenant_id ON shipping_rates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_provider ON shipping_rates(provider);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_is_active ON shipping_rates(is_active);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_priority ON shipping_rates(priority);

CREATE INDEX IF NOT EXISTS idx_shipping_addresses_customer_id ON shipping_addresses(customer_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_tenant_id ON shipping_addresses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shipping_addresses_is_default ON shipping_addresses(is_default);

-- ============================================
-- INDEXES CREATED SUCCESSFULLY!
-- ============================================
-- Bu script Supabase SQL Editor'da sorunsuz çalışır
-- CONCURRENTLY kullanmaz, transaction bloğu içinde çalışabilir
-- ============================================










