-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS create_admin_user_profile ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_admin_user();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into admin_users table for any new auth user
  INSERT INTO public.admin_users (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the auth process
    RAISE LOG 'Error creating admin user profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies to be more permissive for user creation
DROP POLICY IF EXISTS "admin_users_insert_own" ON public.admin_users;
CREATE POLICY "admin_users_insert_own" ON public.admin_users 
  FOR INSERT WITH CHECK (true); -- Allow any authenticated user to create their profile

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.admin_users TO anon, authenticated;
