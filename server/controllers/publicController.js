import validator from 'validator';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import PricingPackage from '../models/PricingPackage.js';
import Testimonial from '../models/Testimonial.js';
import Setting from '../models/Setting.js';
import Enquiry from '../models/Enquiry.js';
import {
  sendServiceRequestConfirmationEmail,
  sendAdminNewEnquiryAlert,
} from '../services/emailService.js';

// Get all published services
export const getPublicServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isPublished: true }).sort({ order: 1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
};

// Get single published service by slug
export const getPublicServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({
      slug: req.params.slug.toLowerCase().trim(),
      isPublished: true,
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// Get all published projects
export const getPublicProjects = async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = { isPublished: true };

    if (category && category !== 'All Projects' && category !== 'All') {
      filter.category = category;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// Get single published project by slug
export const getPublicProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      slug: req.params.slug.toLowerCase().trim(),
      isPublished: true,
    });
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// Get all published pricing packages
export const getPublicPricing = async (req, res, next) => {
  try {
    const packages = await PricingPackage.find({ isPublished: true }).sort({ order: 1 });
    res.json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    next(error);
  }
};

// Get all published testimonials
export const getPublicTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

// Get public website settings
export const getPublicSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }

    // Return only safe public fields
    res.json({
      success: true,
      data: {
        brandName: settings.brandName,
        ownerName: settings.ownerName,
        tagline: settings.tagline,
        announcementText: settings.announcementText,
        announcementEnabled: settings.announcementEnabled,
        businessEmail: settings.businessEmail,
        whatsappNumber: settings.whatsappNumber,
        portfolioUrl: settings.portfolioUrl,
        socialLinks: settings.socialLinks,
        serviceAreas: settings.serviceAreas,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Submit project enquiry / consultation lead
export const submitEnquiry = async (req, res, next) => {
  try {
    const {
      fullName,
      businessName,
      businessCategory,
      email,
      phone,
      requiredService,
      serviceRequested,
      selectedPackage,
      budget,
      projectDescription,
      message,
      preferredContactMethod,
      trapField, // Honeypot field for bot spam detection
    } = req.body;

    // Honeypot check - if hidden bot trap is filled, silently reject or simulate success
    if (trapField) {
      return res.status(200).json({
        success: true,
        message: 'Thank you! Your enquiry has been received.',
      });
    }

    const resolvedService = (requiredService || serviceRequested || 'Website Development').trim();
    const resolvedCategory = (businessCategory || 'General Business').trim();
    const resolvedDescription = (projectDescription || message || 'New consultation inquiry').trim();
    const resolvedBusiness = (businessName || 'Independent Client').trim();

    // Server-side validation
    if (!fullName || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your full name, email, and phone number.',
      });
    }

    if (!validator.isEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    // Clean inputs
    const sanitizedEmail = validator.normalizeEmail(email.trim());
    const sanitizedFullName = validator.escape(fullName.trim());
    const sanitizedBusinessName = validator.escape(resolvedBusiness);
    const sanitizedCategory = validator.escape(resolvedCategory);
    const sanitizedPhone = phone.trim().replace(/[^\d+()\-\s]/g, '');

    const trackingCode = `RY-${Math.floor(10000 + Math.random() * 90000)}`;

    const newEnquiry = await Enquiry.create({
      fullName: sanitizedFullName,
      businessName: sanitizedBusinessName,
      businessCategory: sanitizedCategory,
      email: sanitizedEmail,
      phone: sanitizedPhone,
      requiredService: resolvedService,
      selectedPackage: selectedPackage ? selectedPackage.trim() : 'Custom / Discussion',
      budget: budget ? budget.trim() : 'Flexible / Based on Scope',
      projectDescription: resolvedDescription,
      preferredContactMethod: preferredContactMethod || 'WhatsApp',
      status: 'New',
      trackingCode,
      projectPhase: 'Discovery',
      projectProgressPercent: 15,
      projectStatusNote: 'Enquiry received. Initial requirements discovery in progress.',
    });

    // 1. Send official branded confirmation email with tracking code to client from rywebsphere@gmail.com
    sendServiceRequestConfirmationEmail({
      to: sanitizedEmail,
      enquiry: newEnquiry,
      clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    }).catch((err) => {
      console.error('[PublicController] Client confirmation email error:', err.message);
    });

    // 2. Send official notification to agency admin at rywebsphere@gmail.com
    sendAdminNewEnquiryAlert({
      enquiry: newEnquiry,
      clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    }).catch((err) => {
      console.error('[PublicController] Admin enquiry alert error:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting RY WebSphere! We have received your project details and will review your requirements promptly.',
      referenceId: newEnquiry._id,
      trackingCode: newEnquiry.trackingCode,
    });
  } catch (error) {
    next(error);
  }
};

// Track Project Live Progress by Tracking Code or Reference ID
export const trackProject = async (req, res, next) => {
  try {
    const { code } = req.params;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Tracking code required.' });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check by trackingCode or by MongoDB ID
    let enquiry = await Enquiry.findOne({ trackingCode: cleanCode });
    if (!enquiry && cleanCode.length === 24) {
      enquiry = await Enquiry.findById(cleanCode);
    }

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: `No active project found with reference code "${cleanCode}". Please verify your reference number or contact us directly on WhatsApp.`,
      });
    }

    res.json({
      success: true,
      data: {
        trackingCode: enquiry.trackingCode || `RY-${enquiry._id.toString().slice(-5).toUpperCase()}`,
        clientName: enquiry.fullName,
        businessName: enquiry.businessName,
        requiredService: enquiry.requiredService,
        selectedPackage: enquiry.selectedPackage,
        budget: enquiry.budget,
        status: enquiry.status,
        projectPhase: enquiry.projectPhase || 'Discovery',
        projectProgressPercent: enquiry.projectProgressPercent || (enquiry.status === 'Won' ? 85 : 25),
        projectStatusNote: enquiry.projectStatusNote || 'Project is active and progressing through scheduled milestones.',
        estimatedCompletionDate: enquiry.estimatedCompletionDate || null,
        createdAt: enquiry.createdAt,
        updatedAt: enquiry.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
