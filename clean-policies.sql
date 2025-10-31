-- ============================================
-- CLEAN ALL POLICIES - Tüm politikaları temizle
-- ============================================

-- Profiles tablosu politikalarını kaldır
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to view their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles access policy" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;

-- Categories tablosu politikalarını kaldır
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Only admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Categories access policy" ON categories;

-- Products tablosu politikalarını kaldır
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Sellers can insert their own products" ON products;
DROP POLICY IF EXISTS "Sellers can update their own products" ON products;
DROP POLICY IF EXISTS "Sellers can delete their own products" ON products;
DROP POLICY IF EXISTS "Products access policy" ON products;

-- Restaurants tablosu politikalarını kaldır
DROP POLICY IF EXISTS "Restaurants are viewable by everyone" ON restaurants;
DROP POLICY IF EXISTS "Sellers can manage their restaurants" ON restaurants;
DROP POLICY IF EXISTS "Restaurants access policy" ON restaurants;

-- Menu items tablosu politikalarını kaldır
DROP POLICY IF EXISTS "Menu items are viewable by everyone" ON menu_items;

-- Orders tablosu politikalarını kaldır
DROP POLICY IF EXISTS "Customers can view their own orders" ON orders;
DROP POLICY IF EXISTS "Sellers can view their orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Customers can create orders" ON orders;
DROP POLICY IF EXISTS "Sellers can update their orders" ON orders;
DROP POLICY IF EXISTS "Orders access policy" ON orders;

-- Reviews tablosu politikalarını kaldır
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Customers can create reviews" ON reviews;
DROP POLICY IF EXISTS "Reviews access policy" ON reviews;

-- Fonksiyonları güncelle
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;










