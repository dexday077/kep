# 🚀 Adım 1: Supabase Projesi Kurulumu

## 📋 **Görevler**

### ✅ **1.1 Supabase Hesabı Oluşturma**

1. [Supabase.com](https://supabase.com) adresine git
2. "Start your project" butonuna tıkla
3. GitHub ile giriş yap (önerilen)
4. Email doğrulama yap

### ✅ **1.2 Yeni Proje Oluşturma**

1. Dashboard'da "New Project" butonuna tıkla
2. **Proje Bilgileri:**

   - **Name**: `kep-marketplace`
   - **Database Password**: Güçlü bir şifre oluştur (kaydet!)
   - **Region**: `Europe West (Frankfurt)` - Türkiye'ye en yakın
   - **Pricing Plan**: `Free` (başlangıç için)

3. "Create new project" butonuna tıkla
4. Proje oluşturma işlemi 2-3 dakika sürer

### ✅ **1.3 Proje Bilgilerini Not Etme**

Proje oluştuktan sonra şu bilgileri not et:

```
Project URL: https://[project-id].supabase.co
Project ID: [project-id]
Database Password: [oluşturduğun-şifre]
```

### ✅ **1.4 API Keys Alma**

1. Sol menüden **Settings** > **API** seç
2. Şu bilgileri not et:

```
Project URL: https://[project-id].supabase.co
anon public: [anon-key]
service_role: [service-role-key] (GİZLİ!)
```

### ✅ **1.5 Environment Variables Ayarlama**

Proje kök dizininde `.env.local` dosyası oluştur:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# Database
DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=KEP Marketplace
```

### ✅ **1.6 Supabase CLI Kurulumu**

Terminal'de şu komutları çalıştır:

```bash
# Supabase CLI kur
npm install -g supabase

# Versiyonu kontrol et
supabase --version

# Projeyi link et
supabase link --project-ref [project-id]

# Login ol
supabase login
```

### ✅ **1.7 İlk Test**

Supabase Dashboard'da:

1. **Table Editor** > **New Table** tıkla
2. Test tablosu oluştur:

   - **Name**: `test_table`
   - **Columns**:
     - `id` (int8, primary key, auto-increment)
     - `name` (text)
     - `created_at` (timestamptz, default: now())

3. Birkaç test kaydı ekle
4. **API** > **REST** bölümünden API'yi test et

## ✅ **Doğrulama Checklist**

- [ ] Supabase hesabı oluşturuldu
- [ ] Proje oluşturuldu (kep-marketplace)
- [ ] Region: Europe West (Frankfurt) seçildi
- [ ] API keys alındı ve not edildi
- [ ] `.env.local` dosyası oluşturuldu
- [ ] Supabase CLI kuruldu ve link edildi
- [ ] Test tablosu oluşturuldu ve API test edildi

## 🎯 **Sonraki Adım**

✅ Bu adım tamamlandıktan sonra **Adım 2: Database Schema Oluşturma**'ya geç.

## 🆘 **Sorun Giderme**

### Problem: Proje oluşturulamıyor

**Çözüm**:

- Farklı bir proje adı dene
- Region'ı değiştir
- Supabase status sayfasını kontrol et

### Problem: CLI link çalışmıyor

**Çözüm**:

```bash
# Token'ı yenile
supabase logout
supabase login

# Manuel link
supabase link --project-ref [project-id] --password [db-password]
```

### Problem: API keys bulunamıyor

**Çözüm**:

- Settings > API sayfasına git
- Proje seçili olduğundan emin ol
- Sayfayı yenile










