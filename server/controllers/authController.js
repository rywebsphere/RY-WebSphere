import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { recordStatusChange } from './attendanceController.js';
import {
  sendVerificationOtpEmail,
  sendLoginOtpEmail,
  sendPasswordResetOtpEmail,
  sendPasswordResetSuccessEmail,
  sendStaffAccessRequestedEmail,
  sendAdminNewStaffRequestAlert,
  sendAdminSecurityAlert,
} from '../services/emailService.js';

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Access denied.',
      });
    }

    if (admin.status === 'pending_approval') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval by agency owner Ranjan Yadav. Once approved, you will be able to log in.',
      });
    }

    if (admin.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: 'Your staff access request was not approved. Please contact the agency owner.',
      });
    }

    if (admin.status === 'deactivated' || admin.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'This account has been deactivated. Please contact the agency owner.',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Access denied.',
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'ry_websphere_super_secret_jwt_key_2026',
      { expiresIn: '7d' }
    );

    // Automatically punch in shift and set workStatus to active
    try {
      await recordStatusChange(admin._id, 'active', admin.name);
    } catch (attErr) {
      console.warn('Shift punch-in error:', attErr.message);
    }

    res.json({
      success: true,
      message: 'Authentication successful.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        title: admin.title || (admin.role === 'employee' ? 'Staff Member' : 'Agency Owner'),
        phone: admin.phone || '',
        workStatus: 'active',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutAdmin = async (req, res, next) => {
  try {
    if (req.admin) {
      await recordStatusChange(req.admin._id, 'off_duty', req.admin.name);
    }
    res.json({
      success: true,
      message: 'Logged out successfully and shift closed as off duty.',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      admin: req.admin,
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password.',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters long.',
      });
    }

    const admin = await Admin.findById(req.admin._id);
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword, salt);
    await admin.save();

    res.json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const requestStaffAccess = async (req, res, next) => {
  try {
    const { name, email, password, phone, title } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required to request staff access.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await Admin.findOne({ email: cleanEmail });
    if (existing) {
      if (existing.status === 'pending_approval') {
        return res.status(400).json({
          success: false,
          message: 'An access request for this email is already awaiting owner approval.',
        });
      }
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const staffRequest = await Admin.create({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: 'employee',
      title: title?.trim() || 'Client Inquiries & Support Specialist',
      phone: phone?.trim() || '',
      isActive: false,
      status: 'pending_approval',
    });

    // 1. Send confirmation email to applicant from rywebsphere@gmail.com
    sendStaffAccessRequestedEmail({
      to: cleanEmail,
      name: name.trim(),
      title: staffRequest.title,
    }).catch((err) => console.error('[AuthController] Applicant confirmation email error:', err.message));

    // 2. Send notification to owner/admin at rywebsphere@gmail.com
    sendAdminNewStaffRequestAlert({
      staff: staffRequest,
      adminUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/team`,
    }).catch((err) => console.error('[AuthController] Admin staff request alert error:', err.message));

    res.status(201).json({
      success: true,
      message: `Access request submitted! Agency owner Ranjan Yadav will review and approve your account. Once approved, you can log in.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Request Password Reset OTP
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide your registered email address.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    // For privacy/security, if user doesn't exist, we still return success message
    if (!admin) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, a 6-digit recovery code has been dispatched.',
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.resetPasswordOtp = otp;
    admin.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await admin.save();

    // Send official branded recovery email from rywebsphere@gmail.com
    await sendPasswordResetOtpEmail({
      to: admin.email,
      name: admin.name,
      otp,
      expiresInMinutes: 15,
    });

    res.json({
      success: true,
      message: 'A 6-digit recovery code has been sent from rywebsphere@gmail.com to your email.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Password Reset OTP
 */
export const verifyResetOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin || !admin.resetPasswordOtp || admin.resetPasswordOtp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired recovery code.' });
    }

    if (admin.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'This recovery code has expired. Please request a new one.' });
    }

    res.json({ success: true, message: 'Recovery code verified successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * Reset Password with Verified OTP
 */
export const resetPasswordWithOtp = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, OTP code, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin || !admin.resetPasswordOtp || admin.resetPasswordOtp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired recovery code.' });
    }

    if (admin.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'This recovery code has expired. Please request a new one.' });
    }

    const salt = await bcrypt.genSalt(10);
    admin.passwordHash = await bcrypt.hash(newPassword.trim(), salt);
    admin.resetPasswordOtp = null;
    admin.resetPasswordExpires = null;
    await admin.save();

    // Send security notification confirmation from rywebsphere@gmail.com
    sendPasswordResetSuccessEmail({
      to: admin.email,
      name: admin.name,
    }).catch((err) => console.error('[AuthController] Security reset notice error:', err.message));

    res.json({
      success: true,
      message: 'Your password has been successfully reset. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Send Email Verification OTP
 */
export const sendEmailVerificationOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (admin) {
      admin.emailVerificationOtp = otp;
      admin.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
      await admin.save();
    }

    await sendVerificationOtpEmail({
      to: cleanEmail,
      name: admin?.name || 'User',
      otp,
      expiresInMinutes: 10,
    });

    res.json({
      success: true,
      message: `Verification OTP has been sent from rywebsphere@gmail.com to ${cleanEmail}.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Email OTP
 */
export const verifyEmailOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin || !admin.emailVerificationOtp || admin.emailVerificationOtp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid verification OTP.' });
    }

    if (admin.emailVerificationExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Verification OTP has expired.' });
    }

    admin.isEmailVerified = true;
    admin.emailVerificationOtp = null;
    admin.emailVerificationExpires = null;
    await admin.save();

    res.json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * Request Two-Factor / Login OTP
 */
export const sendLoginOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin) {
      return res.status(404).json({ success: false, message: 'No account registered with this email.' });
    }

    if (admin.status !== 'approved' || !admin.isActive) {
      return res.status(403).json({ success: false, message: 'Account is not approved or is inactive.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    admin.loginOtp = otp;
    admin.loginOtpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    await admin.save();

    await sendLoginOtpEmail({
      to: admin.email,
      name: admin.name,
      otp,
      expiresInMinutes: 5,
    });

    res.json({
      success: true,
      message: `Login OTP code sent from rywebsphere@gmail.com to ${cleanEmail}.`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Login OTP and sign in
 */
export const verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and login OTP are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: cleanEmail });

    if (!admin || !admin.loginOtp || admin.loginOtp !== otp.trim()) {
      return res.status(400).json({ success: false, message: 'Invalid or incorrect login code.' });
    }

    if (admin.loginOtpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Login code has expired. Please request a new one.' });
    }

    admin.loginOtp = null;
    admin.loginOtpExpires = null;
    await admin.save();

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET || 'ry_websphere_dev_jwt_secret_token_key_2026_xyz',
      { expiresIn: '7d' }
    );

    try {
      await recordStatusChange(admin._id, 'active', admin.name);
    } catch (attErr) {
      console.warn('Punch-in error on OTP login:', attErr.message);
    }

    res.json({
      success: true,
      message: 'OTP authentication successful.',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        title: admin.title || (admin.role === 'employee' ? 'Staff Member' : 'Agency Owner'),
        phone: admin.phone || '',
        workStatus: 'active',
      },
    });
  } catch (error) {
    next(error);
  }
};
