import express from 'express';
import {
  loginAdmin,
  logoutAdmin,
  getMe,
  changePassword,
  requestStaffAccess,
  forgotPassword,
  verifyResetOtp,
  resetPasswordWithOtp,
  sendEmailVerificationOtp,
  verifyEmailOtp,
  sendLoginOtp,
  verifyLoginOtp,
} from '../controllers/authController.js';
import { updateMyWorkStatus } from '../controllers/attendanceController.js';
import { protectAdmin } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login', loginLimiter, loginAdmin);
router.post('/logout', protectAdmin, logoutAdmin);
router.put('/work-status', protectAdmin, updateMyWorkStatus);
router.post('/staff-request', loginLimiter, requestStaffAccess);
router.get('/me', protectAdmin, getMe);
router.post('/change-password', protectAdmin, changePassword);

// Official Email OTP & Authentication Endpoints (sent from rywebsphere@gmail.com)
router.post('/forgot-password', loginLimiter, forgotPassword);
router.post('/verify-reset-otp', loginLimiter, verifyResetOtp);
router.post('/reset-password', loginLimiter, resetPasswordWithOtp);
router.post('/send-verification-otp', loginLimiter, sendEmailVerificationOtp);
router.post('/verify-email-otp', loginLimiter, verifyEmailOtp);
router.post('/send-login-otp', loginLimiter, sendLoginOtp);
router.post('/verify-login-otp', loginLimiter, verifyLoginOtp);

export default router;
