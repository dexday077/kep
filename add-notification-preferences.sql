-- ============================================
-- NOTIFICATION PREFERENCES FOR PROFILES TABLE
-- Bildirim tercihleri kolonlarını ekler
-- ============================================

-- 1. Bildirim tercihleri kolonlarını ekle (eğer yoksa)
DO $$
BEGIN
    -- Email notifications column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'email_notifications'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN email_notifications BOOLEAN DEFAULT true NOT NULL;
        
        COMMENT ON COLUMN profiles.email_notifications IS 'E-posta bildirimlerini almak istiyor mu?';
    END IF;

    -- SMS notifications column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'sms_notifications'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN sms_notifications BOOLEAN DEFAULT true NOT NULL;
        
        COMMENT ON COLUMN profiles.sms_notifications IS 'SMS bildirimlerini almak istiyor mu?';
    END IF;

    -- Marketing emails column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'marketing_emails'
    ) THEN
        ALTER TABLE profiles 
        ADD COLUMN marketing_emails BOOLEAN DEFAULT false NOT NULL;
        
        COMMENT ON COLUMN profiles.marketing_emails IS 'Pazarlama e-postalarını almak istiyor mu?';
    END IF;
END $$;

-- 2. Index oluştur (performans için)
CREATE INDEX IF NOT EXISTS idx_profiles_notification_prefs 
ON profiles(email_notifications, sms_notifications, marketing_emails);

-- 3. Mevcut kullanıcılara varsayılan değerleri ata
UPDATE profiles 
SET 
    email_notifications = COALESCE(email_notifications, true),
    sms_notifications = COALESCE(sms_notifications, true),
    marketing_emails = COALESCE(marketing_emails, false)
WHERE 
    email_notifications IS NULL 
    OR sms_notifications IS NULL 
    OR marketing_emails IS NULL;

-- ============================================
-- SQL SCRIPT BAŞARIYLA TAMAMLANDI!
-- ============================================

