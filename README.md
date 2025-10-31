# Kep Marketplace

Modern e-ticaret platformu - Next.js, Supabase ve TypeScript ile geliştirilmiştir.

## 🚀 Özellikler

- **Ürün Yönetimi**: Kategoriler, arama, filtreleme
- **Sepet Sistemi**: Guest ve kullanıcı sepetleri
- **Ödeme Sistemi**: Çoklu ödeme yöntemleri
- **Kullanıcı Yönetimi**: Kayıt, giriş, profil
- **Admin Paneli**: Ürün ve sipariş yönetimi
- **Responsive Tasarım**: Mobil uyumlu arayüz

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **State Management**: Zustand
- **UI Components**: Custom components

## 📁 Proje Yapısı

```
src/
├── app/                 # Next.js App Router sayfaları
├── components/          # React bileşenleri
├── context/            # React Context'ler
├── lib/                # Utility fonksiyonları
└── store/              # Zustand store'ları
```

## 🗄️ Veritabanı

Bu proje Supabase PostgreSQL veritabanı kullanır. Veritabanı yapısı:

- **products** - Ürünler tablosu
- **categories** - Kategoriler tablosu
- **carts** - Sepet sistemi
- **profiles** - Kullanıcı profilleri
- **orders** - Siparişler

### Veritabanı Kurulumu:

1. Supabase projesi oluşturun
2. Gerekli tabloları oluşturun (products, categories, carts, profiles)
3. RLS (Row Level Security) politikalarını aktif edin
4. Environment variables'ları ayarlayın

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
