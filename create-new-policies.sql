-- ============================================
-- CREATE NEW OPTIMIZED POLICIES - Yeni politikaları oluştur
-- ============================================

-- Profiles politikası
CREATE POLICY "Profiles access policy"
  ON profiles FOR ALL
  USING (true)
  WITH CHECK ((select auth.uid()) = id);

-- Categories politikası
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

-- Products politikası
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

-- Restaurants politikası
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

-- Menu items politikası
CREATE POLICY "Menu items access policy"
  ON menu_items FOR ALL
  USING (is_available = true);

-- Orders politikası
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

-- Reviews politikası
CREATE POLICY "Reviews access policy"
  ON reviews FOR ALL
  USING (true)
  WITH CHECK ((select auth.uid()) = customer_id);









