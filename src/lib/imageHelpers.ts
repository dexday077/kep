/**
 * Görsel Yönetim Yardımcıları
 * Unsplash kaynaklı dinamik görseller ve placeholder'lar
 */

export type ImageCategory = 'restaurant' | 'market' | 'tour' | 'electronics' | 'fashion' | 'home' | 'sports' | 'gift' | 'food' | 'beach' | 'business';

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  category?: ImageCategory;
  query?: string;
}

/**
 * Unsplash'tan dinamik görsel al
 */
export const getUnsplashImage = (options: ImageOptions): string => {
  const { width = 800, height = 600, quality = 80, query } = options;

  const baseUrl = 'https://source.unsplash.com';
  const queryParam = query ? `?${query}` : '';

  return `${baseUrl}/${width}x${height}/${queryParam}&q=${quality}`;
};

/**
 * Kategori bazlı görsel al
 */
export const getCategoryImage = (category: ImageCategory, width = 800, height = 600): string => {
  const categoryQueries: Record<ImageCategory, string> = {
    restaurant: 'turkish-restaurant,mediterranean-food',
    market: 'fresh-market,grocery-store',
    tour: 'alanya-beach,boat-tour',
    electronics: 'electronics-store,gadgets',
    fashion: 'clothing-store,fashion',
    home: 'home-decor,garden',
    sports: 'sports-equipment,fitness',
    gift: 'gift-shop,souvenirs',
    food: 'turkish-food,cuisine',
    beach: 'mediterranean-beach,turkey',
    business: 'local-business,storefront',
  };

  return getUnsplashImage({
    width,
    height,
    query: categoryQueries[category],
  });
};

/**
 * Ürün görseli al (ID bazlı - tutarlı görsel için)
 */
export const getProductImage = (productId: string, width = 400, height = 400): string => {
  // Unsplash'ın belirli bir görseli çekmek için ID kullanımı
  const imageIds: Record<string, string> = {
    // Elektronik
    '1': 'photo-1505740420928-5e560c06d30e', // Kulaklık
    '4': 'photo-1527864550417-7fd91fc51a46', // Mouse
    '5': 'photo-1591290619762-99f6d3c0b1d4', // Şarj adaptörü
    '6': 'photo-1590602847861-f357a9332bbc', // Mikrofon
    '7': 'photo-1587829741301-dc798b83add3', // Klavye
    '8': 'photo-1527864550417-7fd91fc51a46', // Laptop stand
    '11': 'photo-1601784551446-20c9e07cdbdb', // Telefon kılıfı
    '19': 'photo-1590658268037-6bf12165a8df', // Bluetooth kulaklık
    '28': 'photo-1544244015-0df4b3ffc6b0', // Tablet stand

    // Moda
    '2': 'photo-1523275335684-37898b6baf30', // Akıllı saat
    '17': 'photo-1521572163474-6864f9cf17ab', // Tişört
    '18': 'photo-1590874103328-eac38a683ce7', // Çanta
    '26': 'photo-1556821840-3a63f95609a7', // Sweatshirt
    '27': 'photo-1542272604-787c3835535d', // Jean

    // Ev & Yaşam
    '3': 'photo-1608043152269-423dbba4e7e1', // Hoparlör
    '9': 'photo-1495474472287-4d71bcdd2085', // Kahve makinesi
    '20': 'photo-1514228742587-6b1558fcca3d', // Fincan
    '29': 'photo-1587080266227-677cc2a4e76e', // Çay seti

    // Spor
    '10': 'photo-1542291026-7eec264c27ff', // Spor ayakkabı
    '12': 'photo-1517836357463-d25dfeac3438', // Fitness
    '21': 'photo-1557804506-669a67965ba0', // Bisiklet kaskı
    '30': 'photo-1601925260368-ae2f83cf8b7f', // Yoga matı

    // Kozmetik
    '13': 'photo-1596462502278-27bfdc403348', // Kozmetik set
    '22': 'photo-1583241800698-4ec168f5b47e', // Makyaj fırçası

    // Oyuncak
    '14': 'photo-1558060370-d644479cb6f7', // Oyuncak
    '23': 'photo-1611273426858-450d8e3c9fce', // Puzzle

    // Kitap
    '15': 'photo-1544947950-fa07a98d237f', // Kitap
    '24': 'photo-1512820790803-83ca734da794', // Motivasyon kitabı

    // Otomotiv
    '16': 'photo-1486262715619-67b85e0b08d3', // Araba temizlik
    '25': 'photo-1605559424843-9e4c228bf1c2', // Araba kokusu
  };

  const imageId = imageIds[productId];
  if (imageId) {
    return `https://images.unsplash.com/${imageId}?w=${width}&h=${height}&fit=crop&q=80`;
  }

  // Fallback: Random görsel
  return `https://source.unsplash.com/${width}x${height}/?product&sig=${productId}`;
};

/**
 * Restoran görseli al
 */
export const getRestaurantImage = (restaurantName: string, width = 800, height = 600): string => {
  const seed = restaurantName.toLowerCase().replace(/\s+/g, '-');
  return `https://source.unsplash.com/${width}x${height}/?turkish-restaurant,mediterranean-food&sig=${seed}`;
};

/**
 * Banner görseli al
 */
export const getBannerImage = (type: 'tour' | 'food' | 'shopping', width = 1200, height = 400): string => {
  const bannerQueries = {
    tour: 'alanya-beach,boat-tour,mediterranean',
    food: 'turkish-food,restaurant,cuisine',
    shopping: 'shopping,market,local-business',
  };

  return getUnsplashImage({
    width,
    height,
    query: bannerQueries[type],
    quality: 90,
  });
};

/**
 * Esnaf/İşletme profil fotoğrafı
 */
export const getBusinessProfileImage = (businessName: string, width = 200, height = 200): string => {
  const seed = businessName.toLowerCase().replace(/\s+/g, '-');
  return `https://source.unsplash.com/${width}x${height}/?storefront,shop&sig=${seed}`;
};

/**
 * Placeholder görsel (geliştirme için)
 */
export const getPlaceholderImage = (width = 400, height = 400, text = 'Görsel Yükleniyor', bgColor = '4F46E5', textColor = 'FFFFFF'): string => {
  const encodedText = encodeURIComponent(text);
  return `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodedText}`;
};

/**
 * Avatar/profil görseli oluştur (isim baş harflerinden)
 */
export const getAvatarPlaceholder = (name: string, size = 100): string => {
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // DiceBear API kullanarak avatar
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&size=${size}`;
};

/**
 * Resim optimizasyonu (lazy loading için blur placeholder)
 */
export const getBlurDataURL = (width = 10, height = 10): string => {
  return `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f0f0f0" offset="0%" />
          <stop stop-color="#e0e0e0" offset="100%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g)" />
    </svg>`,
  ).toString('base64')}`;
};








