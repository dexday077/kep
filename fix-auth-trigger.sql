-- ============================================
-- FIX: Update handle_new_user trigger for multi-tenant support
-- ============================================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create updated function with tenant_id support
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, tenant_id)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'customer'),
    '00000000-0000-0000-0000-000000000001' -- Default tenant
  );
  RETURN new;
END;
$$ language plpgsql security definer set search_path = public;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- VERIFICATION
-- ============================================
-- Test the trigger by checking if it exists
SELECT 
    trigger_name, 
    event_manipulation, 
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if function exists
SELECT 
    routine_name, 
    routine_type, 
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' 
AND routine_schema = 'public';

