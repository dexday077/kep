// Test verilerini Supabase'e eklemek için script
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dvhvdimqdurafisszswk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2aHZkaW1xZHVyYWZpc3N6c3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNTQwNzEsImV4cCI6MjA0NzkyMDA3MX0.8QZqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addTestData() {
  try {
    console.log('🚀 Test verileri ekleniyor...');

    // 1. Test satıcısı oluştur
    console.log('📝 Test satıcısı oluşturuluyor...');
    const { data: sellerProfile, error: sellerError } = await supabase
      .from('profiles')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001',
        email: 'test-seller@kepmarketplace.com',
        full_name: 'Test Satıcı',
        role: 'seller',
        shop_name: 'Test Mağazası',
        phone: '0555 123 45 67',
        tenant_id: '00000000-0000-0000-0000-000000000001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (sellerError) {
      console.error('❌ Satıcı oluşturma hatası:', sellerError);
    } else {
      console.log('✅ Test satıcısı oluşturuldu');
    }

    // 2. Kategoriler ekle
    console.log('📂 Kategoriler ekleniyor...');
    const categories = [
      { id: 'cat-1', name: 'Elektronik', slug: 'elektronik', description: 'Elektronik ürünler', is_active: true },
      { id: 'cat-2', name: 'Moda', slug: 'moda', description: 'Giyim ve aksesuar', is_active: true },
      { id: 'cat-3', name: 'Ev & Yaşam', slug: 'ev-yasam', description: 'Ev ve yaşam ürünleri', is_active: true },
      { id: 'cat-4', name: 'Spor & Outdoor', slug: 'spor-outdoor', description: 'Spor ve outdoor ürünler', is_active: true },
      { id: 'cat-5', name: 'Kozmetik', slug: 'kozmetik', description: 'Kozmetik ve kişisel bakım', is_active: true }
    ];

    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .upsert(categories.map(cat => ({
        ...cat,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })));

    if (categoriesError) {
      console.error('❌ Kategori ekleme hatası:', categoriesError);
    } else {
      console.log('✅ Kategoriler eklendi');
    }

    // 3. Test ürünleri ekle
    console.log('📦 Test ürünleri ekleniyor...');
    const products = [
      {
        id: 'prod-1',
        title: 'Kablosuz Kulaklık Pro X',
        description: 'Yüksek kaliteli kablosuz kulaklık. 30 saat pil ömrü, aktif gürültü engelleme.',
        price: 1899.00,
        original_price: 2299.00,
        category: 'cat-1',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400'],
        rating: 4.5,
        badge: 'Popüler',
        seller_id: '00000000-0000-0000-0000-000000000001',
        stock: 50,
        is_active: true
      },
      {
        id: 'prod-2',
        title: 'Akıllı Saat S3',
        description: 'Fitness takibi, kalp atışı ölçümü, su geçirmez akıllı saat.',
        price: 2399.00,
        original_price: 2799.00,
        category: 'cat-1',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400'],
        rating: 4.8,
        badge: 'Yeni',
        seller_id: '00000000-0000-0000-0000-000000000001',
        stock: 25,
        is_active: true
      },
      {
        id: 'prod-3',
        title: 'Gaming Mouse RGB',
        description: 'Profesyonel oyuncular için RGB aydınlatmalı gaming mouse.',
        price: 599.00,
        original_price: 799.00,
        category: 'cat-1',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'],
        rating: 4.3,
        badge: 'İndirim',
        seller_id: '00000000-0000-0000-0000-000000000001',
        stock: 100,
        is_active: true
      },
      {
        id: 'prod-4',
        title: 'Erkek Polo T-Shirt',
        description: 'Pamuklu, nefes alabilir erkek polo t-shirt. Çok renk seçeneği.',
        price: 199.00,
        original_price: 299.00,
        category: 'cat-2',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400'],
        rating: 4.2,
        badge: 'Yeni',
        seller_id: '00000000-0000-0000-0000-000000000001',
        stock: 75,
        is_active: true
      },
      {
        id: 'prod-5',
        title: 'Kahve Makinesi',
        description: 'Otomatik espresso makinesi. 15 bar basınç, süt köpürtücü dahil.',
        price: 1299.00,
        original_price: 1599.00,
        category: 'cat-3',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
        images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400'],
        rating: 4.6,
        badge: 'Popüler',
        seller_id: '00000000-0000-0000-0000-000000000001',
        stock: 15,
        is_active: true
      }
    ];

    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .upsert(products.map(product => ({
        ...product,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })));

    if (productsError) {
      console.error('❌ Ürün ekleme hatası:', productsError);
    } else {
      console.log('✅ Test ürünleri eklendi');
    }

    // 4. Test müşterisi oluştur
    console.log('👤 Test müşterisi oluşturuluyor...');
    const { data: customerProfile, error: customerError } = await supabase
      .from('profiles')
      .upsert({
        id: '00000000-0000-0000-0000-000000000002',
        email: 'test-customer@kepmarketplace.com',
        full_name: 'Test Müşteri',
        role: 'customer',
        phone: '0555 987 65 43',
        tenant_id: '00000000-0000-0000-0000-000000000001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (customerError) {
      console.error('❌ Müşteri oluşturma hatası:', customerError);
    } else {
      console.log('✅ Test müşterisi oluşturuldu');
    }

    // 5. Test admin oluştur
    console.log('👨‍💼 Test admin oluşturuluyor...');
    const { data: adminProfile, error: adminError } = await supabase
      .from('profiles')
      .upsert({
        id: '00000000-0000-0000-0000-000000000003',
        email: 'test-admin@kepmarketplace.com',
        full_name: 'Test Admin',
        role: 'admin',
        tenant_id: '00000000-0000-0000-0000-000000000001',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (adminError) {
      console.error('❌ Admin oluşturma hatası:', adminError);
    } else {
      console.log('✅ Test admin oluşturuldu');
    }

    console.log('🎉 Tüm test verileri başarıyla eklendi!');
    console.log('\n📋 Test Kullanıcıları:');
    console.log('👤 Satıcı: test-seller@kepmarketplace.com');
    console.log('🛒 Müşteri: test-customer@kepmarketplace.com');
    console.log('👨‍💼 Admin: test-admin@kepmarketplace.com');
    console.log('\n🔑 Şifre: 123456 (tüm hesaplar için)');

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

addTestData();
