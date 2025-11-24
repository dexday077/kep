// Mega menu kategorilerini Supabase'e eklemek için script
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

async function addMegaMenuCategories() {
  try {
    console.log('🚀 Mega menu kategorileri ekleniyor...\n');

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

    // Mega menu kategori yapısı (Navbar.tsx'ten)
    const megaMenuCategories = [
      {
        title: 'Kadın',
        slug: 'kadin',
        subcategories: [
          {
            groupTitle: 'Giyim',
            items: [
              { name: 'Elbise', slug: 'kadin-elbise' },
              { name: 'Tişört', slug: 'kadin-tisort' },
              { name: 'Gömlek', slug: 'kadin-gomlek' },
              { name: 'Kot Pantolon', slug: 'kadin-kot-pantolon' },
              { name: 'Kot Ceket', slug: 'kadin-kot-ceket' },
              { name: 'Pantolon', slug: 'kadin-pantolon' },
              { name: 'Mont', slug: 'kadin-mont' },
              { name: 'Bluz', slug: 'kadin-bluz' },
              { name: 'Ceket', slug: 'kadin-ceket' },
              { name: 'Etek', slug: 'kadin-etek' },
              { name: 'Kazak', slug: 'kadin-kazak' },
              { name: 'Tesettür', slug: 'kadin-tesettur' },
              { name: 'Büyük Beden', slug: 'kadin-buyuk-beden' },
              { name: 'Trençkot', slug: 'kadin-trenckot' },
              { name: 'Yağmurluk & Rüzgarlık', slug: 'kadin-yagmurluk' },
              { name: 'Sweatshirt', slug: 'kadin-sweatshirt' },
              { name: 'Kaban', slug: 'kadin-kaban' },
              { name: 'Hırka', slug: 'kadin-hirka' },
            ],
          },
          {
            groupTitle: 'Ayakkabı',
            items: [
              { name: 'Topuklu Ayakkabı', slug: 'kadin-topuklu' },
              { name: 'Sneaker', slug: 'kadin-sneaker' },
              { name: 'Günlük Ayakkabı', slug: 'kadin-gunluk-ayakkabi' },
              { name: 'Babet', slug: 'kadin-babet' },
              { name: 'Sandalet', slug: 'kadin-sandalet' },
              { name: 'Bot', slug: 'kadin-bot' },
              { name: 'Çizme', slug: 'kadin-cizme' },
            ],
          },
          {
            groupTitle: 'Çanta & Aksesuar',
            items: [
              { name: 'Çanta', slug: 'kadin-canta' },
              { name: 'Saat', slug: 'kadin-saat' },
              { name: 'Takı', slug: 'kadin-taki' },
              { name: 'Cüzdan', slug: 'kadin-cuzdan' },
              { name: 'Şal', slug: 'kadin-sal' },
              { name: 'Şapka', slug: 'kadin-sapka' },
            ],
          },
        ],
      },
      {
        title: 'Erkek',
        slug: 'erkek',
        subcategories: [
          {
            groupTitle: 'Giyim',
            items: [
              { name: 'Tişört', slug: 'erkek-tisort' },
              { name: 'Gömlek', slug: 'erkek-gomlek' },
              { name: 'Kot Pantolon', slug: 'erkek-kot-pantolon' },
              { name: 'Pantolon', slug: 'erkek-pantolon' },
              { name: 'Mont', slug: 'erkek-mont' },
              { name: 'Ceket', slug: 'erkek-ceket' },
              { name: 'Kazak', slug: 'erkek-kazak' },
              { name: 'Sweatshirt', slug: 'erkek-sweatshirt' },
              { name: 'Hoodie', slug: 'erkek-hoodie' },
              { name: 'Eşofman', slug: 'erkek-esofman' },
              { name: 'Kısa Kollu', slug: 'erkek-kisa-kollu' },
              { name: 'Uzun Kollu', slug: 'erkek-uzun-kollu' },
            ],
          },
          {
            groupTitle: 'Ayakkabı',
            items: [
              { name: 'Spor Ayakkabı', slug: 'erkek-spor-ayakkabi' },
              { name: 'Klasik Ayakkabı', slug: 'erkek-klasik' },
              { name: 'Bot', slug: 'erkek-bot' },
              { name: 'Sandalet', slug: 'erkek-sandalet' },
              { name: 'Terlik', slug: 'erkek-terlik' },
            ],
          },
        ],
      },
      {
        title: 'Anne & Çocuk',
        slug: 'anne-cocuk',
        subcategories: [
          {
            groupTitle: 'Bebek',
            items: [
              { name: 'Bebek Giyim', slug: 'bebek-giyim' },
              { name: 'Bebek Bezi', slug: 'bebek-bezi' },
              { name: 'Bebek Bakım', slug: 'bebek-bakim' },
              { name: 'Bebek Arabası', slug: 'bebek-arabasi' },
            ],
          },
          {
            groupTitle: 'Çocuk',
            items: [
              { name: 'Çocuk Giyim', slug: 'cocuk-giyim' },
              { name: 'Çocuk Ayakkabı', slug: 'cocuk-ayakkabi' },
              { name: 'Oyuncak', slug: 'oyuncak' },
              { name: 'Okul Çantası', slug: 'okul-cantasi' },
            ],
          },
        ],
      },
      {
        title: 'Ev & Yaşam',
        slug: 'ev-yasam',
        subcategories: [
          {
            groupTitle: 'Mobilya',
            items: [
              { name: 'Yatak Odası', slug: 'yatak-odasi' },
              { name: 'Oturma Odası', slug: 'oturma-odasi' },
              { name: 'Yemek Odası', slug: 'yemek-odasi' },
              { name: 'Ofis Mobilyası', slug: 'ofis-mobilyasi' },
            ],
          },
          {
            groupTitle: 'Ev Tekstili',
            items: [
              { name: 'Yatak Takımları', slug: 'yatak-takimlari' },
              { name: 'Perde', slug: 'perde' },
              { name: 'Halı', slug: 'hali' },
              { name: 'Nevresim', slug: 'nevresim' },
            ],
          },
          {
            groupTitle: 'Mutfak',
            items: [
              { name: 'Tencere & Tava', slug: 'tencere-tava' },
              { name: 'Bardak', slug: 'bardak' },
              { name: 'Tabak', slug: 'tabak' },
              { name: 'Mutfak Gereçleri', slug: 'mutfak-gerecleri' },
            ],
          },
        ],
      },
      {
        title: 'Süpermarket',
        slug: 'supermarket',
        subcategories: [
          {
            groupTitle: 'Gıda',
            items: [
              { name: 'Kahvaltılık', slug: 'kahvaltilik' },
              { name: 'İçecek', slug: 'icecek' },
              { name: 'Atıştırmalık', slug: 'atistirmalik' },
              { name: 'Konserve', slug: 'konserve' },
            ],
          },
        ],
      },
      {
        title: 'Kozmetik',
        slug: 'kozmetik',
        subcategories: [
          {
            groupTitle: 'Kozmetik',
            items: [
              { name: 'Parfüm', slug: 'parfum' },
              { name: 'Göz Makyajı', slug: 'goz-makyaji' },
              { name: 'Cilt Bakım', slug: 'cilt-bakim' },
              { name: 'Saç Bakımı', slug: 'sac-bakimi' },
              { name: 'Makyaj', slug: 'makyaj' },
              { name: 'Ağız Bakım', slug: 'agiz-bakim' },
              { name: 'Vücut Bakım', slug: 'vucut-bakim' },
              { name: 'Duş Jeli & Kremleri', slug: 'dus-jeli-kremleri' },
              { name: 'Epilasyon Ürünleri', slug: 'epilasyon-urunleri' },
              { name: 'Ruj', slug: 'ruj' },
              { name: 'Dudak Nemlendirici', slug: 'dudak-nemlendirici' },
              { name: 'Aydınlatıcı & Highlighter', slug: 'aydinlatici-highlighter' },
              { name: 'Eyeliner', slug: 'eyeliner' },
              { name: 'Ten Makyajı', slug: 'ten-makyaji' },
              { name: 'Manikür & Pedikür', slug: 'manikur-pedikur' },
              { name: 'BB & CC Krem', slug: 'bb-cc-krem' },
            ],
          },
        ],
      },
      {
        title: 'Ayakkabı & Çanta',
        slug: 'ayakkabi-canta',
        subcategories: [
          {
            groupTitle: 'Ayakkabı',
            items: [
              { name: 'Topuklu Ayakkabı', slug: 'topuklu-ayakkabi' },
              { name: 'Sneaker', slug: 'sneaker' },
              { name: 'Günlük Ayakkabı', slug: 'gunluk-ayakkabi' },
              { name: 'Babet', slug: 'babet' },
              { name: 'Sandalet', slug: 'sandalet' },
              { name: 'Bot', slug: 'bot' },
              { name: 'Çizme', slug: 'cizme' },
              { name: 'Kar Botu', slug: 'kar-botu' },
              { name: 'Loafer', slug: 'loafer' },
            ],
          },
          {
            groupTitle: 'Çanta',
            items: [
              { name: 'Omuz Çantası', slug: 'omuz-cantasi' },
              { name: 'Sırt Çantası', slug: 'sirt-cantasi' },
              { name: 'Bel Çantası', slug: 'bel-cantasi' },
              { name: 'Okul Çantası', slug: 'okul-cantasi' },
              { name: 'Laptop Çantası', slug: 'laptop-cantasi' },
              { name: 'El Çantası', slug: 'el-cantasi' },
              { name: 'Tote Çanta', slug: 'tote-canta' },
              { name: 'Postacı Çantası', slug: 'postaci-cantasi' },
            ],
          },
        ],
      },
      {
        title: 'Elektronik',
        slug: 'elektronik',
        subcategories: [
          {
            groupTitle: 'Elektronik',
            items: [
              { name: 'Telefon', slug: 'telefon' },
              { name: 'Tablet', slug: 'tablet' },
              { name: 'Laptop', slug: 'laptop' },
              { name: 'Bilgisayar', slug: 'bilgisayar' },
              { name: 'TV', slug: 'tv' },
              { name: 'Kulaklık', slug: 'kulaklik' },
              { name: 'Hoparlör', slug: 'hoparlor' },
              { name: 'Kamera', slug: 'kamera' },
            ],
          },
        ],
      },
    ];

    // Tüm kategorileri topla (ana kategoriler + alt kategoriler)
    const allCategories = [];

    megaMenuCategories.forEach((mainCategory) => {
      // Ana kategori ekle
      allCategories.push({
        name: mainCategory.title,
        slug: mainCategory.slug,
        description: `${mainCategory.title} kategorisi`,
      });

      // Alt kategorileri ekle
      mainCategory.subcategories.forEach((subGroup) => {
        subGroup.items.forEach((item) => {
          allCategories.push({
            name: item.name,
            slug: item.slug,
            description: `${mainCategory.title} - ${subGroup.groupTitle} - ${item.name}`,
          });
        });
      });
    });

    console.log(`📂 ${allCategories.length} kategori ekleniyor...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const category of allCategories) {
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
        errorCount++;
      } else {
        console.log(`✅ "${category.name}" eklendi (slug: ${category.slug})`);
        successCount++;
      }
    }

    console.log('\n🎉 İşlem tamamlandı!');
    console.log(`✅ Başarılı: ${successCount}`);
    console.log(`❌ Hatalı: ${errorCount}`);
    console.log(`📊 Toplam: ${allCategories.length}`);

  } catch (error) {
    console.error('❌ Genel hata:', error);
  }
}

addMegaMenuCategories();


