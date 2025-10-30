'use client';

import React, { useMemo, useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import FiltersBar from '@/components/FiltersBar';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import Link from 'next/link';
import { useSearch } from '@/context/SearchContext';
import { getProductImage } from '@/lib/imageHelpers';
import { useCartStore } from '@/store/cartStore';
import { useToastContext } from '@/context/ToastContext';
import { ApiService } from '@/lib/api';

const demoProducts = [
  {
    id: '1',
    title: 'Kablosuz Kulaklık Pro X',
    price: 1899,
    originalPrice: 2499,
    image: getProductImage('1'),
    rating: 4.6,
    badge: 'Öne Çıkan',
    category: 'Elektronik',
  },
  {
    id: '2',
    title: 'Akıllı Saat S3',
    price: 2399,
    originalPrice: 2999,
    image: getProductImage('2'),
    rating: 4.4,
    category: 'Moda',
  },
  {
    id: '3',
    title: 'Bluetooth Hoparlör Mini',
    price: 749,
    image: getProductImage('3'),
    rating: 4.2,
    category: 'Ev & Yaşam',
  },
  {
    id: '4',
    title: 'Oyun Mouse RGB',
    price: 499,
    originalPrice: 699,
    image: getProductImage('4'),
    rating: 4.1,
    category: 'Elektronik',
  },
  {
    id: '5',
    title: 'USB-C Hızlı Şarj Adaptörü',
    price: 329,
    image: getProductImage('5'),
    rating: 4.3,
    category: 'Elektronik',
  },
  {
    id: '6',
    title: 'Profesyonel Mikrofon Seti',
    price: 1299,
    image: getProductImage('6'),
    rating: 4.7,
    category: 'Elektronik',
  },
  {
    id: '7',
    title: 'Mekanik Klavye Gaming',
    price: 899,
    originalPrice: 1199,
    image: getProductImage('7'),
    rating: 4.5,
    category: 'Elektronik',
  },
  {
    id: '8',
    title: 'Laptop Stand Alüminyum',
    price: 299,
    image: getProductImage('8'),
    rating: 4.2,
    category: 'Elektronik',
  },
  {
    id: '9',
    title: 'Kahve Makinesi Otomatik',
    price: 3499,
    originalPrice: 4499,
    image: getProductImage('9'),
    rating: 4.8,
    badge: 'En Çok Satan',
    category: 'Ev & Yaşam',
  },
  {
    id: '10',
    title: 'Spor Ayakkabı Koşu',
    price: 1599,
    originalPrice: 1999,
    image: getProductImage('10'),
    rating: 4.4,
    category: 'Spor',
  },
  {
    id: '11',
    title: 'Telefon Kılıfı Şeffaf',
    price: 89,
    image: getProductImage('11'),
    rating: 4.1,
    category: 'Elektronik',
  },
  {
    id: '12',
    title: 'Fitness Eldiveni',
    price: 89,
    image: getProductImage('12'),
    rating: 4.5,
    category: 'Spor',
  },
  {
    id: '13',
    title: 'Kozmetik Set Premium',
    price: 899,
    image: getProductImage('13'),
    rating: 4.7,
    category: 'Kozmetik',
  },
  {
    id: '14',
    title: 'Çocuk Oyuncağı Eğitici',
    price: 299,
    image: getProductImage('14'),
    rating: 4.3,
    category: 'Oyuncak',
  },
  {
    id: '15',
    title: 'Kitap Roman Klasik',
    price: 79,
    image: getProductImage('15'),
    rating: 4.8,
    category: 'Kitap',
  },
  {
    id: '16',
    title: 'Araba Temizlik Seti',
    price: 199,
    image: getProductImage('16'),
    rating: 4.4,
    category: 'Otomotiv',
  },
  {
    id: '17',
    title: 'Erkek Tişört Pamuk',
    price: 249,
    image: getProductImage('17'),
    rating: 4.2,
    category: 'Moda',
  },
  {
    id: '18',
    title: 'Kadın Çanta Deri',
    price: 1599,
    image: getProductImage('18'),
    rating: 4.6,
    category: 'Moda',
  },
  {
    id: '19',
    title: 'Bluetooth Kulaklık Sport',
    price: 699,
    originalPrice: 899,
    image: getProductImage('19'),
    rating: 4.1,
    category: 'Elektronik',
  },
  {
    id: '20',
    title: 'Kahve Fincanı Seramik',
    price: 129,
    image: getProductImage('20'),
    rating: 4.5,
    category: 'Ev & Yaşam',
  },
  {
    id: '21',
    title: 'Bisiklet Kask Güvenlik',
    price: 399,
    image: getProductImage('21'),
    rating: 4.7,
    category: 'Spor',
  },
  {
    id: '22',
    title: 'Makyaj Fırçası Seti',
    price: 179,
    image: getProductImage('22'),
    rating: 4.4,
    category: 'Kozmetik',
  },
  {
    id: '23',
    title: 'Puzzle 1000 Parça',
    price: 159,
    image: getProductImage('23'),
    rating: 4.6,
    category: 'Oyuncak',
  },
  {
    id: '24',
    title: 'Motivasyon Kitabı',
    price: 89,
    image: getProductImage('24'),
    rating: 4.8,
    category: 'Kitap',
  },
  {
    id: '25',
    title: 'Araba Kokusu Vanilya',
    price: 49,
    image: getProductImage('25'),
    rating: 4.3,
    category: 'Otomotiv',
  },
  {
    id: '26',
    title: 'Sweatshirt Oversize',
    price: 399,
    image: getProductImage('26'),
    rating: 4.5,
    category: 'Moda',
  },
  {
    id: '27',
    title: 'Jean Pantolon Slim',
    price: 599,
    image: getProductImage('27'),
    rating: 4.4,
    category: 'Moda',
  },
  {
    id: '28',
    title: 'Tablet Stand Ayarlanabilir',
    price: 199,
    image: getProductImage('28'),
    rating: 4.2,
    category: 'Elektronik',
  },
  {
    id: '29',
    title: 'Çay Seti Porselen',
    price: 449,
    image: getProductImage('29'),
    rating: 4.6,
    category: 'Ev & Yaşam',
  },
  {
    id: '30',
    title: 'Yoga Matı Premium',
    price: 299,
    originalPrice: 399,
    image: getProductImage('30'),
    rating: 4.7,
    category: 'Spor',
  },
];

// Kategoriler artık Supabase'den çekilecek

const heroSlides = [
  {
    id: 1,
    title: 'Efsane Fırsatlar',
    subtitle: "Tüm kategorilerde %70'e varan indirimler",
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=320&fit=crop&q=80',
    buttonText: 'Hemen Keşfet',
    buttonLink: '/flash-sale',
  },
  {
    id: 2,
    title: 'Teknoloji Günleri',
    subtitle: 'En yeni teknoloji ürünleri burada',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&h=320&fit=crop&q=80',
    buttonText: 'Ürünleri İncele',
    buttonLink: '/category/elektronik',
  },
  {
    id: 3,
    title: 'Kep Premium Avantajları',
    subtitle: 'Premium üyelik ile ek indirimler',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=320&fit=crop&q=80',
    buttonText: 'Premium Ol',
    buttonLink: '/premium',
  },
];

const quickLinks = [
  {
    id: 1,
    title: 'Fırsat Ürünleri',
    subtitle: 'Günlük fırsatlar',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=100&h=100&fit=crop&q=80',
    link: '/flash-sale',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 2,
    title: 'KepPay ile Anında İndirim',
    subtitle: 'Ek %5 indirim',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop&q=80',
    link: '/keppay',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3,
    title: 'Premium Üyelik',
    subtitle: 'Özel avantajlar',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100&h=100&fit=crop&q=80',
    link: '/premium',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 4,
    title: 'Hızlı Teslimat',
    subtitle: '30 dakikada kapıda',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop&q=80',
    link: '/delivery',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function HomePage() {
  const { searchQuery, setSearchQuery } = useSearch();
  const { addToCart } = useCartStore();
  const { success } = useToastContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<{ sort: string; minPrice?: number; maxPrice?: number }>({ sort: 'popularity' });

  // Supabase'den kategorileri çek
  const [categories, setCategories] = useState<Array<{ name: string; slug: string; icon: string; image: string }>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const handleAddToCart = (product: (typeof demoProducts)[0]) => {
    addToCart(
      {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      },
      1,
    );
    success('Ürün Sepete Eklendi!', `${product.title} sepetinize eklendi.`);
  };

  // Kategorileri yükle
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoriesData = await ApiService.getCategories();

        // Kategorileri ana sayfa formatına dönüştür
        const formattedCategories = categoriesData.map((cat: any) => ({
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon || '📦',
          image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000)}?w=100&h=100&fit=crop&q=80`, // Random placeholder image
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
        // Fallback kategoriler
        setCategories([
          { name: 'Elektronik', slug: 'elektronik', icon: '💻', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop&q=80' },
          { name: 'Moda', slug: 'moda', icon: '👔', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop&q=80' },
          { name: 'Ev & Yaşam', slug: 'ev-yasam', icon: '🏠', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop&q=80' },
          { name: 'Spor', slug: 'spor', icon: '⚽', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop&q=80' },
        ]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Hero slider auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Search debounce
  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery]);

  const filtered = useMemo(() => {
    let list = [...demoProducts];

    if (searchQuery.trim()) {
      list = list.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (filters.minPrice != null) list = list.filter((p) => p.price >= (filters.minPrice as number));
    if (filters.maxPrice != null) list = list.filter((p) => p.price <= (filters.maxPrice as number));

    if (filters.sort === 'popularity') {
      list.sort((a, b) => {
        if (a.rating !== b.rating) return (b.rating || 0) - (a.rating || 0);
        return a.price - b.price;
      });
    }
    if (filters.sort === 'priceAsc') list.sort((a, b) => a.price - b.price);
    if (filters.sort === 'priceDesc') list.sort((a, b) => b.price - a.price);

    return list;
  }, [filters, searchQuery]);

  // getCategorySlug fonksiyonu artık gerekli değil, slug'ları direkt kullanıyoruz

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section - Clean Design with Images */}
      <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-orange-700">
        {/* Subtle Background Images */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-0 left-0 w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=600&fit=crop&q=80')`,
            }}
          />
          <div
            className="absolute top-0 right-0 w-1/3 h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=600&fit=crop&q=80')`,
            }}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Top Banner - Brand Promotions */}
          <div className="mb-6">
            <div className="flex justify-between items-center bg-white/20 rounded-xl px-6 py-3">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-1 rounded-full">
                  <span className="text-black font-bold text-sm">🏆 1. YIL ÖZEL</span>
                </div>
                <span className="text-white font-semibold">AVSALLAR&apos;IN EN BÜYÜK DİJİTAL ÇARŞISI</span>
              </div>
              <div className="text-white/80 text-sm">
                <span className="font-bold">500+</span> Yerel Esnaf • <span className="font-bold">24/7</span> Hizmet
              </div>
            </div>
          </div>

          {/* Main Hero Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Main Banner Carousel */}
            <div className="lg:col-span-2">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
                {heroSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-all duration-1000 ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
                    <div className="relative h-full flex flex-col justify-center p-8">
                      <div className="max-w-lg">
                        {/* Special Badge */}
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-full mb-4">
                          <span className="text-black font-bold text-sm">⭐ EFSANE KASIM</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{slide.title}</h2>
                        <p className="text-xl text-white/90 mb-6 leading-relaxed">{slide.subtitle}</p>

                        <div className="flex flex-col sm:flex-row gap-4">
                          <Link
                            href={slide.buttonLink}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg inline-flex items-center justify-center gap-2"
                          >
                            {slide.buttonText}
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                          <button className="bg-white/30 text-white font-semibold py-4 px-6 rounded-xl hover:bg-white/40 transition-all border border-white/40">Detayları Gör</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Carousel Navigation */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Slide Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentSlide + 1}/{heroSlides.length}
                </div>
              </div>

              {/* Slider Dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {heroSlides.map((_, index) => (
                  <button key={index} onClick={() => setCurrentSlide(index)} className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-orange-500' : 'bg-white/50 hover:bg-white/70'}`} />
                ))}
              </div>
            </div>

            {/* Right: Recommended Products */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-xl h-full">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Senin İçin Seçtiklerimiz</h3>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Önerilen</span>
                </div>

                {/* Featured Product */}
                <div className="bg-white rounded-xl p-4 shadow-lg mb-4 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${demoProducts[0].image})` }} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">{demoProducts[0].title}</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex text-yellow-400">{'★'.repeat(5)}</div>
                        <span className="text-xs text-gray-500">(12)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-orange-600">{demoProducts[0].price.toLocaleString('tr-TR')} ₺</span>
                        {demoProducts[0].originalPrice && <span className="text-xs text-gray-500 line-through">{demoProducts[0].originalPrice.toLocaleString('tr-TR')} ₺</span>}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleAddToCart(demoProducts[0])} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-all mt-3 text-sm">
                    Sepete Ekle
                  </button>
                </div>

                {/* More Products Preview */}
                <div className="space-y-3">
                  {demoProducts.slice(1, 3).map((product) => (
                    <div key={product.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-all">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url(${product.image})` }} />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 text-xs line-clamp-1">{product.title}</h5>
                        <span className="font-bold text-orange-600 text-sm">{product.price.toLocaleString('tr-TR')} ₺</span>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>

                <Link href="/recommended" className="block text-center text-orange-600 hover:text-orange-700 font-semibold mt-4 text-sm">
                  Tümünü Gör →
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Trust Bar */}
          <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-white/90">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Güvenli Ödeme</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">30dk Hızlı Teslimat</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-sm font-medium">Yerel Esnaf Desteği</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-medium">Premium Kalite</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Navigation Tabs */}
      <section className="bg-white shadow-lg border-b-4 border-orange-200 sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-8">
            {categoriesLoading ? (
              <div className="flex gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex overflow-x-auto gap-6 scrollbar-hide">
                {/* Tüm Kategoriler Linki */}
                <Link href="/category/all" className="flex-shrink-0 flex flex-col items-center gap-3 group">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-red-500 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex items-center justify-center text-2xl">
                      <span className="text-white drop-shadow-lg">📂</span>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors leading-tight">Tüm Kategoriler</div>
                  </div>
                </Link>

                {categories.map((category) => (
                  <Link key={category.name} href={`/category/${category.slug}`} className="flex-shrink-0 flex flex-col items-center gap-3 group">
                    <div className="relative">
                      <div
                        className="w-16 h-16 rounded-full bg-cover bg-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 flex items-center justify-center text-2xl"
                        style={{ backgroundImage: `url(${category.image})` }}
                      >
                        <span className="text-white drop-shadow-lg">{category.icon}</span>
                      </div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors leading-tight">{category.name}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Links Bar */}
      <section className="py-8 bg-gray-50 border-b-4 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.id} href={link.link} className="group relative overflow-hidden rounded-xl text-center transition-all hover:shadow-lg hover:scale-105 bg-white p-4">
                <div className="relative mb-3">
                  <div className="w-16 h-16 mx-auto rounded-lg bg-cover bg-center shadow-md" style={{ backgroundImage: `url(${link.image})` }} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-30 group-hover:opacity-40 transition-opacity rounded-lg`}></div>
                </div>
                <div className="text-center">
                  <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-orange-600 transition-colors">{link.title}</h3>
                  <p className="text-xs text-gray-600">{link.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 bg-white border-b-4 border-orange-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Senin İçin Seçtiklerimiz</h2>
              <p className="text-gray-600">Özel olarak seçilmiş ürünler</p>
            </div>
            <Link href="/products" className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2">
              Tümünü Gör
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {filtered.slice(0, 12).map((product) => (
              <div key={product.id} className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="relative mb-4">
                  <div className="w-full h-32 bg-gray-200 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
                  {product.badge && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">{product.badge}</span>}
                  {product.originalPrice && <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">%{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)} İndirim</span>}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">{product.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    <span className="text-orange-500">★</span>
                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-gray-900">{product.price.toLocaleString('tr-TR')} ₺</span>
                  {product.originalPrice && <span className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString('tr-TR')} ₺</span>}
                </div>
                <button onClick={() => handleAddToCart(product)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-3 rounded-lg transition-all text-sm">
                  Sepete Ekle
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Views Section */}
      <section className="py-12 bg-gray-50 border-b-4 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Son Görüntülediklerin</h2>
            <Link href="/recent" className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-2">
              Tümünü Gör
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-4 scrollbar-hide pb-4">
            {filtered.slice(12, 20).map((product) => (
              <div key={product.id} className="flex-shrink-0 w-48 bg-white rounded-xl p-4 shadow-sm hover:shadow-lg transition-all">
                <div className="relative mb-3">
                  <div className="w-full h-24 bg-gray-200 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{product.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">{product.price.toLocaleString('tr-TR')} ₺</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <FiltersBar onChange={setFilters} showSort={true} />

      {/* All Products Grid */}
      <section className="py-8 bg-white border-b-4 border-orange-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tüm Ürünler</h2>
            <p className="text-gray-600">{searchQuery ? `"${searchQuery}" için ${filtered.length} sonuç` : `${filtered.length} ürün bulundu`}</p>
          </div>

          {isSearching ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {filtered.length === 0 && !isSearching && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ürün bulunamadı</h3>
              <p className="text-gray-600 mb-4">Arama kriterlerinizi değiştirerek tekrar deneyin</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilters({ sort: 'popularity' });
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg transition-all"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
