# 🚀 Supabase Kurulum Talimatları

## 📋 **Adım 1: Supabase Dashboard'a Git**

1. [Supabase Dashboard](https://supabase.com/dashboard) aç
2. Projenizi seçin: `dvhvdimqdurafisszswk`
3. Sol menüden **SQL Editor**'a tıkla

## 📋 **Adım 2: Database Schema'yı Çalıştır**

### **2.1 Temel Schema (İlk önce bunu çalıştır)**

```sql
-- supabase-schema.sql dosyasının içeriğini kopyala ve çalıştır
```

### **2.2 Complete Database Setup (Ana script)**

```sql
-- complete-database-setup.sql dosyasının içeriğini kopyala ve çalıştır
```

## 📋 **Adım 3: Storage Buckets Oluştur**

1. Sol menüden **Storage**'a git
2. **New Bucket** butonuna tıkla
3. Şu bucket'ları oluştur:

### **Bucket 1: products**

- Name: `products`
- Public: ✅ (Evet)
- File size limit: `5MB`
- Allowed MIME types: `image/*`

### **Bucket 2: avatars**

- Name: `avatars`
- Public: ✅ (Evet)
- File size limit: `2MB`
- Allowed MIME types: `image/*`

### **Bucket 3: documents**

- Name: `documents`
- Public: ❌ (Hayır)
- File size limit: `10MB`
- Allowed MIME types: `application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### **Bucket 4: temp**

- Name: `temp`
- Public: ❌ (Hayır)
- File size limit: `5MB`
- Allowed MIME types: `*/*`

## 📋 **Adım 4: Edge Functions Deploy**

### **4.1 Supabase CLI Kurulumu**

```bash
npm install -g supabase
```

### **4.2 Projeyi Link Et**

```bash
supabase link --project-ref dvhvdimqdurafisszswk
```

### **4.3 Functions Deploy**

```bash
supabase functions deploy process-order
supabase functions deploy send-notification
supabase functions deploy generate-analytics
supabase functions deploy webhooks/payment
```

## 📋 **Adım 5: Test Verilerini Ekle**

SQL Editor'da şu script'i çalıştır:

```sql
-- Test tenant ekle
INSERT INTO tenants (id, name, slug, settings) VALUES
('00000000-0000-0000-0000-000000000001', 'KEP Marketplace', 'kep-marketplace', '{"theme": "orange", "currency": "TRY"}');

-- Test kategoriler ekle
INSERT INTO categories (name, slug, description, icon, tenant_id) VALUES
('Elektronik', 'elektronik', 'Bilgisayar, telefon ve elektronik ürünler', '💻', '00000000-0000-0000-0000-000000000001'),
('Moda', 'moda', 'Giyim, ayakkabı ve aksesuar', '👔', '00000000-0000-0000-0000-000000000001'),
('Ev & Yaşam', 'ev-yasam', 'Mobilya, dekorasyon ve ev eşyaları', '🏠', '00000000-0000-0000-0000-000000000001'),
('Spor', 'spor', 'Spor malzemeleri ve fitness ürünleri', '⚽', '00000000-0000-0000-0000-000000000001');

-- Test ürünler ekle
INSERT INTO products (title, description, price, original_price, category, image, stock, seller_id, tenant_id) VALUES
('Kablosuz Kulaklık Pro X', 'Yüksek kaliteli kablosuz kulaklık', 1899.00, 2499.00, 'Elektronik', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 50, (SELECT id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000001'),
('Akıllı Saat S3', 'Fitness ve sağlık takibi için akıllı saat', 2399.00, 2999.00, 'Elektronik', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 30, (SELECT id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000001'),
('Bluetooth Hoparlör Mini', 'Taşınabilir bluetooth hoparlör', 749.00, NULL, 'Elektronik', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', 75, (SELECT id FROM profiles LIMIT 1), '00000000-0000-0000-0000-000000000001');
```

## 📋 **Adım 6: Bağlantıyı Test Et**

1. Projeyi çalıştır: `npm run dev`
2. [http://localhost:3000](http://localhost:3000) aç
3. Console'da hata olup olmadığını kontrol et
4. Admin paneline git: [http://localhost:3000/admin](http://localhost:3000/admin)

## ✅ **Kurulum Tamamlandı!**

Artık Supabase entegrasyonu çalışıyor olmalı. Gerçek verilerle admin paneli kullanabilirsiniz.

---

## 🚨 **Sorun Giderme**

### **Hata: "Table doesn't exist"**

- `supabase-schema.sql` dosyasını önce çalıştırın
- Sonra `complete-database-setup.sql` dosyasını çalıştırın

### **Hata: "Permission denied"**

- RLS politikalarını kontrol edin
- `secure-rls-policies.sql` dosyasını çalıştırın

### **Hata: "Function doesn't exist"**

- Edge Functions'ları deploy edin
- `supabase functions deploy` komutlarını çalıştırın

### **Bağlantı Hatası**

- Environment variables'ları kontrol edin
- Supabase URL ve key'in doğru olduğundan emin olun

