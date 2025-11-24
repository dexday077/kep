// Kategorileri Supabase'e eklemek için script
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dvhvdimqdurafisszswk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Service role key varsa onu kullan (RLS'i bypass eder), yoksa anon key kullan
const supabaseKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseKey) {
  console.error('❌ SUPABASE_ANON_KEY veya SUPABASE_SERVICE_ROLE_KEY bulunamadı! .env.local dosyasını kontrol edin.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function addCategories() {
  try {
    console.log('🚀 Kategoriler ekleniyor...\n');

    // Önce tenant'ı kontrol et veya oluştur
    const defaultTenantId = '00000000-0000-0000-0000-000000000001';
    const { data: existingTenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('id', defaultTenantId)
      .single();

    if (!existingTenant) {
      console.log('📝 Tenant oluşturuluyor...');
      const { error: tenantError } = await supabase
        .from('tenants')
        .insert({
          id: defaultTenantId,
          name: 'KEP Marketplace',
          slug: 'kep-marketplace',
          is_active: true
        });

      if (tenantError) {
        console.error('❌ Tenant oluşturma hatası:', tenantError.message);
      } else {
        console.log('✅ Tenant oluşturuldu\n');
      }
    }

    // Kategoriler (veritabanı şemasına uygun - id auto increment)
    const categories = [
      {
        name: 'Elektronik',
        slug: 'elektronik',
        description: 'Bilgisayar, telefon, tablet ve diğer elektronik ürünler'
      },
      {
        name: 'Moda',
        slug: 'moda',
        description: 'Giyim, ayakkabı, çanta ve moda aksesuarları'
      },
      {
        name: 'Ev & Yaşam',
        slug: 'ev-yasam',
        description: 'Mobilya, dekorasyon, mutfak ve ev eşyaları'
      },
      {
        name: 'Spor & Outdoor',
        slug: 'spor-outdoor',
        description: 'Spor malzemeleri, fitness ürünleri ve outdoor ekipmanlar'
      },
      {
        name: 'Kozmetik',
        slug: 'kozmetik',
        description: 'Kozmetik ürünleri, kişisel bakım ve güzellik'
      },
      {
        name: 'Kadın',
        slug: 'kadin',
        description: 'Kadın giyim, ayakkabı ve aksesuar'
      },
      {
        name: 'Erkek',
        slug: 'erkek',
        description: 'Erkek giyim, ayakkabı ve aksesuar'
      },
      {
        name: 'Anne & Çocuk',
        slug: 'anne-cocuk',
        description: 'Bebek ve çocuk ürünleri, anne bakım ürünleri'
      },
      {
        name: 'Süpermarket',
        slug: 'supermarket',
        description: 'Gıda, içecek ve günlük ihtiyaç ürünleri'
      },
      {
        name: 'Ayakkabı & Çanta',
        slug: 'ayakkabi-canta',
        description: 'Ayakkabı, çanta ve aksesuar'
      },
      {
        name: 'Kitap & Hobi',
        slug: 'kitap-hobi',
        description: 'Kitap, dergi, hobi malzemeleri ve oyuncak'
      },
      {
        name: 'Otomotiv',
        slug: 'otomotiv',
        description: 'Araba aksesuarları, bakım ürünleri ve yedek parçalar'
      }
    ];

    console.log(`📂 ${categories.length} kategori ekleniyor...\n`);

    for (const category of categories) {
      const { data, error } = await supabase
        .from('categories')
        .upsert({
          name: category.name,
          slug: category.slug,
          description: category.description,
          tenant_id: defaultTenantId
        }, {
          onConflict: 'slug'
        });

      if (error) {
        console.error(`❌ "${category.name}" eklenirken hata:`, error.message);
      } else {
        console.log(`✅ "${category.name}" eklendi (slug: ${category.slug})`);
      }
    }

    console.log('\n🎉 Kategoriler başarıyla eklendi!');
    console.log('\n📋 Eklenen Kategoriler:');
    categories.forEach(cat => {
      console.log(`   • ${cat.name} (/${cat.slug})`);
    });

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

addCategories();

