-- Inserts sample jobs when the jobs table is empty.
-- Safe to re-run: only inserts if COUNT(*) = 0.

USE hiresync;

INSERT INTO jobs (company_id, title, description, package_lpa, location, min_cgpa, last_date, is_active)
SELECT * FROM (
  SELECT 1 AS company_id, 'Backend Developer' AS title,
    'Develop REST APIs, integrate MySQL databases, and support deployment pipelines.' AS description,
    8.50 AS package_lpa, 'Bengaluru, India' AS location, 7.50 AS min_cgpa, '2026-09-20' AS last_date, TRUE AS is_active
  UNION ALL
  SELECT 1, 'Frontend Developer',
    'Build responsive React interfaces and collaborate with UI/UX and backend teams.',
    7.20, 'Bengaluru, India', 7.00, '2026-09-22', TRUE
  UNION ALL
  SELECT 2, 'Data Analyst',
    'Work on business reporting, dashboards, and SQL-driven analytics workflows.',
    6.80, 'Hyderabad, India', 7.80, '2026-09-25', TRUE
  UNION ALL
  SELECT 2, 'Business Analyst Intern',
    'Support product and operations teams with process analysis and stakeholder reporting.',
    4.80, 'Hyderabad, India', 7.20, '2026-09-26', TRUE
) AS seed_rows
WHERE (SELECT COUNT(*) FROM jobs) = 0
  AND EXISTS (SELECT 1 FROM companies WHERE company_id = 1)
  AND EXISTS (SELECT 1 FROM companies WHERE company_id = 2);
