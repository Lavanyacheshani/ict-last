-- Add sample content for 2025 A/L class
WITH class_2025 AS (
  SELECT id FROM public.classes WHERE name = '2025 A/L' LIMIT 1
),
january_month AS (
  SELECT id FROM public.months 
  WHERE class_id = (SELECT id FROM class_2025) 
  AND month_number = 1 
  LIMIT 1
),
february_month AS (
  SELECT id FROM public.months 
  WHERE class_id = (SELECT id FROM class_2025) 
  AND month_number = 2 
  LIMIT 1
)

-- Insert sample videos for January
INSERT INTO public.videos (month_id, title, description, video_url, is_free, price, order_index)
SELECT 
  january_month.id,
  video_title,
  video_desc,
  video_url,
  is_free,
  price,
  order_idx
FROM january_month,
(VALUES 
  ('Introduction to ICT', 'Basic concepts and overview of ICT subject', 'https://drive.google.com/file/d/sample1', true, 0, 1),
  ('Computer Systems Overview', 'Understanding computer hardware and software', 'https://drive.google.com/file/d/sample2', true, 0, 2),
  ('Data Representation', 'How data is represented in computer systems', 'https://drive.google.com/file/d/sample3', false, 500, 3),
  ('Number Systems', 'Binary, decimal, hexadecimal number systems', 'https://drive.google.com/file/d/sample4', false, 500, 4),
  ('Logic Gates', 'Understanding basic logic gates and circuits', 'https://drive.google.com/file/d/sample5', false, 750, 5)
) AS videos(video_title, video_desc, video_url, is_free, price, order_idx)
ON CONFLICT DO NOTHING;

-- Insert sample videos for February
INSERT INTO public.videos (month_id, title, description, video_url, is_free, price, order_index)
SELECT 
  february_month.id,
  video_title,
  video_desc,
  video_url,
  is_free,
  price,
  order_idx
FROM february_month,
(VALUES 
  ('Programming Fundamentals', 'Introduction to programming concepts', 'https://drive.google.com/file/d/sample6', true, 0, 1),
  ('Python Basics', 'Getting started with Python programming', 'https://drive.google.com/file/d/sample7', false, 600, 2),
  ('Variables and Data Types', 'Understanding variables and data types in Python', 'https://drive.google.com/file/d/sample8', false, 600, 3),
  ('Control Structures', 'If statements, loops, and decision making', 'https://drive.google.com/file/d/sample9', false, 700, 4)
) AS videos(video_title, video_desc, video_url, is_free, price, order_idx)
ON CONFLICT DO NOTHING;

-- Insert sample notes for January
INSERT INTO public.notes (month_id, title, description, drive_url, is_free, price)
SELECT 
  january_month.id,
  'January Study Materials',
  'Complete notes and worksheets for January topics',
  'https://drive.google.com/drive/folders/january-notes',
  false,
  300
FROM january_month
ON CONFLICT DO NOTHING;

-- Insert sample notes for February
INSERT INTO public.notes (month_id, title, description, drive_url, is_free, price)
SELECT 
  february_month.id,
  'February Programming Notes',
  'Programming fundamentals and Python basics notes',
  'https://drive.google.com/drive/folders/february-notes',
  false,
  350
FROM february_month
ON CONFLICT DO NOTHING;

-- Add sample content for other classes
WITH class_2026 AS (
  SELECT id FROM public.classes WHERE name = '2026 A/L' LIMIT 1
)
INSERT INTO public.months (class_id, name, month_number, year)
SELECT 
  class_2026.id,
  month_name,
  month_num,
  2026
FROM class_2026,
(VALUES 
  ('January', 1), ('February', 2), ('March', 3)
) AS months(month_name, month_num)
ON CONFLICT (class_id, month_number, year) DO NOTHING;

WITH class_2027 AS (
  SELECT id FROM public.classes WHERE name = '2027 A/L' LIMIT 1
)
INSERT INTO public.months (class_id, name, month_number, year)
SELECT 
  class_2027.id,
  month_name,
  month_num,
  2027
FROM class_2027,
(VALUES 
  ('January', 1), ('February', 2)
) AS months(month_name, month_num)
ON CONFLICT (class_id, month_number, year) DO NOTHING;
