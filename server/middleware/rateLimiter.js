import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 login attempts per window
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 8, // max 8 project enquiries per IP
  message: {
    success: false,
    message: 'Too many enquiry submissions from this IP. Please wait a few minutes before submitting another request.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const placesSearchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 60, // max 60 Google Places searches per 15 min per admin/IP
  message: {
    success: false,
    message: 'Search query rate limit reached. Please wait a short while before searching again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
