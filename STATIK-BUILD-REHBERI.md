# Statik Build Rehberi

## ✅ Çalışacak Özellikler

Bu proje statik build için uygun şekilde yapılandırılmış:

1. **Tüm sayfalar Client-Side**: Tüm sayfalar `'use client'` direktifi ile client-side rendering kullanıyor
2. **Supabase Client-Side**: Supabase bağlantıları client-side'da çalışıyor (`@supabase/supabase-js`)
3. **Dynamic Routes**: `[id]`, `[slug]` gibi dynamic routes client-side routing ile çalışır
4. **State Management**: Cart, Auth, Toast gibi tüm state yönetimi client-side'da çalışır
5. **Admin Koruması**: Admin route koruması `src/app/admin/layout.tsx` içinde client-side'da yapılıyor

## ⚠️ Dikkat Edilmesi Gerekenler

### 1. Middleware

`src/middleware.ts` dosyası statik build'de **çalışmayacak**. Ancak bu bir sorun değil çünkü:

- Admin route koruması zaten `src/app/admin/layout.tsx` içinde client-side'da yapılıyor
- Auth route redirect'leri sayfa içinde hallediliyor
- Middleware Next.js statik export'ta otomatik olarak görmezden gelinir

### 2. Image Optimization

Next.js Image Optimization statik export'ta çalışmaz. İki seçenek:

- `unoptimized: true` kullanın (önerilen)
- Veya görselleri harici bir CDN'den servis edin

## 🚀 Statik Build Alma Adımları

### 1. next.config.ts'yi Güncelleyin

```typescript
const nextConfig: NextConfig = {
  output: 'export', // Statik export aktif
  images: {
    unoptimized: true, // Image optimization'ı kapat
    // ... diğer ayarlar
  },
};
```

### 2. Build Komutu

```bash
npm run build
```

Bu komut `out/` klasöründe statik dosyaları oluşturur.

### 3. Test Etme

```bash
# Statik dosyaları servis etmek için
npx serve out
```

## 📋 Kontrol Listesi

- [x] Tüm sayfalar `'use client'` direktifi kullanıyor
- [x] Admin koruması client-side'da yapılıyor
- [x] Supabase client-side bağlantıları kullanılıyor
- [x] API routes yok (statik build ile uyumlu)
- [x] Middleware devre dışı kalabilir (sorun değil)

## 🔧 Supabase Edge Functions

Supabase Edge Functions (`supabase/functions/`) statik build'den bağımsızdır ve Supabase tarafında çalışır. Bu fonksiyonlar:

- `process-order`: Sipariş işleme
- `send-notification`: Bildirim gönderme
- `generate-analytics`: Analitik oluşturma
- `webhooks/payment`: Ödeme webhook'ları

Bu fonksiyonlar statik build'den etkilenmez ve normal şekilde çalışır.

## 🌐 Hosting Seçenekleri

Statik build alındıktan sonra şu platformlarda host edebilirsiniz:

- **Vercel**: Otomatik statik export desteği
- **Netlify**: Statik site hosting
- **GitHub Pages**: Ücretsiz statik hosting
- **Cloudflare Pages**: Hızlı CDN ile statik hosting
- **AWS S3 + CloudFront**: Ölçeklenebilir hosting

## ⚡ Performans

Statik build'in avantajları:

- ✅ Çok hızlı yükleme
- ✅ SEO dostu (pre-rendered)
- ✅ CDN caching ile global erişim
- ✅ Sunucu maliyeti yok
- ✅ Ölçeklenebilir

## 🔒 Güvenlik Notları

1. **API Keys**: `NEXT_PUBLIC_*` prefix'li environment variable'lar client-side'da expose olur. Hassas bilgileri burada tutmayın.
2. **Supabase RLS**: Row Level Security policies Supabase tarafında çalışır, statik build'den etkilenmez.
3. **Admin Koruması**: Admin route koruması client-side'da olduğu için gerçek güvenlik için Supabase RLS gerekli.

## 📝 Sonuç

**Evet, bu site statik build alınabilir ve tüm fonksiyonlar çalışır!**

Sadece `next.config.ts`'de `output: 'export'` ve `images.unoptimized: true` ayarlarını aktif etmeniz yeterli.
