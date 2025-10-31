-- ============================================
-- NOTIFICATIONS TABLOSU EKLEME (CONCURRENTLY OLMADAN)
-- Supabase SQL Editor için uyumlu
-- ============================================

-- Notifications tablosu oluştur
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
    recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'push', 'in-app')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    send_error TEXT DEFAULT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS politikaları
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notifications_tenant_isolation" ON notifications 
    FOR ALL 
    USING (tenant_id = auth_tenant())
    WITH CHECK (tenant_id = auth_tenant());

CREATE POLICY "notifications_recipient_access" ON notifications 
    FOR ALL 
    USING (recipient_id = (SELECT auth.uid()))
    WITH CHECK (recipient_id = (SELECT auth.uid()));

CREATE POLICY "notifications_admin_access" ON notifications 
    FOR ALL 
    USING (auth_role() = 'admin');

-- Indexler (CONCURRENTLY olmadan)
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_id ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id ON notifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Trigger
CREATE TRIGGER update_notifications_updated_at 
    BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- NOTIFICATIONS TABLOSU EKLENDİ!
-- ============================================










