import express from 'express';
import { protectAdmin, requireSuperAdmin } from '../middleware/auth.js';
import { getTeamMonitoring, getEmployeeAttendanceHistory } from '../controllers/attendanceController.js';
import {
  getDashboardStats,
  getAdminEnquiries,
  updateEnquiry,
  deleteEnquiry,
  sendTrackingEmailToClient,
  sendCustomEmailToClient,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  getAdminServices,
  createService,
  updateService,
  deleteService,
  getAdminPricing,
  createPricing,
  updatePricing,
  deletePricing,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAdminSettings,
  updateAdminSettings,
  getTeamMembers,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from '../controllers/adminController.js';

const router = express.Router();

// Apply authentication middleware to all admin endpoints
router.use(protectAdmin);

// Stats (Available to Owner and Employees)
router.get('/dashboard-stats', getDashboardStats);

// Enquiries (Available to Owner and Employees to view & respond to client queries)
router.get('/enquiries', getAdminEnquiries);
router.put('/enquiries/:id', updateEnquiry);
router.post('/enquiries/:id/send-tracking', sendTrackingEmailToClient);
router.post('/enquiries/:id/send-email', sendCustomEmailToClient);
router.delete('/enquiries/:id', requireSuperAdmin, deleteEnquiry);

// Projects
router.get('/projects', getAdminProjects);
router.post('/projects', createProject);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', requireSuperAdmin, deleteProject);

// Services
router.get('/services', getAdminServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', requireSuperAdmin, deleteService);

// Pricing
router.get('/pricing', getAdminPricing);
router.post('/pricing', createPricing);
router.put('/pricing/:id', updatePricing);
router.delete('/pricing/:id', requireSuperAdmin, deletePricing);

// Testimonials
router.get('/testimonials', getAdminTestimonials);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', requireSuperAdmin, deleteTestimonial);

// Settings (Superadmin only)
router.get('/settings', getAdminSettings);
router.put('/settings', requireSuperAdmin, updateAdminSettings);

// Team & Employee Management & Live Shift Monitoring (Superadmin / Admin only)
router.get('/team/monitoring', requireSuperAdmin, getTeamMonitoring);
router.get('/team/:id/attendance', requireSuperAdmin, getEmployeeAttendanceHistory);
router.get('/team', requireSuperAdmin, getTeamMembers);
router.post('/team', requireSuperAdmin, createTeamMember);
router.put('/team/:id', requireSuperAdmin, updateTeamMember);
router.delete('/team/:id', requireSuperAdmin, deleteTeamMember);

export default router;
