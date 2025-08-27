-- Create admin users table for authentication
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admin users policies
CREATE POLICY "admin_users_select_own" ON public.admin_users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "admin_users_insert_own" ON public.admin_users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "admin_users_update_own" ON public.admin_users FOR UPDATE USING (auth.uid() = id);

-- Create classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- e.g., "2025 A/L", "2026 A/L", "Lesson Packs"
  description TEXT,
  year INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Classes policies (public read, admin write)
CREATE POLICY "classes_select_all" ON public.classes FOR SELECT USING (true);
CREATE POLICY "classes_insert_admin" ON public.classes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "classes_update_admin" ON public.classes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "classes_delete_admin" ON public.classes FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Create months table for organizing content
CREATE TABLE IF NOT EXISTS public.months (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "January", "February"
  month_number INTEGER NOT NULL CHECK (month_number >= 1 AND month_number <= 12),
  year INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, month_number, year)
);

-- Enable RLS for months
ALTER TABLE public.months ENABLE ROW LEVEL SECURITY;

-- Months policies (public read, admin write)
CREATE POLICY "months_select_all" ON public.months FOR SELECT USING (true);
CREATE POLICY "months_insert_admin" ON public.months FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "months_update_admin" ON public.months FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "months_delete_admin" ON public.months FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Create videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month_id UUID NOT NULL REFERENCES public.months(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL, -- Google Drive or YouTube URL
  thumbnail_url TEXT,
  is_free BOOLEAN DEFAULT false,
  price DECIMAL(10,2) DEFAULT 0,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for videos
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Videos policies (public read, admin write)
CREATE POLICY "videos_select_all" ON public.videos FOR SELECT USING (true);
CREATE POLICY "videos_insert_admin" ON public.videos FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "videos_update_admin" ON public.videos FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "videos_delete_admin" ON public.videos FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Create notes table
CREATE TABLE IF NOT EXISTS public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month_id UUID NOT NULL REFERENCES public.months(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  drive_url TEXT NOT NULL, -- Google Drive folder URL
  is_free BOOLEAN DEFAULT false,
  price DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for notes
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Notes policies (public read, admin write)
CREATE POLICY "notes_select_all" ON public.notes FOR SELECT USING (true);
CREATE POLICY "notes_insert_admin" ON public.notes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "notes_update_admin" ON public.notes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "notes_delete_admin" ON public.notes FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Create results table for student achievements
CREATE TABLE IF NOT EXISTS public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  achievement TEXT NOT NULL,
  year INTEGER NOT NULL,
  image_url TEXT,
  testimonial TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for results
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;

-- Results policies (public read, admin write)
CREATE POLICY "results_select_all" ON public.results FOR SELECT USING (true);
CREATE POLICY "results_insert_admin" ON public.results FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "results_update_admin" ON public.results FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "results_delete_admin" ON public.results FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Create gallery table for images
CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT, -- e.g., "classes", "events", "activities"
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for gallery
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Gallery policies (public read, admin write)
CREATE POLICY "gallery_select_all" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "gallery_insert_admin" ON public.gallery FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "gallery_update_admin" ON public.gallery FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "gallery_delete_admin" ON public.gallery FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Create contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for contact_messages
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Contact messages policies (public insert, admin read)
CREATE POLICY "contact_messages_insert_all" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_messages_select_admin" ON public.contact_messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "contact_messages_update_admin" ON public.contact_messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Create site settings table for general website configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for site_settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Site settings policies (public read, admin write)
CREATE POLICY "site_settings_select_all" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_insert_admin" ON public.site_settings FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "site_settings_update_admin" ON public.site_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "site_settings_delete_admin" ON public.site_settings FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_months_updated_at BEFORE UPDATE ON public.months FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON public.results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_updated_at BEFORE UPDATE ON public.gallery FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
