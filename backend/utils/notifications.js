const { pool } = require('../config/db');

const createNotification = async (userId, message) => {
  try {
    await pool.query(
      'INSERT INTO notifications (user_id, message, is_read) VALUES (?, ?, 0)',
      [userId, message]
    );
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

const notifyAllStudents = async (message) => {
  try {
    const [students] = await pool.query('SELECT user_id FROM students');
    for (const student of students) {
      await createNotification(student.user_id, message);
    }
  } catch (error) {
    console.error('Failed to notify all students:', error);
  }
};

module.exports = {
  createNotification,
  notifyAllStudents
};
