import express from 'express';
import {
  getPublicServices,
  getPublicServiceBySlug,
  getPublicProjects,
  getPublicProjectBySlug,
  getPublicPricing,
  getPublicTestimonials,
  getPublicSettings,
  submitEnquiry,
  trackProject,
} from '../controllers/publicController.js';
import { enquiryLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/services', getPublicServices);
router.get('/services/:slug', getPublicServiceBySlug);

router.get('/projects', getPublicProjects);
router.get('/projects/:slug', getPublicProjectBySlug);

router.get('/pricing', getPublicPricing);
router.get('/testimonials', getPublicTestimonials);
router.get('/settings', getPublicSettings);

router.post('/enquiries', enquiryLimiter, submitEnquiry);
router.get('/track/:code', trackProject);

export default router;
