-- Run this if jobs were seeded with March 2026 last_date values and no longer appear
-- on the student dashboard (API filters: is_active = 1 AND last_date >= CURDATE()).

USE hiresync;

UPDATE jobs SET last_date = '2026-09-20' WHERE job_id = 1;
UPDATE jobs SET last_date = '2026-09-22' WHERE job_id = 2;
UPDATE jobs SET last_date = '2026-09-25' WHERE job_id = 3;
UPDATE jobs SET last_date = '2026-09-26' WHERE job_id = 4;
UPDATE jobs SET last_date = '2026-09-28' WHERE job_id = 5;
