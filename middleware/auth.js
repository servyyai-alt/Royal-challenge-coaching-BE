const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized. No token.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Admin not found.' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired.' });
  }
};

exports.superAdminOnly = (req, res, next) => {
  if (req.admin.role !== 'superadmin') {
    return res.status(403).json({ success: false, message: 'Access denied. Super admin only.' });
  }
  next();
};
