const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'hire-sync-secret';

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token missing'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = jwt.verify(token, jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid'
    });
  }
};

module.exports = {
  protect
};