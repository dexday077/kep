'use client';

import React, { useMemo, useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import FiltersBar from '@/components/FiltersBar';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import Link from 'next/link';
import Image from 'next/image';
import { useSearch } from '@/context/SearchContext';
import { getProductImage } from '@/lib/imageHelpers';
import { useCartStore } from '@/store/cartStore';
import { useToastContext } from '@/context/ToastContext';
import { ApiService } from '@/lib/api';
import { fetchUnsplashImage } from '@/lib/unsplash';

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

const defaultHeroSlides = [
  {
    id: 1,
    title: 'Efsane Fırsatlar',
    subtitle: "Tüm kategorilerde %70'e varan indirimler",
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=600&fit=crop&q=80',
    unsplashQuery: 'shopping mall retail sale',
    buttonText: 'Hemen Keşfet',
    buttonLink: '/flash-sale',
  },
  {
    id: 2,
    title: 'Teknoloji Günleri',
    subtitle: 'En yeni teknoloji ürünleri burada',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop&q=80',
    unsplashQuery: 'modern technology gadgets',
    buttonText: 'Ürünleri İncele',
    buttonLink: '/category/elektronik',
  },
  {
    id: 3,
    title: 'Kep Premium Avantajları',
    subtitle: 'Premium üyelik ile ek indirimler',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&h=600&fit=crop&q=80',
    unsplashQuery: 'premium lifestyle membership',
    buttonText: 'Premium Ol',
    buttonLink: '/premium',
  },
];

const defaultQuickLinks = [
  {
    id: 1,
    title: 'Fırsat Ürünleri',
    subtitle: 'Günlük fırsatlar',
    image: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?w=600&h=600&fit=crop&q=80',
    unsplashQuery: 'flash sale',
    link: '/flash-sale',
    color: 'from-red-500 to-pink-500',
  },
  {
    id: 2,
    title: 'KepPay ile Anında İndirim',
    subtitle: 'Ek %5 indirim',
    image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?w=600&h=600&fit=crop&q=80',
    unsplashQuery: 'digital payment phone',
    link: '/keppay',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 3,
    title: 'Premium Üyelik',
    subtitle: 'Özel avantajlar',
    image: 'https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e?w=600&h=600&fit=crop&q=80',
    unsplashQuery: 'luxury lifestyle membership',
    link: '/premium',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    id: 4,
    title: 'Hızlı Teslimat',
    subtitle: '30 dakikada kapıda',
    image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?w=600&h=600&fit=crop&q=80',
    unsplashQuery: 'express delivery courier',
    link: '/delivery',
    color: 'from-green-500 to-emerald-500',
  },
];

const inspirationQueries = [
  { id: 'inspiration-1', query: 'local artisan crafts shop', fallback: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&q=80' },
  { id: 'inspiration-2', query: 'fresh farmers market produce', fallback: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=600&fit=crop&q=80' },
  { id: 'inspiration-3', query: 'modern electronics showcase', fallback: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&q=80' },
  { id: 'inspiration-4', query: 'boutique fashion store interior', fallback: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=600&fit=crop&q=80' },
  { id: 'inspiration-5', query: 'gourmet food presentation', fallback: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop&q=80' },
  { id: 'inspiration-6', query: 'cozy coffee shop counter', fallback: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&q=80' },
];

type ApiCategory = {
  name: string;
  slug: string;
  icon?: string | null;
};

export default function HomePage() {
  const { searchQuery, setSearchQuery } = useSearch();
  const { addToCart } = useCartStore();
  const { success } = useToastContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState<{ sort: string; minPrice?: number; maxPrice?: number }>({ sort: 'popularity' });
  const [heroSlides, setHeroSlides] = useState(defaultHeroSlides);
  const [quickLinks, setQuickLinks] = useState(defaultQuickLinks);
  const [inspirationImages, setInspirationImages] = useState(inspirationQueries.map((item) => ({ id: item.id, url: item.fallback, alt: item.query })));

  // Supabase'den kategorileri çek
  const [categories, setCategories] = useState<Array<{ name: string; slug: string; icon: string; image: string }>>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadVisuals = async () => {
      try {
        const updatedSlides = await Promise.all(
          defaultHeroSlides.map(async (slide) => ({
            ...slide,
            image: await fetchUnsplashImage(slide.unsplashQuery, slide.image),
          })),
        );

        const updatedQuickLinks = await Promise.all(
          defaultQuickLinks.map(async (link) => ({
            ...link,
            image: await fetchUnsplashImage(link.unsplashQuery, link.image, 'squarish'),
          })),
        );

        const inspiration = await Promise.all(
          inspirationQueries.map(async (item) => ({
            id: item.id,
            url: await fetchUnsplashImage(item.query, item.fallback),
            alt: item.query,
          })),
        );

        if (active) {
          setHeroSlides(updatedSlides);
          setQuickLinks(updatedQuickLinks);
          setInspirationImages(inspiration);
        }
      } catch (error) {
        console.warn('Unsplash visuals yüklenemedi:', error);
      }
    };

    loadVisuals();

    return () => {
      active = false;
    };
  }, []);

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
        const formattedCategories = Array.isArray(categoriesData)
          ? await Promise.all(
              (categoriesData as ApiCategory[]).map(async (cat) => {
                const fallback =
                  cat.slug === 'elektronik'
                    ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&q=80'
                    : cat.slug === 'moda'
                    ? 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80'
                    : cat.slug === 'spor'
                    ? 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1585386959984-a41552265aba?w=400&h=400&fit=crop&q=80';

                return {
                  name: cat.name,
                  slug: cat.slug,
                  icon: cat.icon || '📦',
                  image: await fetchUnsplashImage(`${cat.name} products`, fallback, 'squarish'),
                };
              }),
            )
          : [];

        setCategories(formattedCategories);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
        // Fallback kategoriler
        setCategories([
          { name: 'Elektronik', slug: 'elektronik', icon: '💻', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop&q=80' },
          { name: 'Moda', slug: 'moda', icon: '👔', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80' },
          { name: 'Ev & Yaşam', slug: 'ev-yasam', icon: '🏠', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop&q=80' },
          { name: 'Spor', slug: 'spor', icon: '⚽', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80' },
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
  }, [heroSlides.length]);

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

      {/* Beta / Development Notice */}
      <section className="bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-blue-800">Platform Geliştirme Aşamasında</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Kep Marketplace şu anda beta aşamasındadır. Gösterilen ürünler demo amaçlıdır ve gerçek satış işlemi yapılmamaktadır. Platforma yakında gerçek ürünler eklenecektir.</p>
                </div>
              </div>
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
                {categories.map((category, index) => (
                  <Link key={category.slug || `${category.name}-${index}`} href={`/category/${category.slug}`} className="flex-shrink-0 flex flex-col items-center gap-3 group">
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
      <section className="py-10 bg-gray-50 border-b-4 border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link) => (
              <Link key={link.id} href={link.link} className="group relative overflow-hidden rounded-2xl shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${link.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-80 group-hover:opacity-90 transition-opacity`} />
                <div className="relative p-6 text-white space-y-3">
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold">
                    <span>#{link.id.toString().padStart(2, '0')}</span>
                    <span className="text-white/80">Kep Öneriyor</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-1">{link.title}</h3>
                    <p className="text-sm text-white/80">{link.subtitle}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <span>Daha Fazla</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Inspiration Gallery */}
      <section className="bg-gray-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white">İlham Köşesi</h2>
              <p className="text-gray-300 mt-2 max-w-2xl">Kep ekosistemindeki işletmelerden ilham verici kareleri keşfedin. Vitrininizi tasarlarken bu referanslardan yararlanın.</p>
            </div>
            <Link href="/stories" className="text-sm font-semibold text-orange-400 hover:text-orange-300 transition">
              Daha Fazla Hikâye →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspirationImages.map((item, idx) => (
              <div key={item.id} className="relative group overflow-hidden rounded-3xl shadow-xl border border-white/10 h-64 sm:h-72">
                <Image src={item.url} alt={item.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between text-white">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-orange-300">Hikâye {idx + 1}</p>
                    <h3 className="text-lg font-semibold mt-1 capitalize">{item.alt}</h3>
                  </div>
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur border border-white/30">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 7l5 5-5 5" />
                    </svg>
                  </span>
                </div>
              </div>
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
