# 🚀 KEP Marketplace - Kurulum Rehberi

## 📋 **Mevcut Durum Özeti**

✅ **Tamamlanan Bileşenler:**

- Supabase projesi kurulumu
- Temel database şeması (profiles, categories, products, restaurants, menu_items, orders, reviews)
- RLS politikaları
- Edge Functions (process-order, send-notification, generate-analytics)
- API service layer
- Frontend temel yapısı

✅ **Yeni Eklenen Bileşenler:**

- Multi-tenant support (tenant_id kolonları)
- Cart system (carts, cart_items tabloları)
- Payment system (payments, payment_methods, refunds tabloları)
- Shipping system (shipments, shipping_rates, shipping_addresses tabloları)
- Storage buckets konfigürasyonu
- Payment webhook Edge Function
- Güncellenmiş API service

---

## 🎯 **Kurulum Adımları**

### **1. Database Setup (5 dakika)**

```bash
# Supabase Dashboard > SQL Editor'e git
# complete-database-setup.sql dosyasını çalıştır
```

**Dosya:** `complete-database-setup.sql`

Bu script şunları yapar:

- ✅ Multi-tenant support ekler
- ✅ Cart system oluşturur
- ✅ Payment system oluşturur
- ✅ Shipping system oluşturur
- ✅ RLS politikalarını günceller
- ✅ Helper fonksiyonları ekler
- ✅ Indexleri oluşturur (CONCURRENTLY olmadan)
- ✅ Trigger'ları ekler
- ✅ Sample data ekler

### **1.1. Production Indexes (Opsiyonel - 2 dakika)**

Production ortamında daha güvenli index oluşturmak için:

```bash
# Supabase CLI ile (transaction bloğu dışında)
supabase db reset
# veya
psql -h your-db-host -U postgres -d postgres -f create-indexes-concurrently.sql
```

**Dosya:** `create-indexes-concurrently.sql`

Bu script production'da güvenli şekilde `CONCURRENTLY` ile index oluşturur.

### **2. Storage Buckets Setup (2 dakika)**

```bash
# Supabase Dashboard > Storage > New Bucket
```

**Oluşturulacak Buckets:**

- `products` (public, 5MB limit, image files)
- `avatars` (public, 2MB limit, image files)
- `documents` (private, 10MB limit, PDF/DOC files)
- `temp` (private, 5MB limit, temporary files)

### **3. Edge Functions Deploy (3 dakika)**

```bash
# Terminal'de proje kök dizininde
supabase functions deploy process-order
supabase functions deploy send-notification
supabase functions deploy generate-analytics
supabase functions deploy webhooks/payment
```

### **4. Environment Variables (1 dakika)**

`.env.local` dosyasına ekle:

```bash
# Payment Providers
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
IYZICO_API_KEY=your_iyzico_key
IYZICO_SECRET_KEY=your_iyzico_secret
IYZICO_WEBHOOK_SECRET=your_iyzico_webhook_secret
PAYTR_MERCHANT_ID=your_paytr_merchant_id
PAYTR_MERCHANT_KEY=your_paytr_key
PAYTR_MERCHANT_SALT=your_paytr_salt

# Shipping Providers
YURTICI_API_KEY=your_yurtici_key
ARAS_API_KEY=your_aras_key

# Email Service
RESEND_API_KEY=your_resend_key
```

### **5. Test Setup (2 dakika)**

```bash
# Supabase Dashboard > SQL Editor
# test-database-setup.sql dosyasını çalıştır
```

Bu script tüm bileşenlerin doğru çalıştığını test eder.

---

## 🔧 **Yeni Özellikler**

### **Multi-Tenant Support**

- Tüm tablolarda `tenant_id` kolonu
- Tenant izolasyonu RLS ile
- Helper fonksiyonlar: `auth_tenant()`, `auth_role()`, `auth_user_id()`

### **Cart System**

- `carts` ve `cart_items` tabloları
- Guest ve authenticated cart desteği
- Helper fonksiyonlar: `get_or_create_cart()`, `add_to_cart()`, `remove_from_cart()`

### **Payment System**

- `payments`, `payment_methods`, `refunds` tabloları
- Stripe, İyzico, PayTR desteği
- Webhook işleyicileri
- Helper fonksiyonlar: `create_payment()`, `update_payment_status()`

### **Shipping System**

- `shipments`, `shipping_rates`, `shipping_addresses` tabloları
- Yurtiçi, Aras, MNG, PTT desteği
- Kargo takibi ve ücret hesaplama
- Helper fonksiyonlar: `create_shipment()`, `calculate_shipping_cost()`

### **Storage System**

- 4 farklı bucket (products, avatars, documents, temp)
- RLS politikaları ile güvenlik
- Signed URL desteği

---

## 📊 **API Service Güncellemeleri**

### **Yeni Methods:**

```typescript
// Cart API
ApiService.getCart(customerId?, sessionId?)
ApiService.addToCart(cartId, productId?, menuItemId?, quantity, notes?)
ApiService.removeFromCart(cartId, itemId)
ApiService.getCartItems(cartId)
ApiService.clearCart(cartId)

// Payment API
ApiService.createPayment(orderId, provider, amount, currency?, sessionId?)
ApiService.getPayments(orderId?, customerId?)
ApiService.getPaymentMethods(customerId)
ApiService.addPaymentMethod(customerId, provider, methodId, type, details)

// Shipping API
ApiService.createShipment(orderId, provider, method?, trackingNumber?)
ApiService.getShipments(orderId?)
ApiService.updateShipmentStatus(shipmentId, status, notes?)
ApiService.calculateShippingCost(tenantId, orderAmount, weight?, city?, district?)
ApiService.getShippingRates(tenantId)

// Shipping Addresses API
ApiService.getShippingAddresses(customerId)
ApiService.addShippingAddress(customerId, title, addressData)
ApiService.updateShippingAddress(addressId, updates)
ApiService.deleteShippingAddress(addressId)

// Multi-tenant API
ApiService.getTenants()
ApiService.getCurrentTenant()
```

---

## 🧪 **Test Senaryoları**

### **1. Cart System Test**

```typescript
// Cart oluştur
const cartId = await ApiService.getCart(customerId);

// Ürün ekle
await ApiService.addToCart(cartId, productId, null, 2, 'Notlar');

// Sepet içeriğini getir
const items = await ApiService.getCartItems(cartId);

// Ürün çıkar
await ApiService.removeFromCart(cartId, itemId);
```

### **2. Payment System Test**

```typescript
// Payment oluştur
const paymentId = await ApiService.createPayment(orderId, 'stripe', 100.0, 'TRY');

// Payment method ekle
await ApiService.addPaymentMethod(customerId, 'stripe', 'pm_123', 'card', {
  card_brand: 'visa',
  card_last4: '4242',
});

// Payment'ları getir
const payments = await ApiService.getPayments(orderId);
```

### **3. Shipping System Test**

```typescript
// Shipment oluştur
const shipmentId = await ApiService.createShipment(orderId, 'yurtici', 'standard');

// Kargo ücreti hesapla
const cost = await ApiService.calculateShippingCost(tenantId, 150.0, 1.5, 'Istanbul', 'Kadikoy');

// Shipping address ekle
await ApiService.addShippingAddress(customerId, 'Ev', {
  full_name: 'John Doe',
  phone: '+905551234567',
  address: 'Test Mahallesi, Test Sokak No:1',
  city: 'Istanbul',
  district: 'Kadikoy',
});
```

---

## 🚨 **Önemli Notlar**

### **Güvenlik**

- Tüm tablolarda RLS aktif
- Multi-tenant izolasyonu sağlandı
- Payment webhook'ları signature doğrulaması yapıyor
- Storage bucket'ları güvenli politikalar ile korunuyor

### **Performans**

- Tüm kritik kolonlarda indexler oluşturuldu
- RLS politikaları optimize edildi
- Helper fonksiyonlar `SECURITY DEFINER` ile güvenli

### **Ölçeklenebilirlik**

- Multi-tenant yapı ile çoklu şirket desteği
- Partitioning için hazır yapı
- Edge Functions ile serverless backend

---

## 📞 **Destek**

### **Sorun Giderme**

1. `test-database-setup.sql` çalıştır
2. Hata loglarını kontrol et
3. RLS politikalarını doğrula
4. Edge Functions loglarını incele

### **İletişim**

- **Teknik Destek**: Development Team
- **Supabase Docs**: https://supabase.com/docs
- **Community**: https://github.com/supabase/supabase/discussions

---

## 🎉 **Kurulum Tamamlandı!**

Artık KEP Marketplace tam özellikli bir e-ticaret platformu olarak çalışmaya hazır:

✅ **Multi-tenant marketplace**
✅ **Cart & Checkout system**
✅ **Payment processing**
✅ **Shipping & Tracking**
✅ **File storage**
✅ **Real-time updates**
✅ **Admin panel ready**
✅ **Mobile responsive**

**Sonraki adım:** Frontend geliştirme ve admin panel implementasyonu!
