const express = require('express');
const cors = require('cors');
let helmet;
let morgan;
try {
	helmet = require('helmet');
} catch (e) {
	helmet = () => (req, res, next) => next();
	console.warn('Optional dependency `helmet` not installed — skipping');
}

try {
	morgan = require('morgan');
} catch (e) {
	morgan = () => (req, res, next) => next();
	console.warn('Optional dependency `morgan` not installed — skipping');
}
const path = require('path');
try {
	require('express-async-errors');
} catch (e) {
	console.warn('Optional dependency `express-async-errors` not installed — continuing without it');
}
require('dotenv').config();

const { pool } = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const companyRoutes = require('./routes/companyRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const port = Number(process.env.PORT || 5000);
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
const uploadDir = process.env.UPLOAD_DIR || 'uploads';

// Security & logging
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS
app.use(cors({ origin: corsOrigin, credentials: true }));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
const uploadsPath = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Prevent browsers from caching API JSON (avoids stale empty job lists after seeding)
app.use('/api', (_req, res, next) => {
	res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
	res.set('Pragma', 'no-cache');
	next();
});

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', async (_req, res) => {
	await pool.query('SELECT 1');
	return res.json({ success: true, message: 'HireSync API is running' });
});

// 404 handler
app.use((req, _res, next) => {
	const err = new Error(`Route not found: ${req.originalUrl}`);
	err.status = 404;
	next(err);
});

// Centralized error handler
app.use((err, req, res, _next) => {
	const statusCode = err.status || res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode);

	const response = {
		success: false,
		message: err.message || 'Internal Server Error'
	};

	if (process.env.NODE_ENV !== 'production') {
		response.stack = err.stack;
		response.path = req.originalUrl;
	}

	console.error(err);
	res.json(response);
});

const startServer = async () => {
	try {
		await pool.query('SELECT 1');
		console.log('MySQL Connected Successfully');

		app.listen(port, () => {
			console.log(`HireSync backend running on port ${port}`);
		});
	} catch (error) {
		console.error('MySQL connection failed:', error);
		process.exit(1);
	}
};

startServer();
