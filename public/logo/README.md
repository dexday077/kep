# 🎨 Kep Marketplace Logo Kullanım Rehberi

## 📁 Logo Dosyaları

Bu klasörde Kep Marketplace'in kurumsal görselleri bulunmaktadır.

### Mevcut Logo

- **Ana Logo**: `kep_marketplace_logo.png`
  - Kullanım: Navbar, Footer, Sosyal Medya
  - Format: PNG (transparent background önerilir)

## 🎯 Logo Kullanım Alanları

### 1. **Navbar (Header)**

```tsx
<Image src="/logo/kep_marketplace_logo.png" alt="Kep Marketplace" width={120} height={40} className="h-10 w-auto" priority />
```

### 2. **Footer**

```tsx
<Image src="/logo/kep_marketplace_logo.png" alt="Kep Marketplace" width={150} height={50} className="h-12 w-auto" />
```

### 3. **Meta Tags (SEO)**

```tsx
// layout.tsx içinde
icons: {
  icon: "/logo/kep_marketplace_logo.png",
  apple: "/logo/kep_marketplace_logo.png",
}
```

## 📐 Önerilen Logo Varyasyonları

### Eklenebilecek Dosyalar:

1. **`kep_marketplace_logo.png`** ✅ (Mevcut)

   - Ana logo (renkli, arka plan ile)

2. **`kep_marketplace_logo_white.png`** (Önerilen)

   - Beyaz logo (koyu arka planlar için)

3. **`kep_marketplace_icon.png`** (Önerilen)

   - Sadece ikon/amblem (kare format)
   - Boyut: 512x512px
   - Kullanım: Favicon, App Icon, Social Media Avatar

4. **`kep_marketplace_logo_horizontal.png`** (Önerilen)

   - Geniş format (16:9 veya 21:9)
   - Kullanım: Email signatures, Letterhead

5. **`kep_marketplace_logo_vertical.png`** (Önerilen)
   - Dikey format
   - Kullanım: Mobile app splash screen

## 🎨 Logo Renk Paleti

Logonuzun mevcut renklerini koruyarak tutarlılık sağlayın:

```css
/* Marka Renkleri */
--primary-blue: #2563eb;
--primary-orange: #f97316;
--white: #ffffff;
--dark: #111827;
```

## 📏 Logo Boyutları

### Web Kullanımı

- **Navbar**: 120x40px (h-10)
- **Footer**: 150x50px (h-12)
- **Favicon**: 32x32px, 64x64px
- **Open Graph**: 1200x630px

### Print Kullanımı

- **Minimum Boyut**: 25mm genişlik
- **Çözünürlük**: 300 DPI
- **Format**: PNG veya SVG

## 🚫 Logo Kullanımında Yasaklar

1. ❌ Logoyu deforme etmeyin (uzatma/sıkıştırma)
2. ❌ Logo renklerini değiştirmeyin
3. ❌ Logo etrafında minimum boşluğu koruyun
4. ❌ Logoyu düşük çözünürlükte kullanmayın
5. ❌ Logo üzerine metin eklemeyin

## ✅ Logo Kullanım İzinleri

- ✅ Resmi Kep Marketplace materyalleri
- ✅ İş ortağı anlaşmaları (onay ile)
- ✅ Basın bültenleri ve medya
- ✅ Sosyal medya paylaşımları

## 🔧 Favicon Oluşturma

Eğer favicon oluşturmak isterseniz:

```bash
# Logo'dan favicon oluşturmak için (online araçlar):
1. https://favicon.io/ - Logo yükle
2. PNG to ICO - Convert
3. favicon.ico dosyasını public/ klasörüne koy
```

Veya kodu kullanarak:

```tsx
// app/layout.tsx
export const metadata = {
  icons: {
    icon: [
      { url: '/logo/kep_marketplace_icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo/kep_marketplace_icon.png', sizes: '64x64', type: 'image/png' },
    ],
    apple: '/logo/kep_marketplace_logo.png',
  },
};
```

## 📱 Sosyal Medya Boyutları

### Facebook

- **Profil Fotoğrafı**: 180x180px (kare)
- **Kapak Fotoğrafı**: 820x312px
- **Paylaşım Görseli**: 1200x630px

### Instagram

- **Profil Fotoğrafı**: 320x320px (kare)
- **Post**: 1080x1080px (kare)
- **Story**: 1080x1920px (9:16)

### Twitter/X

- **Profil Fotoğrafı**: 400x400px (kare)
- **Header**: 1500x500px
- **Card**: 1200x675px

## 🎁 Logo Paketi İçeriği

İdeal bir logo paketi şunları içermelidir:

```
/public/logo/
├── kep_marketplace_logo.png           (Ana logo - mevcut ✅)
├── kep_marketplace_logo_white.png     (Beyaz versiyon)
├── kep_marketplace_icon.png           (Sadece ikon)
├── kep_marketplace_logo.svg           (Vektör - ölçeklenebilir)
├── favicon-32x32.png                  (Favicon)
├── favicon-64x64.png                  (Favicon)
├── apple-touch-icon.png               (iOS icon)
└── README.md                          (Bu dosya ✅)
```

## 📞 İletişim

Logo kullanımı ile ilgili sorularınız için:

- **Email**: info@kepmarketplace.com
- **Website**: https://kepmarketplace.com

---

**Son Güncelleme**: ${new Date().toLocaleDateString('tr-TR')}












