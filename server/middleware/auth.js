import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Authentication token required.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ry_websphere_super_secret_jwt_key_2026');

    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!admin || admin.isActive === false) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or deactivated. Access denied.',
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token. Please log in again.',
    });
  }
};

// Middleware to restrict routes to Owner/SuperAdmin or Admin only
export const requireSuperAdmin = (req, res, next) => {
  if (req.admin?.role !== 'superadmin' && req.admin?.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Permission denied. Only agency administrators or owners can perform this action.',
    });
  }
  next();
};
