-- ============================================
-- UPDATE EXISTING SCHEMA - Mevcut verileri korur
-- ============================================

-- Mevcut politikaları kaldır
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to view their own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON profiles;
DROP POLICY IF EXISTS "Profiles access policy" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Only admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Categories access policy" ON categories;

DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Sellers can insert their own products" ON products;
DROP POLICY IF EXISTS "Sellers can update their own products" ON products;
DROP POLICY IF EXISTS "Sellers can delete their own products" ON products;
DROP POLICY IF EXISTS "Products access policy" ON products;

DROP POLICY IF EXISTS "Restaurants are viewable by everyone" ON restaurants;
DROP POLICY IF EXISTS "Sellers can manage their restaurants" ON restaurants;
DROP POLICY IF EXISTS "Restaurants access policy" ON restaurants;

DROP POLICY IF EXISTS "Customers can view their own orders" ON orders;
DROP POLICY IF EXISTS "Sellers can view their orders" ON orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Customers can create orders" ON orders;
DROP POLICY IF EXISTS "Sellers can update their orders" ON orders;
DROP POLICY IF EXISTS "Orders access policy" ON orders;

DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON reviews;
DROP POLICY IF EXISTS "Customers can create reviews" ON reviews;
DROP POLICY IF EXISTS "Reviews access policy" ON reviews;

-- Yeni optimize edilmiş politikaları oluştur
-- Profiles
CREATE POLICY "Profiles access policy"
  ON profiles FOR ALL
  USING (true)
  WITH CHECK ((select auth.uid()) = id);

-- Categories  
CREATE POLICY "Categories access policy"
  ON categories FOR ALL
  USING (
    is_active = true OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Products
CREATE POLICY "Products access policy"
  ON products FOR ALL
  USING (
    is_active = true OR
    (select auth.uid()) = seller_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    (select auth.uid()) = seller_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role IN ('seller', 'admin')
    )
  );

-- Restaurants
CREATE POLICY "Restaurants access policy"
  ON restaurants FOR ALL
  USING (
    is_active = true OR
    (select auth.uid()) = seller_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    (select auth.uid()) = seller_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Orders
CREATE POLICY "Orders access policy"
  ON orders FOR ALL
  USING (
    (select auth.uid()) = customer_id OR
    (select auth.uid()) = seller_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    (select auth.uid()) = customer_id OR
    (select auth.uid()) = seller_id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = (select auth.uid())
      AND profiles.role = 'admin'
    )
  );

-- Reviews
CREATE POLICY "Reviews access policy"
  ON reviews FOR ALL
  USING (true)
  WITH CHECK ((select auth.uid()) = customer_id);

-- Fonksiyonları güvenlik ayarlarıyla güncelle
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
