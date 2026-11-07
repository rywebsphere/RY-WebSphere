import bcrypt from 'bcryptjs';
import Enquiry from '../models/Enquiry.js';
import Project from '../models/Project.js';
import Service from '../models/Service.js';
import PricingPackage from '../models/PricingPackage.js';
import Testimonial from '../models/Testimonial.js';
import Setting from '../models/Setting.js';
import Admin from '../models/Admin.js';
import Lead from '../models/Lead.js';
import {
  sendProjectStatusUpdateEmail,
  sendProjectCompletedEmail,
  sendProjectCancelledEmail,
  sendTrackingNumberEmail,
  sendCustomClientEmail,
  sendStaffAccessApprovedEmail,
} from '../services/emailService.js';

// --- Dashboard Stats ---
export const getDashboardStats = async (req, res, next) => {
  try {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [
      totalEnquiries,
      newEnquiries,
      inDiscussion,
      proposalSent,
      wonProjects,
      lostProjects,
      contacted,
      totalProjects,
      publishedProjects,
      totalServices,
      pendingApprovals,
      totalTeam,
      totalLeads,
      newLeads,
      contactedLeads,
      interestedLeads,
      followUpsDue,
      proposalSentLeads,
      convertedLeads,
    ] = await Promise.all([
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ status: 'New' }),
      Enquiry.countDocuments({ status: 'In Discussion' }),
      Enquiry.countDocuments({ status: 'Proposal Sent' }),
      Enquiry.countDocuments({ status: 'Won' }),
      Enquiry.countDocuments({ status: 'Lost' }),
      Enquiry.countDocuments({ status: 'Contacted' }),
      Project.countDocuments(),
      Project.countDocuments({ isPublished: true }),
      Service.countDocuments(),
      Admin.countDocuments({ status: 'pending_approval' }),
      Admin.countDocuments({ role: 'employee' }),
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'New' }),
      Lead.countDocuments({ status: 'Contacted' }),
      Lead.countDocuments({ status: 'Interested' }),
      Lead.countDocuments({
        followUpDate: { $lte: endOfToday, $ne: null },
        status: { $nin: ['Converted', 'Not Interested', 'Do Not Contact'] },
      }),
      Lead.countDocuments({ status: 'Proposal Sent' }),
      Lead.countDocuments({ status: 'Converted' }),
    ]);

    const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(6);
    const recentLeads = await Lead.find().sort({ updatedAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalEnquiries,
          newEnquiries,
          contacted,
          inDiscussion,
          proposalSent,
          wonProjects,
          lostProjects,
          totalProjects,
          publishedProjects,
          totalServices,
          pendingApprovals,
          totalTeam,
          // CRM Lead Finder Stats
          totalLeads,
          newLeads,
          contactedLeads,
          interestedLeads,
          followUpsDue,
          proposalSentLeads,
          convertedLeads,
        },
        recentEnquiries,
        recentLeads,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --- Enquiries Management ---
export const getAdminEnquiries = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { businessName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    next(error);
  }
};

export const updateEnquiry = async (req, res, next) => {
  try {
    const {
      status,
      internalNotes,
      projectPhase,
      projectProgressPercent,
      projectStatusNote,
      estimatedCompletionDate,
      invoiceDetails,
    } = req.body;

    const existingEnquiry = await Enquiry.findById(req.params.id);
    if (!existingEnquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    const previousStatus = existingEnquiry.status;
    const previousProgress = existingEnquiry.projectProgressPercent;
    const previousPhase = existingEnquiry.projectPhase;

    const updateData = {};
    if (status) updateData.status = status;
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;
    if (projectPhase !== undefined) updateData.projectPhase = projectPhase;
    if (projectProgressPercent !== undefined) updateData.projectProgressPercent = projectProgressPercent;
    if (projectStatusNote !== undefined) updateData.projectStatusNote = projectStatusNote;
    if (estimatedCompletionDate !== undefined) updateData.estimatedCompletionDate = estimatedCompletionDate;
    if (invoiceDetails !== undefined) updateData.invoiceDetails = invoiceDetails;

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    // Check if client should receive an email notification
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    if (enquiry && enquiry.email) {
      if (status === 'Won' || enquiry.projectProgressPercent === 100) {
        if (previousStatus !== 'Won' || previousProgress !== 100) {
          sendProjectCompletedEmail({ to: enquiry.email, enquiry, clientUrl }).catch((err) =>
            console.error('[AdminController] Completed email error:', err.message)
          );
        }
      } else if (status === 'Lost' && previousStatus !== 'Lost') {
        sendProjectCancelledEmail({ to: enquiry.email, enquiry, clientUrl }).catch((err) =>
          console.error('[AdminController] Cancelled email error:', err.message)
        );
      } else if (
        (status && status !== previousStatus) ||
        (projectPhase && projectPhase !== previousPhase) ||
        (projectProgressPercent !== undefined && projectProgressPercent !== previousProgress) ||
        (projectStatusNote && projectStatusNote !== existingEnquiry.projectStatusNote)
      ) {
        sendProjectStatusUpdateEmail({ to: enquiry.email, enquiry, clientUrl }).catch((err) =>
          console.error('[AdminController] Status update email error:', err.message)
        );
      }
    }

    res.json({ success: true, message: 'Enquiry updated successfully.', data: enquiry });
  } catch (error) {
    next(error);
  }
};

export const sendTrackingEmailToClient = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    await sendTrackingNumberEmail({ to: enquiry.email, enquiry, clientUrl });

    res.json({
      success: true,
      message: `Tracking code email sent to ${enquiry.email} from rywebsphere@gmail.com.`,
    });
  } catch (error) {
    next(error);
  }
};

export const sendCustomEmailToClient = async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message content is required.' });
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    await sendCustomClientEmail({
      to: enquiry.email,
      name: enquiry.fullName,
      subject: subject || `Regarding Your Project with RY WebSphere [${enquiry.trackingCode}]`,
      message,
      trackingCode: enquiry.trackingCode,
      clientUrl,
    });

    res.json({
      success: true,
      message: `Custom email sent to ${enquiry.email} from rywebsphere@gmail.com.`,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found.' });
    }
    res.json({ success: true, message: 'Enquiry removed successfully.' });
  } catch (error) {
    next(error);
  }
};

// --- Project Management ---
export const getAdminProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      category,
      description,
      problemObjective,
      highlights,
      features,
      technologies,
      thumbnail,
      screenshots,
      demoUrl,
      githubUrl,
      isDemo,
      isPublished,
    } = req.body;

    const generatedSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const project = await Project.create({
      title,
      slug: generatedSlug,
      category,
      description,
      problemObjective,
      highlights: Array.isArray(highlights) ? highlights : highlights ? highlights.split('\n').filter(Boolean) : [],
      features: Array.isArray(features) ? features : features ? features.split('\n').filter(Boolean) : [],
      technologies: Array.isArray(technologies) ? technologies : technologies ? technologies.split(',').map((t) => t.trim()).filter(Boolean) : [],
      thumbnail,
      screenshots: Array.isArray(screenshots) ? screenshots : screenshots ? screenshots.split('\n').filter(Boolean) : [],
      demoUrl,
      githubUrl,
      isDemo: isDemo !== undefined ? isDemo : true,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json({ success: true, message: 'Project created successfully.', data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.highlights && typeof data.highlights === 'string') {
      data.highlights = data.highlights.split('\n').filter(Boolean);
    }
    if (data.features && typeof data.features === 'string') {
      data.features = data.features.split('\n').filter(Boolean);
    }
    if (data.technologies && typeof data.technologies === 'string') {
      data.technologies = data.technologies.split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (data.screenshots && typeof data.screenshots === 'string') {
      data.screenshots = data.screenshots.split('\n').filter(Boolean);
    }

    const project = await Project.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    res.json({ success: true, message: 'Project updated successfully.', data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    res.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// --- Service Management ---
export const getAdminServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const { title, slug, shortDescription, fullDescription, features, deliverables, icon, order, isPublished } = req.body;
    const generatedSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const service = await Service.create({
      title,
      slug: generatedSlug,
      shortDescription,
      fullDescription,
      features: Array.isArray(features) ? features : features ? features.split('\n').filter(Boolean) : [],
      deliverables: Array.isArray(deliverables) ? deliverables : deliverables ? deliverables.split('\n').filter(Boolean) : [],
      icon: icon || 'FaGlobe',
      order: order || 0,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json({ success: true, message: 'Service created successfully.', data: service });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.features && typeof data.features === 'string') {
      data.features = data.features.split('\n').filter(Boolean);
    }
    if (data.deliverables && typeof data.deliverables === 'string') {
      data.deliverables = data.deliverables.split('\n').filter(Boolean);
    }

    const service = await Service.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    res.json({ success: true, message: 'Service updated successfully.', data: service });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }
    res.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// --- Pricing Management ---
export const getAdminPricing = async (req, res, next) => {
  try {
    const packages = await PricingPackage.find().sort({ order: 1 });
    res.json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    next(error);
  }
};

export const createPricing = async (req, res, next) => {
  try {
    const { name, slug, price, currency, period, description, features, revisionLimit, deliveryEstimate, isPopular, isPublished, order } = req.body;
    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const pkg = await PricingPackage.create({
      name,
      slug: generatedSlug,
      price,
      currency: currency || '₹',
      period: period || 'one-time starting price',
      description,
      features: Array.isArray(features) ? features : features ? features.split('\n').filter(Boolean) : [],
      revisionLimit: revisionLimit || 'Up to 2 revision rounds',
      deliveryEstimate: deliveryEstimate || '3 to 5 business days',
      isPopular: !!isPopular,
      isPublished: isPublished !== undefined ? isPublished : true,
      order: order || 0,
    });

    res.status(201).json({ success: true, message: 'Pricing package created successfully.', data: pkg });
  } catch (error) {
    next(error);
  }
};

export const updatePricing = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (data.features && typeof data.features === 'string') {
      data.features = data.features.split('\n').filter(Boolean);
    }

    const pkg = await PricingPackage.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Pricing package not found.' });
    }

    res.json({ success: true, message: 'Pricing package updated successfully.', data: pkg });
  } catch (error) {
    next(error);
  }
};

export const deletePricing = async (req, res, next) => {
  try {
    const pkg = await PricingPackage.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Pricing package not found.' });
    }
    res.json({ success: true, message: 'Pricing package deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// --- Testimonials Management ---
export const getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

export const createTestimonial = async (req, res, next) => {
  try {
    const { clientName, companyName, projectType, feedback, rating, avatarUrl, isPublished } = req.body;
    const testimonial = await Testimonial.create({
      clientName,
      companyName,
      projectType,
      feedback,
      rating: rating || 5,
      avatarUrl,
      isPublished: isPublished !== undefined ? isPublished : false,
    });

    res.status(201).json({ success: true, message: 'Testimonial added successfully.', data: testimonial });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }

    res.json({ success: true, message: 'Testimonial updated successfully.', data: testimonial });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found.' });
    }
    res.json({ success: true, message: 'Testimonial deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// --- Website Settings Management ---
export const getAdminSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateAdminSettings = async (req, res, next) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json({ success: true, message: 'Website settings updated successfully.', data: settings });
  } catch (error) {
    next(error);
  }
};

// --- Team & Employee Management ---
export const getTeamMembers = async (req, res, next) => {
  try {
    const members = await Admin.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, count: members.length, data: members });
  } catch (error) {
    next(error);
  }
};

export const createTeamMember = async (req, res, next) => {
  try {
    const { name, email, password, role, title, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required to register an employee.',
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
      return res.status(400).json({
        success: false,
        message: 'A user account with this email already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newMember = await Admin.create({
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: role === 'admin' ? 'admin' : 'employee',
      title: title?.trim() || (role === 'admin' ? 'Co-Administrator' : 'Client Inquiries & Support Specialist'),
      phone: phone?.trim() || '',
      isActive: true,
      status: 'approved',
    });

    // Send welcome and credentials confirmation from rywebsphere@gmail.com
    sendStaffAccessApprovedEmail({
      to: newMember.email,
      name: newMember.name,
      title: newMember.title,
      loginUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/login`,
    }).catch((err) => console.error('[AdminController] New staff email dispatch error:', err.message));

    const memberData = newMember.toObject();
    delete memberData.passwordHash;

    res.status(201).json({
      success: true,
      message: `Employee "${newMember.name}" (${newMember.role}) created successfully.`,
      data: memberData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, title, phone, role, isActive, newPassword, status } = req.body;

    const member = await Admin.findById(id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    // Protect superadmin from being demoted or deactivated
    if (member.role === 'superadmin' && (isActive === false || role !== 'superadmin' || status === 'deactivated')) {
      return res.status(400).json({
        success: false,
        message: 'The primary owner account cannot be deactivated or demoted.',
      });
    }

    if (name) member.name = name.trim();
    if (title !== undefined) member.title = title.trim();
    if (phone !== undefined) member.phone = phone.trim();
    if (role && member.role !== 'superadmin') member.role = role;
    if (isActive !== undefined && member.role !== 'superadmin') member.isActive = isActive;

    if (status && member.role !== 'superadmin') {
      member.status = status;
      if (status === 'approved') {
        member.isActive = true;
        member.approvedBy = req.admin.email;
        member.approvedAt = new Date();

        // Send approval & portal activation email from rywebsphere@gmail.com
        sendStaffAccessApprovedEmail({
          to: member.email,
          name: member.name,
          title: member.title,
          loginUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/login`,
        }).catch((err) => console.error('[AdminController] Staff approval email error:', err.message));
      } else if (status === 'rejected' || status === 'deactivated') {
        member.isActive = false;
      }
    }

    if (newPassword && newPassword.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      member.passwordHash = await bcrypt.hash(newPassword.trim(), salt);
    }

    await member.save();

    const memberData = member.toObject();
    delete memberData.passwordHash;

    res.json({
      success: true,
      message: 'Team member updated successfully.',
      data: memberData,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;

    const member = await Admin.findById(id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Team member not found.' });
    }

    if (member.role === 'superadmin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the primary owner/superadmin account.',
      });
    }

    if (req.admin._id.toString() === id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account.',
      });
    }

    await Admin.findByIdAndDelete(id);
    res.json({
      success: true,
      message: `Employee account "${member.name}" deleted successfully.`,
    });
  } catch (error) {
    next(error);
  }
};
