# 🎯 Admin Panel Kurulum Rehberi

## ✨ Ne Yaptık?

Çok rollü (multi-role) bir admin paneli sistemi kurduk:

- **👤 Customer (Müşteri)** - Alışveriş yapan kullanıcılar
- **🏪 Seller (Satıcı)** - Ürün/Restoran ekleyip yöneten satıcılar
- **👨‍💼 Admin (Yönetici)** - Her şeyi yöneten site yöneticileri

---

## 📁 Oluşturulan Dosyalar

```
✅ lib/supabase.ts                    # Supabase client & types
✅ supabase-schema.sql                # Veritabanı şeması (SQL)
✅ src/app/admin/layout.tsx           # Admin panel layout
✅ src/app/admin/page.tsx             # Dashboard (Ana sayfa)
✅ src/app/admin/products/page.tsx    # Ürün yönetimi
✅ src/app/admin/orders/page.tsx      # Sipariş yönetimi
```

---

## 🚀 Kurulum Adımları

### 1. Supabase Hesabı Oluştur (5 dakika)

1. [https://supabase.com](https://supabase.com) → **Sign Up**
2. **GitHub** ile giriş yap (önerilen)
3. **New Project** → Proje adı ver
4. **Database Password** belirle (güçlü bir şifre)
5. **Region** seç: **Frankfurt** (Türkiye'ye en yakın)
6. **Create Project** → 1-2 dakika bekle

### 2. Database Şemasını Yükle (2 dakika)

1. Supabase Dashboard → **SQL Editor**
2. `supabase-schema.sql` dosyasını aç
3. İçeriği kopyala → SQL Editor'e yapıştır
4. **RUN** butonuna tıkla
5. ✅ "Success" mesajını gör

### 3. API Anahtarlarını Al

1. Supabase Dashboard → **Settings** → **API**
2. Şu iki değeri kopyala:
   - `Project URL` (Örnek: https://xxxxx.supabase.co)
   - `anon public` key (Başı: eyJhbGc...)

### 4. Environment Variables Ekle

Proje kökünde `.env.local` dosyası oluştur:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Önemli:** `.env.local` dosyası git'e commitlemeyin!

### 5. Projeyi Çalıştır

```bash
npm run dev
```

Admin panele git: **http://localhost:3000/admin**

---

## 🎨 Admin Panel Özellikleri

### 📊 Dashboard (Ana Sayfa)

- Toplam gelir, sipariş, ürün, müşteri istatistikleri
- Satış grafiği (placeholder)
- En çok satan ürünler
- Son siparişler tablosu

### 📦 Ürün Yönetimi

- Ürün listesi (tablo görünümü)
- Arama ve kategori filtresi
- Ürün ekleme modal'ı
- Ürün düzenleme/silme
- Aktif/Pasif durumu değiştirme
- Stok takibi

### 🛒 Sipariş Yönetimi

- Sipariş listesi (tüm detaylarla)
- Durum bazlı filtreleme
- Sipariş detay modal'ı
- Sipariş durumu güncelleme:
  - Bekliyor
  - Onaylandı
  - Hazırlanıyor
  - Teslimatta
  - Tamamlandı
  - İptal
- Müşteri bilgileri görüntüleme

---

## 📚 Database Şeması

### Tablolar:

1. **profiles** - Kullanıcı profilleri (role bazlı)
2. **categories** - Ürün kategorileri
3. **products** - Ürünler (satıcıya bağlı)
4. **restaurants** - Restoranlar (satıcıya bağlı)
5. **menu_items** - Restoran menü öğeleri
6. **orders** - Siparişler
7. **reviews** - Ürün/Restoran yorumları

### Güvenlik (Row Level Security):

✅ Kullanıcılar sadece kendi verilerini görebilir
✅ Satıcılar sadece kendi ürün/siparişlerini yönetebilir
✅ Admin'ler her şeyi görebilir ve yönetebilir

---

## 🔐 Roller ve İzinler

### Customer (Müşteri)

- ✅ Ürünleri görüntüleme
- ✅ Sepete ekleme ve sipariş verme
- ✅ Kendi siparişlerini görme
- ✅ Yorum yazma
- ❌ Admin panel erişimi yok

### Seller (Satıcı)

- ✅ Tüm Customer yetkileri
- ✅ Ürün ekleme/düzenleme/silme
- ✅ Restoran ekleme/yönetme
- ✅ Kendi siparişlerini yönetme
- ✅ Admin panel erişimi (kısıtlı)
- ❌ Diğer satıcıların verilerini göremez

### Admin (Yönetici)

- ✅ Her şey!
- ✅ Tüm ürünleri yönetme
- ✅ Tüm siparişleri görme
- ✅ Kullanıcıları yönetme
- ✅ İstatistikleri görme
- ✅ Full admin panel erişimi

---

## 🔄 Sonraki Adımlar

### Kısa Vadeli (1-2 hafta):

- [ ] Authentication sistemi entegrasyonu
- [ ] Gerçek API çağrıları (şu an mock data)
- [ ] Resim upload sistemi
- [ ] Restoran yönetimi sayfası
- [ ] Müşteri yönetimi sayfası
- [ ] İnceleme yönetimi

### Orta Vadeli (2-4 hafta):

- [ ] Email bildirimleri
- [ ] SMS entegrasyonu
- [ ] Excel/PDF export
- [ ] Gelişmiş raporlama
- [ ] Satıcı onay sistemi
- [ ] Komisyon yönetimi

### Uzun Vadeli (1-3 ay):

- [ ] Canlı harita entegrasyonu
- [ ] Kurye yönetimi
- [ ] Mobil uygulama API'si
- [ ] WhatsApp entegrasyonu
- [ ] Çoklu dil desteği
- [ ] Analytics & BI dashboard

---

## 🎓 Kullanım Örnekleri

### Yeni Ürün Ekleme:

```typescript
// lib/supabase.ts kullanarak
import { supabase } from "@/lib/supabase";

const { data, error } = await supabase.from("products").insert([
  {
    title: "Yeni Ürün",
    price: 99.9,
    category: "Elektronik",
    seller_id: userId,
    stock: 100,
  },
]);
```

### Siparişleri Getirme:

```typescript
// Satıcının kendi siparişleri
const { data } = await supabase
  .from("orders")
  .select("*")
  .eq("seller_id", userId)
  .order("created_at", { ascending: false });
```

### Sipariş Durumu Güncelleme:

```typescript
const { error } = await supabase
  .from("orders")
  .update({ status: "delivering" })
  .eq("id", orderId);
```

---

## 💡 İpuçları

1. **Testing:**

   - SQL Editor'de manual olarak test kullanıcıları oluşturun
   - Farklı rollerle test edin

2. **Güvenlik:**

   - `.env.local` dosyasını asla commit'lemeyin
   - Production'da environment variables kullanın

3. **Performance:**

   - Supabase ücretsiz plan: 500MB DB, 1GB storage
   - Gerçek kullanımda cache stratejisi düşünün

4. **Development:**
   - Supabase Studio'da real-time veri değişikliklerini görün
   - Table Editor'de manuel düzenleme yapabilirsiniz

---

## 🐛 Sorun Giderme

### Supabase bağlantı hatası:

- `.env.local` dosyasının doğru yerde olduğunu kontrol edin
- Environment variables'ların doğru olduğunu kontrol edin
- Dev server'ı yeniden başlatın

### SQL hatası:

- Schema'yı adım adım yükleyin
- Her section'ı ayrı ayrı çalıştırın
- Hata mesajını okuyun (genelde hangi satırda olduğunu gösterir)

### Permission hatası:

- RLS (Row Level Security) policies'i kontrol edin
- Kullanıcı rolünü kontrol edin
- Supabase Auth'un doğru çalıştığından emin olun

---

## 📞 Destek

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Discord:** Supabase Discord Community

---

## 🎉 Tebrikler!

Artık full-featured bir admin paneliniz var!

**Yapabilecekleriniz:**

- ✅ Ürün ekleme/düzenleme
- ✅ Sipariş yönetimi
- ✅ İstatistik görüntüleme
- ✅ Çok rollü kullanıcı sistemi
- ✅ Güvenli veritabanı

**Şimdi ne yapmalı:**

1. Supabase'i kur (yukarıdaki adımları takip et)
2. Admin paneli test et
3. Gerçek verilerle çalışmaya başla
4. Authentication ekle
5. Deploy et (Vercel öneriyoruz)

---

Başarılar! 🚀


















