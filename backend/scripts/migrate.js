const { pool } = require('../config/db');

async function run() {
  try {
    const [columns] = await pool.query("SHOW COLUMNS FROM companies LIKE 'status'");
    if (columns.length === 0) {
      await pool.query("ALTER TABLE companies ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'approved'");
      console.log("Column 'status' added to 'companies' table successfully.");
    } else {
      console.log("Column 'status' already exists in 'companies' table.");
    }
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}
run();
