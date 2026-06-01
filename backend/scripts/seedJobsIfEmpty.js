/**
 * Inserts demo jobs when the jobs table is empty.
 * Usage: node scripts/seedJobsIfEmpty.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { pool } = require('../config/db');

const DEMO_JOBS = [
  {
    company_id: 1,
    title: 'Backend Developer',
    description: 'Develop REST APIs, integrate MySQL databases, and support deployment pipelines.',
    package_lpa: 8.5,
    location: 'Bengaluru, India',
    min_cgpa: 7.5,
    last_date: '2026-09-20',
  },
  {
    company_id: 1,
    title: 'Frontend Developer',
    description: 'Build responsive React interfaces and collaborate with UI/UX and backend teams.',
    package_lpa: 7.2,
    location: 'Bengaluru, India',
    min_cgpa: 7.0,
    last_date: '2026-09-22',
  },
  {
    company_id: 2,
    title: 'Data Analyst',
    description: 'Work on business reporting, dashboards, and SQL-driven analytics workflows.',
    package_lpa: 6.8,
    location: 'Hyderabad, India',
    min_cgpa: 7.8,
    last_date: '2026-09-25',
  },
  {
    company_id: 2,
    title: 'Business Analyst Intern',
    description: 'Support product and operations teams with process analysis and stakeholder reporting.',
    package_lpa: 4.8,
    location: 'Hyderabad, India',
    min_cgpa: 7.2,
    last_date: '2026-09-26',
  },
];

async function main() {
  const [countRows] = await pool.query('SELECT COUNT(*) AS total FROM jobs');
  const total = Number(countRows[0]?.total || 0);

  if (total > 0) {
    console.log(`jobs table already has ${total} row(s); skipping seed.`);
    await pool.end();
    return;
  }

  const [companies] = await pool.query('SELECT company_id FROM companies ORDER BY company_id LIMIT 2');
  if (companies.length === 0) {
    console.error('No companies found. Register a company or run database/seed.sql first.');
    process.exit(1);
  }

  const primaryId = companies[0].company_id;
  const secondaryId = companies[1]?.company_id ?? primaryId;

  const jobs = DEMO_JOBS.map((job, index) => ({
    ...job,
    company_id: index < 2 ? primaryId : secondaryId,
  }));

  for (const job of jobs) {
    await pool.query(
      `INSERT INTO jobs (company_id, title, description, package_lpa, location, min_cgpa, last_date, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
      [
        job.company_id,
        job.title,
        job.description,
        job.package_lpa,
        job.location,
        job.min_cgpa,
        job.last_date,
      ]
    );
  }

  const [after] = await pool.query('SELECT job_id, title, company_id FROM jobs');
  console.log(`Inserted ${after.length} job(s):`);
  after.forEach((row) => console.log(`  - [${row.job_id}] ${row.title} (company ${row.company_id})`));

  await pool.end();
}

main().catch(async (error) => {
  console.error(error.message);
  await pool.end();
  process.exit(1);
});
