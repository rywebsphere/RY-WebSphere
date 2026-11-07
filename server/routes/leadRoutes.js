import express from 'express';
import { protectAdmin, requireSuperAdmin } from '../middleware/auth.js';
import { placesSearchLimiter } from '../middleware/rateLimiter.js';
import {
  searchGooglePlaces,
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  recordContactAttempt,
  deleteLead,
  getLeadStats,
} from '../controllers/leadController.js';

const router = express.Router();

// All lead routes require authentication
router.use(protectAdmin);

// Google Places Search
router.get('/search', placesSearchLimiter, searchGooglePlaces);

// CRM Analytics & Stats
router.get('/stats', getLeadStats);

// Lead CRUD & Outreach History
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.post('/:id/contact-attempt', recordContactAttempt);
router.delete('/:id', requireSuperAdmin, deleteLead);

export default router;
