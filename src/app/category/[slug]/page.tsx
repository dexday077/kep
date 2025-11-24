'use client';

import ProductCard from '@/components/ProductCard';
import { type Filters } from '@/components/FiltersBar';
import { ProductCardSkeleton } from '@/components/SkeletonLoader';
import { useMemo, useState, useEffect } from 'react';
import { useSearch } from '@/context/SearchContext';
import { useParams } from 'next/navigation';
import { ApiService } from '@/lib/api';
import Link from 'next/link';

const demoProducts = [
  {
    id: '1',
    title: 'Kablosuz Kulaklık Pro X',
    price: 1899,
    image: '/window.svg',
    rating: 4.6,
    badge: 'Öne Çıkan',
    category: 'Elektronik',
  },
  {
    id: '2',
    title: 'Akıllı Saat S3',
    price: 2399,
    image: '/globe.svg',
    rating: 4.4,
    category: 'Moda',
  },
  {
    id: '3',
    title: 'Bluetooth Hoparlör Mini',
    price: 749,
    image: '/file.svg',
    rating: 4.2,
    category: 'Ev & Yaşam',
  },
  {
    id: '4',
    title: 'Oyun Mouse RGB',
    price: 499,
    image: '/next.svg',
    rating: 4.1,
    category: 'Elektronik',
  },
  {
    id: '5',
    title: 'USB-C Hızlı Şarj Adaptörü',
    price: 329,
    image: '/vercel.svg',
    rating: 4.7,
    category: 'Elektronik',
  },
  {
    id: '6',
    title: 'Mikrofon Condenser M1',
    price: 1299,
    image: '/globe.svg',
    rating: 4.5,
    category: 'Elektronik',
  },
  {
    id: '7',
    title: 'Gaming Klavye Mekanik',
    price: 899,
    image: '/window.svg',
    rating: 4.3,
    category: 'Elektronik',
  },
  {
    id: '8',
    title: 'Laptop Stand Alüminyum',
    price: 459,
    image: '/file.svg',
    rating: 4.8,
    category: 'Elektronik',
  },
  {
    id: '9',
    title: 'Kahve Makinesi Otomatik',
    price: 3499,
    image: '/globe.svg',
    rating: 4.6,
    category: 'Ev & Yaşam',
  },
  {
    id: '10',
    title: 'Spor Ayakkabı Running',
    price: 1299,
    image: '/next.svg',
    rating: 4.4,
    category: 'Spor',
  },
  {
    id: '11',
    title: 'Akıllı Telefon Kılıfı',
    price: 149,
    image: '/vercel.svg',
    rating: 4.2,
    category: 'Elektronik',
  },
  {
    id: '12',
    title: 'Fitness Eldiveni',
    price: 89,
    image: '/window.svg',
    rating: 4.5,
    category: 'Spor',
  },
  {
    id: '13',
    title: 'Kozmetik Set Premium',
    price: 899,
    image: '/file.svg',
    rating: 4.7,
    category: 'Kozmetik',
  },
  {
    id: '14',
    title: 'Çocuk Oyuncağı Eğitici',
    price: 299,
    image: '/globe.svg',
    rating: 4.3,
    category: 'Oyuncak',
  },
  {
    id: '15',
    title: 'Kitap Roman Klasik',
    price: 79,
    image: '/next.svg',
    rating: 4.8,
    category: 'Kitap',
  },
  {
    id: '16',
    title: 'Araba Temizlik Seti',
    price: 199,
    image: '/vercel.svg',
    rating: 4.4,
    category: 'Otomotiv',
  },
  {
    id: '17',
    title: 'Erkek Tişört Pamuk',
    price: 249,
    image: '/window.svg',
    rating: 4.2,
    category: 'Moda',
  },
  {
    id: '18',
    title: 'Kadın Çanta Deri',
    price: 1599,
    image: '/file.svg',
    rating: 4.6,
    category: 'Moda',
  },
  {
    id: '19',
    title: 'Bluetooth Kulaklık Sport',
    price: 699,
    image: '/globe.svg',
    rating: 4.1,
    category: 'Elektronik',
  },
  {
    id: '20',
    title: 'Kahve Fincanı Seramik',
    price: 129,
    image: '/next.svg',
    rating: 4.5,
    category: 'Ev & Yaşam',
  },
  {
    id: '21',
    title: 'Bisiklet Kask Güvenlik',
    price: 399,
    image: '/vercel.svg',
    rating: 4.7,
    category: 'Spor',
  },
  {
    id: '22',
    title: 'Makyaj Fırçası Seti',
    price: 179,
    image: '/window.svg',
    rating: 4.4,
    category: 'Kozmetik',
  },
  {
    id: '23',
    title: 'Puzzle 1000 Parça',
    price: 159,
    image: '/file.svg',
    rating: 4.6,
    category: 'Oyuncak',
  },
  {
    id: '24',
    title: 'Motivasyon Kitabı',
    price: 89,
    image: '/globe.svg',
    rating: 4.8,
    category: 'Kitap',
  },
  {
    id: '25',
    title: 'Araba Kokusu Premium',
    price: 69,
    image: '/next.svg',
    rating: 4.3,
    category: 'Otomotiv',
  },
  {
    id: '26',
    title: 'Kadın Sweatshirt Hoodie',
    price: 449,
    image: '/vercel.svg',
    rating: 4.5,
    category: 'Moda',
  },
  {
    id: '27',
    title: 'Erkek Jean Pantolon',
    price: 599,
    image: '/window.svg',
    rating: 4.2,
    category: 'Moda',
  },
  {
    id: '28',
    title: 'Tablet Stand Ayarlanabilir',
    price: 279,
    image: '/file.svg',
    rating: 4.6,
    category: 'Elektronik',
  },
  {
    id: '29',
    title: 'Çay Demleme Seti',
    price: 329,
    image: '/globe.svg',
    rating: 4.7,
    category: 'Ev & Yaşam',
  },
  {
    id: '30',
    title: 'Yoga Matı Premium',
    price: 199,
    image: '/next.svg',
    rating: 4.4,
    category: 'Spor',
  },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = String(params?.slug ?? '');
  const [filters, setFilters] = useState<Filters>({ sort: 'popularity' });
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [fastDelivery, setFastDelivery] = useState<boolean>(false);
  const [advantageousProducts, setAdvantageousProducts] = useState<boolean>(false);
  const { searchQuery } = useSearch();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Supabase'den kategorileri ve ürünleri çek
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [categoryProductsMap, setCategoryProductsMap] = useState<{ [key: number]: { products: any[], count: number } }>({});
  const [categoryProductsLoading, setCategoryProductsLoading] = useState<{ [key: number]: boolean }>({});

  // Kategorileri yükle ve her kategori için ürün sayısını/örnekleri çek
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const categoriesData = await ApiService.getCategories();
        setCategories(categoriesData);

        // Her kategori için ürün sayısı ve örnek ürünleri çek
        if (categoriesData && categoriesData.length > 0) {
          const productsMap: { [key: number]: { products: any[], count: number } } = {};
          const loadingMap: { [key: number]: boolean } = {};

          // Tüm kategoriler için ürünleri paralel olarak yükle
          const productPromises = categoriesData.map(async (cat: any) => {
            loadingMap[cat.id] = true;
            try {
              // Kategori slug'ına göre ürünleri filtrele
              const productsData = await ApiService.getProducts({
                category: cat.slug,
                limit: 4, // Her kategori için 4 örnek ürün
              });
              
              productsMap[cat.id] = {
                products: productsData.data || [],
                count: productsData.count || 0,
              };
            } catch (error) {
              console.error(`Kategori ${cat.name} için ürünler yüklenirken hata:`, error);
              productsMap[cat.id] = { products: [], count: 0 };
            } finally {
              loadingMap[cat.id] = false;
            }
          });

          await Promise.all(productPromises);
          setCategoryProductsMap(productsMap);
          setCategoryProductsLoading(loadingMap);
        }
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Ürünleri yükle
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const productsData = await ApiService.getProducts({
          category: slug === 'all' ? undefined : slug,
          limit: 50,
        });
        setProducts(productsData.data || []);
      } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [slug]);

  // Kategori bilgisini veritabanından al veya "all" için özel objeyi oluştur
  const category = slug === 'all' 
    ? { title: 'Tüm Kategoriler', name: 'Tüm Kategoriler' } 
    : categories.find((cat) => cat.slug === slug);

  // Simulate initial loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [slug]);

  const filtered = useMemo(() => {
    if (!category) return [];
    let list = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      list = list.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Apply price filters
    if (filters.minPrice != null) list = list.filter((p) => p.price >= (filters.minPrice as number));
    if (filters.maxPrice != null) list = list.filter((p) => p.price <= (filters.maxPrice as number));

    // Apply sorting
    if (filters.sort === 'popularity') {
      list.sort((a, b) => {
        if (a.rating !== b.rating) return (b.rating || 0) - (a.rating || 0);
        return a.price - b.price;
      });
    }
    if (filters.sort === 'priceAsc') list.sort((a, b) => a.price - b.price);
    if (filters.sort === 'priceDesc') list.sort((a, b) => b.price - a.price);

    return list;
  }, [filters, searchQuery, category, products]);

  if (!category && !categoriesLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategori bulunamadı</h1>
          <Link href="/" className="text-orange-600 hover:text-orange-700">
            Ana sayfaya dön
          </Link>
        </div>
      </div>
    );
  }

  // "all" kategorisi için özel görünüm
  if (slug === 'all') {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Tüm Kategoriler</h1>
            <p className="text-gray-600">Kategorilerimizi keşfedin</p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              {categories.length > 0 ? (
                categories.map((cat) => {
                  // Kategori için icon belirle (slug'a göre)
                  const getCategoryIcon = (slug: string) => {
                    const iconMap: { [key: string]: string } = {
                      'elektronik': '💻',
                      'moda': '👔',
                      'ev-yasam': '🏠',
                      'spor': '⚽',
                      'kozmetik': '💄',
                      'kadin': '👗',
                      'erkek': '👔',
                      'anne-cocuk': '👶',
                      'supermarket': '🛒',
                      'ayakkabi-canta': '👜',
                    };
                    return iconMap[slug.toLowerCase()] || '📦';
                  };

                  const categoryIcon = getCategoryIcon(cat.slug || '');
                  const categoryImage = cat.image_url || null;
                  const categoryProducts = categoryProductsMap[cat.id] || { products: [], count: 0 };
                  const isLoadingCategoryProducts = categoryProductsLoading[cat.id] || false;
                  
                  return (
                    <div key={cat.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      {/* Kategori Header */}
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl flex-shrink-0 ${
                                categoryImage 
                                  ? 'bg-cover bg-center' 
                                  : 'bg-gradient-to-br from-orange-500 to-red-500'
                              }`}
                              style={categoryImage ? { backgroundImage: `url(${categoryImage})` } : {}}
                            >
                              {!categoryImage && (
                                <span className="text-white drop-shadow-lg">{categoryIcon}</span>
                              )}
                            </div>
                            <div>
                              <Link href={`/category/${cat.slug}`}>
                                <h3 className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors">
                                  {cat.name}
                                </h3>
                              </Link>
                              {cat.description && (
                                <p className="text-sm text-gray-500 mt-1">{cat.description}</p>
                              )}
                              <div className="mt-2 text-sm text-gray-600">
                                <span className="font-semibold text-orange-600">{categoryProducts.count}</span>
                                <span className="text-gray-500"> ürün</span>
                              </div>
                            </div>
                          </div>
                          <Link
                            href={`/category/${cat.slug}`}
                            className="px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          >
                            Tümünü Gör →
                          </Link>
                        </div>
                      </div>

                      {/* Kategori Ürünleri */}
                      <div className="p-6">
                        {isLoadingCategoryProducts ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <ProductCardSkeleton key={i} />
                            ))}
                          </div>
                        ) : categoryProducts.products.length > 0 ? (
                          <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                              {categoryProducts.products.map((product: any) => (
                                <ProductCard key={product.id} product={product} />
                              ))}
                            </div>
                            {categoryProducts.count > categoryProducts.products.length && (
                              <div className="mt-4 text-center">
                                <Link
                                  href={`/category/${cat.slug}`}
                                  className="inline-block px-6 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                >
                                  {categoryProducts.count - categoryProducts.products.length} ürün daha göster
                                </Link>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-sm">Bu kategoride henüz ürün bulunmuyor</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4">📂</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz kategori eklenmemiş</h3>
                  <p className="text-gray-600 mb-4">Kategoriler yüklendiğinde burada görünecek</p>
                  <Link href="/" className="text-orange-600 hover:text-orange-700 font-semibold">
                    Ana sayfaya dön
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-6">
              {/* Category Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Kategori</h3>
                <div className="space-y-2">
                  <div className="font-medium text-blue-600">{category?.name || category?.title}</div>
                  {category?.description && (
                    <p className="text-sm text-gray-600">{category.description}</p>
                  )}
                </div>
              </div>

              {/* Fast Delivery */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Hızlı Teslimat</h3>
                <label className="flex items-center">
                  <input type="checkbox" checked={fastDelivery} onChange={(e) => setFastDelivery(e.target.checked)} className="mr-2" />
                  <span className="text-sm text-gray-600">Aynı gün teslimat</span>
                </label>
              </div>

              {/* Advantageous Products */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Avantajlı Ürünler</h3>
                <label className="flex items-center">
                  <input type="checkbox" checked={advantageousProducts} onChange={(e) => setAdvantageousProducts(e.target.checked)} className="mr-2" />
                  <span className="text-sm text-gray-600">Kampanyalı ürünler</span>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                  {category?.name || category?.title} ({filtered.length}+ ürün)
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sırala:</span>
                  <select
                    value={filters.sort}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        sort: e.target.value as Filters['sort'],
                      })
                    }
                    className="px-3 py-1 border border-gray-200 rounded-md text-sm"
                  >
                    <option value="popularity">Önerilen sıralama</option>
                    <option value="priceAsc">Fiyat: En ucuz</option>
                    <option value="priceDesc">Fiyat: En Pahalı</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {productsLoading ? Array.from({ length: 10 }).map((_, index) => <ProductCardSkeleton key={index} />) : filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {!productsLoading && filtered.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Ürün bulunamadı</h3>
                  <p className="text-gray-600 mb-4">Bu kategoride henüz ürün bulunmuyor</p>
                  <Link href="/category/all" className="text-orange-600 hover:text-orange-700 font-semibold">
                    Tüm kategorileri görüntüle
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
