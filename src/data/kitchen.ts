export type KitchenMenuItem = {
  id: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
};

export type Restaurant = {
  slug: string;
  name: string;
  cuisine: string;
  rating: number;
  etaMinutes: number;
  image?: string;
  deliveryFee?: number;
  minOrder?: number;
  badges?: string[];
  promoText?: string;
  menu: KitchenMenuItem[];
};

export const restaurants: Restaurant[] = [
  {
    slug: "kebapci-ali-usta",
    name: "Kebapçı Ali Usta",
    cuisine: "Türk, Kebap",
    rating: 4.7,
    etaMinutes: 25,
    image: "/window.svg",
    deliveryFee: 9.99,
    minOrder: 120,
    badges: ["Hızlı Teslimat", "Çok Satan", "Sponsorlu"],
    promoText: "₺150 üzeri ücretsiz teslimat",
    menu: [
      { id: "adana", title: "Adana Kebap", description: "Acılı, salata ve lavaş ile", price: 220 },
      { id: "urfa", title: "Urfa Kebap", description: "Acısız, salata ve lavaş ile", price: 215 },
      { id: "lahmacun", title: "Lahmacun (2 adet)", description: "Bol yeşillik ile", price: 150 },
    ],
  },
  {
    slug: "sushi-nori",
    name: "Sushi Nori",
    cuisine: "Japon, Sushi",
    rating: 4.5,
    etaMinutes: 40,
    image: "/globe.svg",
    deliveryFee: 14.99,
    minOrder: 180,
    badges: ["Yeni", "Popüler"],
    promoText: "İkinci roll %20 indirim",
    menu: [
      { id: "salmon-roll", title: "Salmon Roll (8 parça)", description: "Somon, avokado", price: 320 },
      { id: "california", title: "California Roll (8 parça)", description: "Yengeç, avokado, salatalık", price: 290 },
      { id: "miso", title: "Miso Çorbası", description: "Sıcak başlangıç", price: 70 },
    ],
  },
  {
    slug: "pasta-mia",
    name: "Pasta Mia",
    cuisine: "İtalyan, Makarna",
    rating: 4.3,
    etaMinutes: 30,
    image: "/file.svg",
    deliveryFee: 0,
    minOrder: 150,
    badges: ["Ücretsiz Teslimat"],
    promoText: "Bugüne özel tatlılarda %15",
    menu: [
      { id: "carbonara", title: "Spaghetti Carbonara", description: "Pancetta, parmesan", price: 240 },
      { id: "alfredo", title: "Fettuccine Alfredo", description: "Kremalı sos", price: 235 },
      { id: "tiramisu", title: "Tiramisu", description: "Klasik tatlı", price: 110 },
    ],
  },
  {
    slug: "arzum-pide-kebap",
    name: "Arzum Pide & Kebap Salonu",
    cuisine: "Pide & Lahmacun",
    rating: 4.6,
    etaMinutes: 35,
    image: "/next.svg",
    deliveryFee: 0,
    minOrder: 120,
    badges: ["Yedikçe İndirim", "Semtin Yıldızı"],
    promoText: "Belirli Ürünlerde %10 İndirim",
    menu: [
      { id: "karisik-pide", title: "Karışık Pide", description: "Kaşar, sucuk, yumurta", price: 180 },
      { id: "lahmacun-3", title: "Lahmacun (3 adet)", description: "Bol yeşillik ile", price: 120 },
      { id: "ayran", title: "Ayran", description: "Ev yapımı", price: 25 },
    ],
  },
  {
    slug: "bi-makarna",
    name: "Bi Makarna",
    cuisine: "Tavuk, Mantı & Makarna",
    rating: 4.6,
    etaMinutes: 30,
    image: "/vercel.svg",
    deliveryFee: 8.99,
    minOrder: 140,
    badges: ["İlk Yemek Siparişine Özel Kod: 07YEMEK200"],
    promoText: "İlk Siparişe Özel 200 TL İndirim",
    menu: [
      { id: "tavuk-makarna", title: "Tavuklu Makarna", description: "Kremalı sos ile", price: 195 },
      { id: "manti", title: "Mantı", description: "Ev yapımı, yoğurtlu", price: 165 },
      { id: "salata", title: "Yeşil Salata", description: "Taze sebzeler", price: 75 },
    ],
  },
  {
    slug: "burger-king",
    name: "Burger King",
    cuisine: "Burger",
    rating: 4.4,
    etaMinutes: 20,
    image: "/globe.svg",
    deliveryFee: 12.99,
    minOrder: 100,
    badges: ["Hızlı Teslimat", "Büyük Markalar"],
    promoText: "Whopper Menüde %25 İndirim",
    menu: [
      { id: "whopper", title: "Whopper Menü", description: "Patates ve içecek ile", price: 285 },
      { id: "cheeseburger", title: "Cheeseburger", description: "Tekli burger", price: 145 },
      { id: "chicken-royal", title: "Chicken Royal", description: "Tavuk burger", price: 195 },
    ],
  },
  {
    slug: "dominos-pizza",
    name: "Domino's Pizza",
    cuisine: "Pizza",
    rating: 4.2,
    etaMinutes: 25,
    image: "/file.svg",
    deliveryFee: 0,
    minOrder: 150,
    badges: ["Ücretsiz Teslimat", "Pizza Uzmanı"],
    promoText: "2 Pizza Al 1 Pizza Bedava",
    menu: [
      { id: "margherita", title: "Margherita Pizza", description: "Mozzarella, domates", price: 225 },
      { id: "pepperoni", title: "Pepperoni Pizza", description: "Pepperoni, mozzarella", price: 275 },
      { id: "supreme", title: "Supreme Pizza", description: "Tüm malzemeler", price: 325 },
    ],
  },
  {
    slug: "starbucks",
    name: "Starbucks",
    cuisine: "Kahve & İçecek",
    rating: 4.5,
    etaMinutes: 15,
    image: "/window.svg",
    deliveryFee: 0,
    minOrder: 200,
    badges: ["Büyük Markalar", "Premium Kahve"],
    promoText: "450 TL'ye sepette 150 TL İndirim",
    menu: [
      { id: "latte", title: "Latte", description: "Sıcak kahve", price: 85 },
      { id: "cappuccino", title: "Cappuccino", description: "Köpüklü kahve", price: 80 },
      { id: "frappuccino", title: "Frappuccino", description: "Soğuk kahve", price: 95 },
    ],
  },
  {
    slug: "kfc",
    name: "KFC",
    cuisine: "Tavuk",
    rating: 4.3,
    etaMinutes: 22,
    image: "/next.svg",
    deliveryFee: 10.99,
    minOrder: 130,
    badges: ["Hızlı Teslimat", "Krispy Tavuk"],
    promoText: "Bucket Menüde %20 İndirim",
    menu: [
      { id: "bucket", title: "Bucket Menü", description: "8 parça tavuk", price: 285 },
      { id: "zinger-burger", title: "Zinger Burger", description: "Acılı tavuk burger", price: 195 },
      { id: "popcorn-chicken", title: "Popcorn Chicken", description: "Küçük tavuk parçaları", price: 145 },
    ],
  },
  {
    slug: "subway",
    name: "Subway",
    cuisine: "Tost & Sandviç",
    rating: 4.1,
    etaMinutes: 18,
    image: "/vercel.svg",
    deliveryFee: 8.99,
    minOrder: 110,
    badges: ["Sağlıklı Seçenekler"],
    promoText: "Footlong Sandviçte %15 İndirim",
    menu: [
      { id: "italian-bmt", title: "Italian B.M.T.", description: "Salam, sosis, pastırma", price: 185 },
      { id: "chicken-teriyaki", title: "Chicken Teriyaki", description: "Tavuk, teriyaki sos", price: 195 },
      { id: "veggie-delite", title: "Veggie Delite", description: "Sebzeli sandviç", price: 165 },
    ],
  },
  {
    slug: "pizza-hut",
    name: "Pizza Hut",
    cuisine: "Pizza",
    rating: 4.0,
    etaMinutes: 28,
    image: "/globe.svg",
    deliveryFee: 0,
    minOrder: 160,
    badges: ["Ücretsiz Teslimat", "Pizza Uzmanı"],
    promoText: "Büyük Pizza Al Orta Pizza Bedava",
    menu: [
      { id: "supreme-pizza", title: "Supreme Pizza", description: "Tüm malzemeler", price: 295 },
      { id: "chicken-bbq", title: "Chicken BBQ", description: "Tavuk, BBQ sos", price: 275 },
      { id: "margherita-pizza", title: "Margherita Pizza", description: "Mozzarella, domates", price: 245 },
    ],
  },
  {
    slug: "mcdonalds",
    name: "McDonald's",
    cuisine: "Burger",
    rating: 4.2,
    etaMinutes: 16,
    image: "/file.svg",
    deliveryFee: 9.99,
    minOrder: 90,
    badges: ["Hızlı Teslimat", "Büyük Markalar"],
    promoText: "Big Mac Menüde %30 İndirim",
    menu: [
      { id: "big-mac", title: "Big Mac Menü", description: "Patates ve içecek ile", price: 285 },
      { id: "chicken-mc", title: "Chicken McNuggets", description: "6 parça tavuk", price: 175 },
      { id: "mcflurry", title: "McFlurry", description: "Dondurma tatlısı", price: 125 },
    ],
  },
];

export function getRestaurants(): Restaurant[] {
  return restaurants;
}

export function getRestaurantBySlug(slug: string): Restaurant | undefined {
  return restaurants.find((r) => r.slug === slug);
}


