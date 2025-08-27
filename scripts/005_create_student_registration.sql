-- Create student registration table
CREATE TABLE IF NOT EXISTS public.student_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  class TEXT NOT NULL, -- e.g., "2025 A/L", "2026 A/L"
  student_id TEXT NOT NULL, -- Student ID number
  phone_number TEXT NOT NULL,
  school TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for student_registrations
ALTER TABLE public.student_registrations ENABLE ROW LEVEL SECURITY;

-- Student registration policies (public insert, admin read)
CREATE POLICY "student_registrations_insert_all" ON public.student_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "student_registrations_select_admin" ON public.student_registrations FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "student_registrations_update_admin" ON public.student_registrations FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);
CREATE POLICY "student_registrations_delete_admin" ON public.student_registrations FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Add trigger for updated_at column
CREATE TRIGGER update_student_registrations_updated_at 
BEFORE UPDATE ON public.student_registrations 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
