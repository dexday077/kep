# 🚀 Supabase Backend Rehberi - Kep Marketplace

Bu rehber, Supabase ile tam bir backend sistemi kurmanızı sağlar. Hosting'e ihtiyaç duymadan çalışır!

## 🎯 **Supabase Backend Özellikleri**

### ✅ **Zaten Mevcut**

- **Database**: PostgreSQL ile tam veritabanı
- **Authentication**: Kullanıcı girişi, kayıt, rol yönetimi
- **Real-time**: Canlı veri güncellemeleri
- **Storage**: Dosya yükleme ve depolama
- **Row Level Security**: Güvenli veri erişimi

### 🆕 **Eklenen Backend Özellikleri**

- **Edge Functions**: Serverless API endpoints
- **API Service**: Frontend-backend entegrasyonu
- **Order Processing**: Sipariş işleme sistemi
- **Notifications**: Bildirim sistemi
- **Analytics**: Satış analitikleri

## 📁 **Dosya Yapısı**

```
supabase/
├── functions/
│   ├── process-order/index.ts      # Sipariş işleme
│   ├── send-notification/index.ts  # Bildirim gönderme
│   └── generate-analytics/index.ts # Analitik oluşturma
└── migrations/                     # Veritabanı değişiklikleri

src/lib/
└── api.ts                         # API servis katmanı
```

## 🛠️ **Kurulum Adımları**

### 1. Supabase CLI Kurulumu

```bash
npm install -g supabase
```

### 2. Proje Başlatma

```bash
supabase init
supabase link --project-ref YOUR_PROJECT_ID
```

### 3. Edge Functions Deploy

```bash
supabase functions deploy process-order
supabase functions deploy send-notification
supabase functions deploy generate-analytics
```

### 4. Environment Variables

Supabase Dashboard > Settings > Edge Functions:

```
RESEND_API_KEY=your_email_api_key
```

## 🔧 **API Endpoints**

### **Products API**

```typescript
// Ürünleri getir
const products = await ApiService.getProducts({
  category: 'elektronik',
  minPrice: 100,
  maxPrice: 1000,
  search: 'kulaklık',
  sort: 'priceAsc',
});

// Ürün oluştur
const product = await ApiService.createProduct({
  title: 'Yeni Ürün',
  price: 299,
  category: 'elektronik',
  stock: 10,
  seller_id: userId,
});
```

### **Orders API**

```typescript
// Sipariş oluştur
const order = await ApiService.createOrder({
  customer_id: userId,
  seller_id: sellerId,
  items: cartItems,
  total_amount: 1500,
  delivery_address: 'Adres bilgisi',
});

// Siparişleri getir
const orders = await ApiService.getOrders(userId, 'customer');
```

### **Analytics API**

```typescript
// Satış analitikleri
const analytics = await ApiService.getAnalytics(userId, '30d');
```

## 📊 **Database Schema Güncellemeleri**

### Notifications Tablosu Ekle

```sql
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  recipient_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('email', 'push', 'sms')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policy
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR ALL
  USING ((select auth.uid()) = recipient_id);
```

## 🔐 **Güvenlik Özellikleri**

### **Row Level Security (RLS)**

- Kullanıcılar sadece kendi verilerine erişebilir
- Admin tüm verilere erişebilir
- Seller sadece kendi ürünlerini yönetebilir

### **API Güvenliği**

- JWT token tabanlı authentication
- CORS koruması
- Input validation
- Rate limiting

## 🚀 **Deployment**

### **Supabase Hosting**

- Database: Otomatik hosted
- Edge Functions: Serverless
- Storage: CDN ile hızlı erişim
- Real-time: WebSocket bağlantıları

### **Frontend Deployment**

```bash
# Vercel (Önerilen)
vercel --prod

# Netlify
netlify deploy --prod

# GitHub Pages
npm run build && npm run export
```

## 📈 **Performans Optimizasyonları**

### **Database**

- Index'ler otomatik optimize
- Connection pooling
- Query optimization

### **Edge Functions**

- Global CDN dağıtımı
- Otomatik scaling
- Cold start optimization

### **Caching**

- Supabase otomatik cache
- Browser cache headers
- CDN caching

## 🔄 **Real-time Özellikler**

```typescript
// Canlı sipariş takibi
const subscription = supabase
  .channel('orders')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'orders',
      filter: `seller_id=eq.${userId}`,
    },
    (payload) => {
      console.log('Sipariş güncellendi:', payload.new);
    },
  )
  .subscribe();
```

## 📱 **Mobile App Entegrasyonu**

Supabase React Native SDK ile mobile app:

```bash
npm install @supabase/supabase-js
```

## 🎯 **Sonraki Adımlar**

1. **Edge Functions Deploy**: `supabase functions deploy`
2. **API Integration**: Frontend'de `ApiService` kullan
3. **Real-time**: Canlı güncellemeler ekle
4. **Analytics**: Dashboard'da grafikler göster
5. **Notifications**: Email/SMS entegrasyonu

## 💰 **Maliyet**

- **Free Tier**: 50,000 MAU, 500MB DB, 1GB Storage
- **Pro**: $25/ay, 100,000 MAU, 8GB DB, 100GB Storage
- **Team**: $599/ay, 1M MAU, 100GB DB, 1TB Storage

## 🔗 **Faydalı Linkler**

- [Supabase Docs](https://supabase.com/docs)
- [Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Database Guide](https://supabase.com/docs/guides/database)
- [Auth Guide](https://supabase.com/docs/guides/auth)

---

**Sonuç**: Supabase ile tam bir backend sistemi kurabilir, hosting'e ihtiyaç duymadan production'a çıkarabilirsiniz! 🚀





