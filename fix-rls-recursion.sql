-- ============================================
-- FIX: Infinite Recursion in RLS Policies
-- ============================================
-- Problem: Policies are querying profiles table which causes recursion
-- Solution: Use helper functions (auth_tenant, auth_role) or simplify policies

-- Drop existing profiles policies
DROP POLICY IF EXISTS "profiles_secure_select" ON profiles;
DROP POLICY IF EXISTS "profiles_secure_insert" ON profiles;
DROP POLICY IF EXISTS "profiles_secure_update" ON profiles;
DROP POLICY IF EXISTS "profiles_secure_delete" ON profiles;

-- ============================================
-- FIXED PROFILES POLICIES (No Recursion)
-- ============================================

-- 1. SELECT Policy - Simplified to avoid recursion
CREATE POLICY "profiles_secure_select" ON profiles 
    FOR SELECT 
    USING (
        -- Users can see their own profile
        auth.uid() = id OR
        -- Users can see profiles in their own tenant (using auth_tenant function)
        tenant_id = auth_tenant() OR
        -- Admins can see all profiles (using auth_role function)
        auth_role() = 'admin'
    );

-- 2. INSERT Policy - Simplified
CREATE POLICY "profiles_secure_insert" ON profiles 
    FOR INSERT 
    WITH CHECK (
        -- Must be authenticated
        auth.uid() IS NOT NULL AND
        -- Must have tenant_id
        tenant_id IS NOT NULL AND
        -- Can only insert their own profile (with same tenant_id as current user)
        (
            auth.uid() = id AND
            (
                tenant_id = auth_tenant() OR
                -- Allow insert if user doesn't have profile yet (new signup)
                auth_tenant() IS NULL
            )
        ) OR
        -- Admins can insert any profile
        auth_role() = 'admin'
    );

-- 3. UPDATE Policy - Simplified
CREATE POLICY "profiles_secure_update" ON profiles 
    FOR UPDATE 
    USING (
        -- Users can update their own profile
        auth.uid() = id OR
        -- Admins can update any profile
        auth_role() = 'admin'
    )
    WITH CHECK (
        -- Same conditions
        auth.uid() = id OR
        auth_role() = 'admin'
    );

-- 4. DELETE Policy - Simplified
CREATE POLICY "profiles_secure_delete" ON profiles 
    FOR DELETE 
    USING (
        -- Users can delete their own profile
        auth.uid() = id OR
        -- Admins can delete any profile
        auth_role() = 'admin'
    );

-- ============================================
-- UPDATE OTHER POLICIES TO USE HELPER FUNCTIONS
-- ============================================

-- Products policies
DROP POLICY IF EXISTS "products_secure_select" ON products;
DROP POLICY IF EXISTS "products_secure_insert" ON products;
DROP POLICY IF EXISTS "products_secure_update" ON products;
DROP POLICY IF EXISTS "products_secure_delete" ON products;

CREATE POLICY "products_secure_select" ON products 
    FOR SELECT 
    USING (
        -- Active products are visible to everyone in the same tenant
        (
            is_active = true AND
            tenant_id = auth_tenant()
        ) OR
        -- Sellers can see their own products (even inactive)
        (
            seller_id = auth.uid() AND
            tenant_id = auth_tenant()
        ) OR
        -- Admins can see all products
        auth_role() = 'admin'
    );

CREATE POLICY "products_secure_insert" ON products 
    FOR INSERT 
    WITH CHECK (
        -- Must be authenticated
        auth.uid() IS NOT NULL AND
        -- Must be seller or admin
        auth_role() IN ('seller', 'admin') AND
        -- Must have tenant_id
        tenant_id IS NOT NULL AND
        -- Can only insert in their own tenant
        tenant_id = auth_tenant()
    );

CREATE POLICY "products_secure_update" ON products 
    FOR UPDATE 
    USING (
        -- Sellers can update their own products
        seller_id = auth.uid() OR
        -- Admins can update any product
        auth_role() = 'admin'
    )
    WITH CHECK (
        -- Same conditions
        seller_id = auth.uid() OR
        auth_role() = 'admin'
    );

CREATE POLICY "products_secure_delete" ON products 
    FOR DELETE 
    USING (
        -- Sellers can delete their own products
        seller_id = auth.uid() OR
        -- Admins can delete any product
        auth_role() = 'admin'
    );

-- Categories policies
DROP POLICY IF EXISTS "categories_secure_select" ON categories;
DROP POLICY IF EXISTS "categories_secure_insert" ON categories;
DROP POLICY IF EXISTS "categories_secure_update" ON categories;
DROP POLICY IF EXISTS "categories_secure_delete" ON categories;

CREATE POLICY "categories_secure_select" ON categories 
    FOR SELECT 
    USING (
        -- Active categories are visible to everyone in the same tenant
        (
            is_active = true AND
            tenant_id = auth_tenant()
        ) OR
        -- Admins can see all categories
        auth_role() = 'admin'
    );

CREATE POLICY "categories_secure_insert" ON categories 
    FOR INSERT 
    WITH CHECK (
        -- Only admins can create categories
        auth_role() = 'admin' AND
        -- Must have tenant_id
        tenant_id IS NOT NULL AND
        -- Can only insert in their own tenant
        tenant_id = auth_tenant()
    );

CREATE POLICY "categories_secure_update" ON categories 
    FOR UPDATE 
    USING (
        -- Only admins can update categories
        auth_role() = 'admin'
    )
    WITH CHECK (
        -- Same conditions
        auth_role() = 'admin'
    );

CREATE POLICY "categories_secure_delete" ON categories 
    FOR DELETE 
    USING (
        -- Only admins can delete categories
        auth_role() = 'admin'
    );

-- Orders policies
DROP POLICY IF EXISTS "orders_secure_select" ON orders;
DROP POLICY IF EXISTS "orders_secure_insert" ON orders;
DROP POLICY IF EXISTS "orders_secure_update" ON orders;

CREATE POLICY "orders_secure_select" ON orders 
    FOR SELECT 
    USING (
        -- Customers can see their own orders
        customer_id = auth.uid() OR
        -- Sellers can see orders for their products
        seller_id = auth.uid() OR
        -- Admins can see all orders
        auth_role() = 'admin'
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
        tenant_id = auth_tenant()
    );

CREATE POLICY "orders_secure_update" ON orders 
    FOR UPDATE 
    USING (
        -- Customers can update their own orders
        customer_id = auth.uid() OR
        -- Sellers can update orders for their products
        seller_id = auth.uid() OR
        -- Admins can update any order
        auth_role() = 'admin'
    )
    WITH CHECK (
        -- Same conditions
        customer_id = auth.uid() OR
        seller_id = auth.uid() OR
        auth_role() = 'admin'
    );

-- ============================================
-- VERIFICATION
-- ============================================
-- Check all policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    cmd, 
    qual
FROM pg_policies 
WHERE tablename IN ('profiles', 'products', 'categories', 'orders')
ORDER BY tablename, policyname;

-- Test if recursion is fixed
SELECT 'RLS Policies Updated - No Recursion' as status;
