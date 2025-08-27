-- Insert initial site settings
INSERT INTO public.site_settings (key, value, description) VALUES
('site_title', 'Saman Priyakara Sir - A/L ICT Classes', 'Main site title'),
('hero_title_sinhala', 'සමන් ප්‍රියකර මහතා සමඟ A/L ICT පන්ති', 'Hero section title in Sinhala'),
('hero_description_sinhala', 'ප්‍රවීණ ICT ගුරුවරයෙකු සමඟ ඔබේ A/L ICT සාර්ථකත්වය සහතික කරගන්න', 'Hero section description in Sinhala'),
('about_title_sinhala', 'ගුරුවරයා ගැන', 'About section title in Sinhala'),
('about_description_sinhala', 'වසර 15කට වැඩි අත්දැකීමක් ඇති ICT ගුරුවරයෙකු ලෙස, සමන් ප්‍රියකර මහතා සිසුන්ගේ A/L ICT සාර්ථකත්වය සඳහා කැපවී සිටී. නවීන ඉගැන්වීම් ක්‍රම සහ ප්‍රායෝගික අත්දැකීම් මගින් සිසුන්ට ඉහළම ප්‍රතිඵල ලබා ගැනීමට උපකාර කරයි.', 'About section description in Sinhala'),
('whatsapp_number', '+94771234567', 'WhatsApp contact number'),
('bank_details', 'Bank: Commercial Bank\nAccount: 1234567890\nName: Saman Priyakara', 'Bank account details for payments')
ON CONFLICT (key) DO NOTHING;

-- Insert initial classes
INSERT INTO public.classes (name, description, year, is_active) VALUES
('2025 A/L', '2025 වර්ෂයේ උසස් පෙළ ICT පන්තිය', 2025, true),
('2026 A/L', '2026 වර්ෂයේ උසස් පෙළ ICT පන්තිය', 2026, true),
('2027 A/L', '2027 වර්ෂයේ උසස් පෙළ ICT පන්තිය', 2027, true),
('Lesson Packs', 'විශේෂ පාඩම් පැකේජ', NULL, true)
ON CONFLICT DO NOTHING;

-- Insert sample months for 2025 A/L class
WITH class_2025 AS (
  SELECT id FROM public.classes WHERE name = '2025 A/L' LIMIT 1
)
INSERT INTO public.months (class_id, name, month_number, year)
SELECT 
  class_2025.id,
  month_name,
  month_num,
  2025
FROM class_2025,
(VALUES 
  ('January', 1), ('February', 2), ('March', 3), ('April', 4),
  ('May', 5), ('June', 6), ('July', 7), ('August', 8),
  ('September', 9), ('October', 10), ('November', 11), ('December', 12)
) AS months(month_name, month_num)
ON CONFLICT (class_id, month_number, year) DO NOTHING;

-- Insert sample results
INSERT INTO public.results (student_name, achievement, year, testimonial, order_index) VALUES
('අනුර සිල්වා', 'ICT A Grade - 85 Marks', 2024, 'සමන් සර්ගේ පන්ති නිසා මට ICT වලින් A ගුණයක් ගන්න පුළුවන් වුණා. ගොඩක් ස්තූතියි සර්!', 1),
('කමලි පෙරේරා', 'ICT A Grade - 82 Marks', 2024, 'සර්ගේ ඉගැන්වීම ගොඩක් පැහැදිලියි. ICT subject එක මට ආසයි කරගත්තේ සර් නිසා.', 2),
('නිමල් රත්නායක', 'ICT A Grade - 88 Marks', 2024, 'Best ICT teacher! සර්ගේ notes සහ videos වලින් හොඳට study කරන්න පුළුවන්.', 3)
ON CONFLICT DO NOTHING;

-- Insert sample gallery items
INSERT INTO public.gallery (title, description, image_url, category, order_index) VALUES
('Class Session 2024', '2024 වර්ෂයේ පන්ති සැසිය', '/placeholder.svg?height=300&width=400', 'classes', 1),
('Student Achievement Ceremony', 'සිසුන්ගේ ජයග්‍රහණ උත්සවය', '/placeholder.svg?height=300&width=400', 'events', 2),
('Practical Session', 'ප්‍රායෝගික පන්ති සැසිය', '/placeholder.svg?height=300&width=400', 'activities', 3)
ON CONFLICT DO NOTHING;
