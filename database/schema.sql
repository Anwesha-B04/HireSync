CREATE DATABASE IF NOT EXISTS hiresync
	CHARACTER SET utf8mb4
	COLLATE utf8mb4_0900_ai_ci;

USE hiresync;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS activity_logs;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS placements;
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS placement_drives;
DROP TABLE IF EXISTS jobs;
DROP TABLE IF EXISTS student_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS resumes;
DROP TABLE IF EXISTS admins;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
	id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	email VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	role VARCHAR(20) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id),
	UNIQUE KEY uq_users_email (email),
	CONSTRAINT chk_users_role CHECK (role IN ('student', 'company', 'admin'))
) ENGINE=InnoDB;

CREATE TABLE students (
	student_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	user_id BIGINT UNSIGNED NOT NULL,
	roll_no VARCHAR(50) NOT NULL,
	name VARCHAR(150) NOT NULL,
	phone VARCHAR(20) DEFAULT NULL,
	department VARCHAR(100) NOT NULL,
	course VARCHAR(100) NOT NULL,
	cgpa DECIMAL(4,2) NOT NULL,
	passing_year YEAR NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (student_id),
	UNIQUE KEY uq_students_user_id (user_id),
	UNIQUE KEY uq_students_roll_no (roll_no),
	KEY idx_students_department (department),
	KEY idx_students_course (course),
	KEY idx_students_passing_year (passing_year),
	KEY idx_students_cgpa (cgpa),
	CONSTRAINT fk_students_user
		FOREIGN KEY (user_id) REFERENCES users (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT chk_students_cgpa CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
	CONSTRAINT chk_students_passing_year CHECK (passing_year BETWEEN 2000 AND 2100)
) ENGINE=InnoDB;

CREATE TABLE companies (
	company_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	user_id BIGINT UNSIGNED NOT NULL,
	company_name VARCHAR(200) NOT NULL,
	website VARCHAR(255) DEFAULT NULL,
	location VARCHAR(150) NOT NULL,
	industry VARCHAR(150) NOT NULL,
	description TEXT DEFAULT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (company_id),
	UNIQUE KEY uq_companies_user_id (user_id),
	UNIQUE KEY uq_companies_company_name (company_name),
	KEY idx_companies_location (location),
	KEY idx_companies_industry (industry),
	CONSTRAINT fk_companies_user
		FOREIGN KEY (user_id) REFERENCES users (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE admins (
	admin_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	user_id BIGINT UNSIGNED NOT NULL,
	name VARCHAR(150) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (admin_id),
	UNIQUE KEY uq_admins_user_id (user_id),
	CONSTRAINT fk_admins_user
		FOREIGN KEY (user_id) REFERENCES users (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE resumes (
	resume_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	student_id BIGINT UNSIGNED NOT NULL,
	resume_path VARCHAR(500) NOT NULL,
	upload_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (resume_id),
	KEY idx_resumes_student_id_upload_date (student_id, upload_date),
	CONSTRAINT fk_resumes_student
		FOREIGN KEY (student_id) REFERENCES students (student_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE skills (
	skill_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	skill_name VARCHAR(100) NOT NULL,
	PRIMARY KEY (skill_id),
	UNIQUE KEY uq_skills_skill_name (skill_name)
) ENGINE=InnoDB;

CREATE TABLE student_skills (
	student_id BIGINT UNSIGNED NOT NULL,
	skill_id BIGINT UNSIGNED NOT NULL,
	PRIMARY KEY (student_id, skill_id),
	KEY idx_student_skills_skill_id (skill_id),
	CONSTRAINT fk_student_skills_student
		FOREIGN KEY (student_id) REFERENCES students (student_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_student_skills_skill
		FOREIGN KEY (skill_id) REFERENCES skills (skill_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE jobs (
	job_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	company_id BIGINT UNSIGNED NOT NULL,
	title VARCHAR(200) NOT NULL,
	description TEXT NOT NULL,
	package_lpa DECIMAL(10,2) NOT NULL,
	location VARCHAR(150) NOT NULL,
	min_cgpa DECIMAL(4,2) NOT NULL,
	last_date DATE NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT TRUE,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (job_id),
	KEY idx_jobs_company_id (company_id),
	KEY idx_jobs_location (location),
	KEY idx_jobs_package_lpa (package_lpa),
	KEY idx_jobs_min_cgpa (min_cgpa),
	KEY idx_jobs_last_date (last_date),
	KEY idx_jobs_is_active (is_active),
	KEY idx_jobs_title (title),
	CONSTRAINT fk_jobs_company
		FOREIGN KEY (company_id) REFERENCES companies (company_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT chk_jobs_package_lpa CHECK (package_lpa >= 0.00),
	CONSTRAINT chk_jobs_min_cgpa CHECK (min_cgpa >= 0.00 AND min_cgpa <= 10.00)
) ENGINE=InnoDB;

CREATE TABLE placement_drives (
	drive_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	company_id BIGINT UNSIGNED NOT NULL,
	drive_date DATE NOT NULL,
	venue VARCHAR(255) NOT NULL,
	description TEXT DEFAULT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (drive_id),
	KEY idx_placement_drives_company_id (company_id),
	KEY idx_placement_drives_drive_date (drive_date),
	CONSTRAINT fk_placement_drives_company
		FOREIGN KEY (company_id) REFERENCES companies (company_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE applications (
	application_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	student_id BIGINT UNSIGNED NOT NULL,
	job_id BIGINT UNSIGNED NOT NULL,
	status VARCHAR(30) NOT NULL DEFAULT 'applied',
	applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (application_id),
	UNIQUE KEY uq_applications_student_job (student_id, job_id),
	KEY idx_applications_student_id (student_id),
	KEY idx_applications_job_id (job_id),
	KEY idx_applications_status (status),
	KEY idx_applications_applied_at (applied_at),
	CONSTRAINT fk_applications_student
		FOREIGN KEY (student_id) REFERENCES students (student_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_applications_job
		FOREIGN KEY (job_id) REFERENCES jobs (job_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT chk_applications_status CHECK (
		status IN ('applied', 'shortlisted', 'interview_scheduled', 'selected', 'rejected', 'withdrawn')
	)
) ENGINE=InnoDB;

CREATE TABLE interviews (
	interview_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	application_id BIGINT UNSIGNED NOT NULL,
	round_name VARCHAR(100) NOT NULL,
	interview_date DATETIME NOT NULL,
	result VARCHAR(30) NOT NULL DEFAULT 'pending',
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (interview_id),
	UNIQUE KEY uq_interviews_application_round (application_id, round_name),
	KEY idx_interviews_application_id (application_id),
	KEY idx_interviews_interview_date (interview_date),
	KEY idx_interviews_result (result),
	CONSTRAINT fk_interviews_application
		FOREIGN KEY (application_id) REFERENCES applications (application_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT chk_interviews_result CHECK (result IN ('pending', 'passed', 'failed', 'selected', 'rejected'))
) ENGINE=InnoDB;

CREATE TABLE placements (
	placement_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	student_id BIGINT UNSIGNED NOT NULL,
	company_id BIGINT UNSIGNED DEFAULT NULL,
	package_lpa DECIMAL(10,2) NOT NULL,
	joining_date DATE NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (placement_id),
	UNIQUE KEY uq_placements_student_id (student_id),
	KEY idx_placements_company_id (company_id),
	KEY idx_placements_joining_date (joining_date),
	KEY idx_placements_package_lpa (package_lpa),
	CONSTRAINT fk_placements_student
		FOREIGN KEY (student_id) REFERENCES students (student_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT fk_placements_company
		FOREIGN KEY (company_id) REFERENCES companies (company_id)
		ON DELETE SET NULL
		ON UPDATE CASCADE,
	CONSTRAINT chk_placements_package_lpa CHECK (package_lpa >= 0.00)
) ENGINE=InnoDB;

CREATE TABLE notifications (
	notification_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	user_id BIGINT UNSIGNED NOT NULL,
	message VARCHAR(1000) NOT NULL,
	is_read BOOLEAN NOT NULL DEFAULT FALSE,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (notification_id),
	KEY idx_notifications_user_id_is_read_created_at (user_id, is_read, created_at),
	CONSTRAINT fk_notifications_user
		FOREIGN KEY (user_id) REFERENCES users (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT chk_notifications_is_read CHECK (is_read IN (0, 1))
) ENGINE=InnoDB;

CREATE TABLE activity_logs (
	log_id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	user_id BIGINT UNSIGNED NOT NULL,
	action VARCHAR(255) NOT NULL,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (log_id),
	KEY idx_activity_logs_user_id_created_at (user_id, created_at),
	KEY idx_activity_logs_action (action),
	CONSTRAINT fk_activity_logs_user
		FOREIGN KEY (user_id) REFERENCES users (id)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) ENGINE=InnoDB;
