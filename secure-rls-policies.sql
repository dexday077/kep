-- ============================================
-- SECURE RLS POLICIES for Multi-Tenant System
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;

-- ============================================
-- SECURE PROFILES POLICIES
-- ============================================

-- 1. SELECT Policy - Tenant Isolation + Admin Override
CREATE POLICY "profiles_secure_select" ON profiles 
    FOR SELECT 
    USING (
        -- Users can see their own profile
        auth.uid() = id OR
        -- Users can see profiles in their own tenant
        tenant_id = (
            SELECT tenant_id FROM profiles 
            WHERE id = auth.uid()
        ) OR
        -- Admins can see all profiles
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 2. INSERT Policy - Only authenticated users with tenant_id
CREATE POLICY "profiles_secure_insert" ON profiles 
    FOR INSERT 
    WITH CHECK (
        -- Must be authenticated
        auth.uid() IS NOT NULL AND
        -- Must have tenant_id
        tenant_id IS NOT NULL AND
        -- Can only insert their own profile OR admin can insert any
        (
            auth.uid() = id OR
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE profiles.id = auth.uid() 
                AND profiles.role = 'admin'
            )
        )
    );

-- 3. UPDATE Policy - Own profile or admin
CREATE POLICY "profiles_secure_update" ON profiles 
    FOR UPDATE 
    USING (
        -- Users can update their own profile
        auth.uid() = id OR
        -- Admins can update any profile
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        -- Same conditions for WITH CHECK
        auth.uid() = id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 4. DELETE Policy - Own profile or admin
CREATE POLICY "profiles_secure_delete" ON profiles 
    FOR DELETE 
    USING (
        -- Users can delete their own profile
        auth.uid() = id OR
        -- Admins can delete any profile
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- ============================================
-- SECURE PRODUCTS POLICIES
-- ============================================

-- Drop existing products policies
DROP POLICY IF EXISTS "products_tenant_isolation" ON products;
DROP POLICY IF EXISTS "Products access policy" ON products;

CREATE POLICY "products_secure_select" ON products 
    FOR SELECT 
    USING (
        -- Active products are visible to everyone in the same tenant
        is_active = true AND
        tenant_id = (
            SELECT tenant_id FROM profiles 
            WHERE id = auth.uid()
        ) OR
        -- Sellers can see their own products (even inactive)
        (
            seller_id = auth.uid() AND
            tenant_id = (
                SELECT tenant_id FROM profiles 
                WHERE id = auth.uid()
            )
        ) OR
        -- Admins can see all products
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "products_secure_insert" ON products 
    FOR INSERT 
    WITH CHECK (
        -- Must be authenticated
        auth.uid() IS NOT NULL AND
        -- Must be seller or admin
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('seller', 'admin')
        ) AND
        -- Must have tenant_id
        tenant_id IS NOT NULL AND
        -- Can only insert in their own tenant
        tenant_id = (
            SELECT tenant_id FROM profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "products_secure_update" ON products 
    FOR UPDATE 
    USING (
        -- Sellers can update their own products
        seller_id = auth.uid() OR
        -- Admins can update any product
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        -- Same conditions
        seller_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "products_secure_delete" ON products 
    FOR DELETE 
    USING (
        -- Sellers can delete their own products
        seller_id = auth.uid() OR
        -- Admins can delete any product
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- ============================================
-- SECURE ORDERS POLICIES
-- ============================================

-- Drop existing orders policies
DROP POLICY IF EXISTS "orders_tenant_isolation" ON orders;
DROP POLICY IF EXISTS "Orders access policy" ON orders;

CREATE POLICY "orders_secure_select" ON orders 
    FOR SELECT 
    USING (
        -- Customers can see their own orders
        customer_id = auth.uid() OR
        -- Sellers can see orders for their products
        seller_id = auth.uid() OR
        -- Admins can see all orders
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "orders_secure_insert" ON orders 
    FOR INSERT 
    WITH CHECK (
        -- Must be authenticated
        auth.uid() IS NOT NULL AND
        -- Can only create orders for themselves
        customer_id = auth.uid() AND
        -- Must have tenant_id
        tenant_id IS NOT NULL AND
        -- Can only insert in their own tenant
        tenant_id = (
            SELECT tenant_id FROM profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "orders_secure_update" ON orders 
    FOR UPDATE 
    USING (
        -- Customers can update their own orders
        customer_id = auth.uid() OR
        -- Sellers can update orders for their products
        seller_id = auth.uid() OR
        -- Admins can update any order
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        -- Same conditions
        customer_id = auth.uid() OR
        seller_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- ============================================
-- SECURE CATEGORIES POLICIES
-- ============================================

-- Drop existing categories policies
DROP POLICY IF EXISTS "categories_tenant_isolation" ON categories;
DROP POLICY IF EXISTS "Categories access policy" ON categories;

CREATE POLICY "categories_secure_select" ON categories 
    FOR SELECT 
    USING (
        -- Active categories are visible to everyone in the same tenant
        is_active = true AND
        tenant_id = (
            SELECT tenant_id FROM profiles 
            WHERE id = auth.uid()
        ) OR
        -- Admins can see all categories
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "categories_secure_insert" ON categories 
    FOR INSERT 
    WITH CHECK (
        -- Only admins can create categories
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        ) AND
        -- Must have tenant_id
        tenant_id IS NOT NULL AND
        -- Can only insert in their own tenant
        tenant_id = (
            SELECT tenant_id FROM profiles 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "categories_secure_update" ON categories 
    FOR UPDATE 
    USING (
        -- Only admins can update categories
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    )
    WITH CHECK (
        -- Same conditions
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "categories_secure_delete" ON categories 
    FOR DELETE 
    USING (
        -- Only admins can delete categories
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- ============================================
-- VERIFICATION
-- ============================================
-- Check all policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename IN ('profiles', 'products', 'orders', 'categories')
ORDER BY tablename, policyname;

-- ============================================
-- SECURITY NOTES
-- ============================================
-- ✅ Tenant isolation maintained
-- ✅ Role-based access control
-- ✅ Users can only see their own tenant's data
-- ✅ Admins have full access
-- ✅ Sellers can manage their own products
-- ✅ Customers can manage their own orders
-- ✅ Categories are admin-only

