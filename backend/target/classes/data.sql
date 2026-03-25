-- SkillLink Skill Categories Seed Data
-- Using MERGE to avoid duplicates on H2 restart
MERGE INTO skill_categories (id, name, icon, description) KEY(id) VALUES
(1, 'Plumbing', 'wrench', 'Plumbing installation, repair, and maintenance'),
(2, 'Electrical', 'zap', 'Electrical wiring, fixtures, and repair'),
(3, 'Graphic Design', 'palette', 'Logo design, branding, illustrations'),
(4, 'Tutoring', 'book-open', 'Academic tutoring and mentoring'),
(5, 'Software Development', 'code', 'Web, mobile, and desktop application development'),
(6, 'Cleaning', 'sparkles', 'Home and office cleaning services'),
(7, 'Carpentry', 'hammer', 'Woodwork, furniture, and cabinet making'),
(8, 'Photography', 'camera', 'Event, portrait, and commercial photography'),
(9, 'AC Repair', 'thermometer', 'Air conditioning installation and repair'),
(10, 'Painting', 'paintbrush', 'Interior and exterior painting'),
(11, 'Welding', 'flame', 'Metal fabrication and welding'),
(12, 'Tailoring', 'scissors', 'Custom clothing and alterations'),
(13, 'Catering', 'utensils', 'Food preparation and event catering'),
(14, 'Driving', 'car', 'Personal driving and delivery services'),
(15, 'Beauty', 'heart', 'Makeup, hair styling, and beauty treatments'),
(16, 'Fitness', 'dumbbell', 'Personal training and fitness coaching'),
(17, 'Legal', 'scale', 'Legal consultation and documentation'),
(18, 'Accounting', 'calculator', 'Bookkeeping, tax filing, and financial advising'),
(19, 'Marketing', 'megaphone', 'Digital marketing, SEO, and social media'),
(20, 'Writing', 'pen-tool', 'Content writing, copywriting, and editing');
