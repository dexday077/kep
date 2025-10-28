# 📸 Görsel Yönetim Rehberi

## 🎉 Görsel Sistemi Kuruldu!

Artık projenizde **Unsplash'tan gelen ücretsiz, yüksek kaliteli görseller** kullanılıyor!

## 🖼️ Nasıl Çalışıyor?

### 1. **Ürün Görselleri**

Tüm demo ürünler artık gerçek ürün fotoğrafları kullanıyor:

```typescript
import { getProductImage } from '@/lib/imageHelpers';

const product = {
  id: '1',
  title: 'Kablosuz Kulaklık',
  image: getProductImage('1'), // ✅ Unsplash'tan kulaklık görseli
};
```

### 2. **Kategori Görselleri**

Her kategori için özel görseller:

```typescript
import { getCategoryImage } from '@/lib/imageHelpers';

// Restoran görseli
const restaurantImage = getCategoryImage('restaurant', 800, 600);

// Market görseli
const marketImage = getCategoryImage('market', 800, 600);

// Tur görseli
const tourImage = getCategoryImage('tour', 800, 600);
```

### 3. **Banner Görselleri**

Kampanya banner'ları için:

```typescript
import { getBannerImage } from '@/lib/imageHelpers';

const tourBanner = getBannerImage('tour', 1200, 400);
const foodBanner = getBannerImage('food', 1200, 400);
```

### 4. **Esnaf/İşletme Görselleri**

Yerel işletmeler için:

```typescript
import { getBusinessProfileImage } from '@/lib/imageHelpers';

const businessImage = getBusinessProfileImage('Avsallar Market', 200, 200);
```

## 🎨 Mevcut Görsel Fonksiyonları

### `getProductImage(productId, width?, height?)`

- **Kullanım**: Ürün görselleri için
- **Örnek**: `getProductImage('1', 400, 400)`
- **Sonuç**: Belirli bir ürün için önceden tanımlanmış Unsplash görseli

### `getCategoryImage(category, width?, height?)`

- **Kategoriler**:
  - `'restaurant'` - Restoran görselleri
  - `'market'` - Market görselleri
  - `'tour'` - Tur/aktivite görselleri
  - `'electronics'` - Elektronik
  - `'fashion'` - Moda
  - `'home'` - Ev & Bahçe
  - `'sports'` - Spor
  - `'gift'` - Hediyelik
  - `'food'` - Yemek
  - `'beach'` - Plaj
  - `'business'` - İşletme

### `getBannerImage(type, width?, height?)`

- **Tipler**: `'tour'`, `'food'`, `'shopping'`
- **Kullanım**: Ana sayfa banner'ları için

### `getRestaurantImage(restaurantName, width?, height?)`

- **Kullanım**: Restoran sayfaları için
- **Örnek**: `getRestaurantImage('Deniz Cafe', 800, 600)`

### `getPlaceholderImage(width, height, text?, bgColor?, textColor?)`

- **Kullanım**: Geliştirme aşamasında placeholder görseller için
- **Örnek**: `getPlaceholderImage(400, 400, 'Yükleniyor', '4F46E5', 'FFFFFF')`

### `getAvatarPlaceholder(name, size?)`

- **Kullanım**: Kullanıcı avatarları için
- **Örnek**: `getAvatarPlaceholder('Ahmet Yılmaz', 100)`

## 🔄 Görselleri Değiştirmek

### Yöntem 1: Unsplash Görsel ID'lerini Değiştir

`src/lib/imageHelpers.ts` dosyasındaki `getProductImage` fonksiyonunda:

```typescript
const imageIds: Record<string, string> = {
  '1': 'photo-1505740420928-5e560c06d30e', // ⬅️ Bu ID'yi değiştirin
  // Yeni Unsplash ID'si bulmak için:
  // 1. https://unsplash.com adresine gidin
  // 2. İstediğiniz görseli bulun
  // 3. URL'den photo ID'sini kopyalayın
  // Örnek URL: unsplash.com/photos/PHOTO-ID-BURDA
};
```

### Yöntem 2: Kendi Görsellerinizi Ekleyin

```typescript
// public/images/ klasörüne görsellerinizi koyun
const product = {
  id: '1',
  image: '/images/urunler/kulaklık-1.jpg', // Yerel görsel
};
```

### Yöntem 3: Farklı Bir API Kullanın

```typescript
// Pexels API
const pexelsImage = `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?w=400&h=400`;

// Pixabay API
const pixabayImage = `https://pixabay.com/get/${imageId}.jpg`;
```

## 🚀 Performans İpuçları

### Next.js Image Component Kullanın

```tsx
import Image from 'next/image';
import { getProductImage } from '@/lib/imageHelpers';

<Image src={getProductImage('1')} alt="Ürün Adı" width={400} height={400} loading="lazy" placeholder="blur" blurDataURL={getBlurDataURL()} />;
```

### Lazy Loading

Görseller otomatik olarak lazy loading ile yükleniyor (tarayıcı desteği ile).

## 📋 Örnek Kullanımlar

### Yeni Ürün Ekleme

```typescript
const yeniUrun = {
  id: '31',
  title: 'Yeni Ürün',
  price: 299,
  image: getProductImage('31'), // ✅ Otomatik görsel
  rating: 4.5,
  category: 'Elektronik',
};
```

### Restoran Kartı

```typescript
import { getRestaurantImage } from '@/lib/imageHelpers';

const restaurant = {
  name: 'Avsallar Pide',
  image: getRestaurantImage('Avsallar Pide'),
  rating: 4.8,
};
```

### Tur Kartı

```typescript
import { getCategoryImage } from '@/lib/imageHelpers';

const tour = {
  title: 'Alanya Tekne Turu',
  image: getCategoryImage('tour', 800, 600),
  price: 150,
};
```

## 🎯 Yerel Esnaf Görselleri İçin

Gerçek esnaflar sisteme eklendiğinde:

1. **Esnaftan Fotoğraf İsteyin**

   - Dükkan dışından
   - Ürünlerinden
   - Logo/amblem

2. **Görselleri Optimize Edin**

   - Boyut: Max 1MB
   - Format: WebP (modern), JPG (eski tarayıcılar)
   - Boyutlar: 800x600 veya 1200x800

3. **Supabase Storage'a Yükleyin**
   ```typescript
   // Örnek: Esnaf görseli yükleme
   const { data, error } = await supabase.storage.from('esnaf-gorsel').upload('avsallar-market.jpg', file);
   ```

## 🔧 Sorun Giderme

### Görsel Yüklenmiyor?

- İnternet bağlantınızı kontrol edin
- Unsplash API limitlerine takılmış olabilirsiniz (günde 50 request)
- Placeholder görsele geçin: `getPlaceholderImage(400, 400, 'Yükleniyor')`

### Görsel Yavaş Yükleniyor?

- Görsel boyutunu küçültün: `getProductImage('1', 200, 200)`
- CDN kullanın (Cloudflare, CloudImage)
- Next.js Image component kullanın

### Görsel Kalitesi Düşük?

- `quality` parametresini artırın
- Daha büyük boyut kullanın

## 📚 Kaynaklar

- **Unsplash**: https://unsplash.com
- **Unsplash API Docs**: https://unsplash.com/documentation
- **Pexels**: https://pexels.com
- **Pixabay**: https://pixabay.com
- **Next.js Image**: https://nextjs.org/docs/api-reference/next/image

## 💡 İpuçları

1. **Gerçek esnaflar eklenince**: Kendi fotoğraflarını kullanın
2. **Geliştirme aşamasında**: Unsplash görselleri yeterli
3. **Üretim ortamında**: Supabase Storage + CDN kullanın
4. **SEO için**: Alt text ekleyin, görsel boyutlarını optimize edin

---

**✅ Artık projenizde profesyonel görseller var!**

İhtiyacınız olan her şey `src/lib/imageHelpers.ts` dosyasında mevcut. 🎨








