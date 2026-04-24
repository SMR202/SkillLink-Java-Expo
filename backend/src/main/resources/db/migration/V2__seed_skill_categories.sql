INSERT INTO skill_categories (name, icon, description)
SELECT 'Plumbing', 'wrench', 'Plumbing installation, repair, and maintenance'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Plumbing');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Electrical', 'zap', 'Electrical wiring, fixtures, and repair'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Electrical');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Graphic Design', 'palette', 'Logo design, branding, illustrations'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Graphic Design');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Tutoring', 'book-open', 'Academic tutoring and mentoring'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Tutoring');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Software Development', 'code', 'Web, mobile, and desktop application development'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Software Development');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Cleaning', 'sparkles', 'Home and office cleaning services'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Cleaning');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Carpentry', 'hammer', 'Woodwork, furniture, and cabinet making'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Carpentry');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Photography', 'camera', 'Event, portrait, and commercial photography'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Photography');

INSERT INTO skill_categories (name, icon, description)
SELECT 'AC Repair', 'thermometer', 'Air conditioning installation and repair'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'AC Repair');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Painting', 'paintbrush', 'Interior and exterior painting'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Painting');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Welding', 'flame', 'Metal fabrication and welding'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Welding');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Tailoring', 'scissors', 'Custom clothing and alterations'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Tailoring');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Catering', 'utensils', 'Food preparation and event catering'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Catering');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Driving', 'car', 'Personal driving and delivery services'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Driving');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Beauty', 'heart', 'Makeup, hair styling, and beauty treatments'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Beauty');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Fitness', 'dumbbell', 'Personal training and fitness coaching'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Fitness');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Legal', 'scale', 'Legal consultation and documentation'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Legal');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Accounting', 'calculator', 'Bookkeeping, tax filing, and financial advising'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Accounting');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Marketing', 'megaphone', 'Digital marketing, SEO, and social media'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Marketing');

INSERT INTO skill_categories (name, icon, description)
SELECT 'Writing', 'pen-tool', 'Content writing, copywriting, and editing'
WHERE NOT EXISTS (SELECT 1 FROM skill_categories WHERE name = 'Writing');
