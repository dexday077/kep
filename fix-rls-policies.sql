-- ============================================
-- FIX: RLS Policies for Profiles Table
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "profiles_tenant_isolation" ON profiles;
DROP POLICY IF EXISTS "Profiles access policy" ON profiles;
DROP POLICY IF EXISTS "Users can manage their own profile" ON profiles;

-- Create new, more permissive policies for profiles
CREATE POLICY "profiles_select_policy" ON profiles 
    FOR SELECT 
    USING (true); -- Everyone can read profiles (for now)

CREATE POLICY "profiles_insert_policy" ON profiles 
    FOR INSERT 
    WITH CHECK (
        -- Allow insert if user is authenticated and tenant_id is provided
        auth.uid() IS NOT NULL AND 
        tenant_id IS NOT NULL
    );

CREATE POLICY "profiles_update_policy" ON profiles 
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

CREATE POLICY "profiles_delete_policy" ON profiles 
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
-- VERIFICATION
-- ============================================
-- Check if policies are created
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Test if we can insert a profile (this should work now)
-- SELECT 'RLS Policies Updated Successfully' as status;

