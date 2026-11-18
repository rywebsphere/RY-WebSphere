import mongoose from 'mongoose';

const EnquirySchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [120, 'Business name cannot exceed 120 characters'],
    },
    businessCategory: {
      type: String,
      required: [true, 'Business category is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    requiredService: {
      type: String,
      required: [true, 'Required service is required'],
      trim: true,
    },
    selectedPackage: {
      type: String,
      default: 'Custom / Discussion',
      trim: true,
    },
    budget: {
      type: String,
      default: 'Flexible / Based on Scope',
      trim: true,
    },
    nicheCategory: {
      type: String,
      default: '',
      trim: true,
    },
    selectedPages: {
      type: [String],
      default: [],
    },
    selectedFeatures: {
      type: [String],
      default: [],
    },
    referenceImages: {
      type: [String], // Array of base64 data URLs or uploaded URLs
      default: [],
    },
    referenceLink: {
      type: String,
      default: '',
      trim: true,
    },
    projectDescription: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [3000, 'Project description cannot exceed 3000 characters'],
    },
    preferredContactMethod: {
      type: String,
      enum: ['WhatsApp', 'Email', 'Phone Call'],
      default: 'WhatsApp',
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'In Discussion', 'Proposal Sent', 'Won', 'Lost'],
      default: 'New',
    },
    internalNotes: {
      type: String,
      default: '',
    },
    trackingCode: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    projectPhase: {
      type: String,
      enum: [
        'Discovery',
        'Discovery & Planning',
        'Wireframing & UI/UX',
        'UI/UX Design',
        'Full-Stack Development',
        'Development',
        'Testing & Revisions',
        'SEO & Cloud Deployment',
        'Cloud Deployment',
        'Completed',
        'Completed & Handed Over',
      ],
      default: 'Discovery & Planning',
    },
    projectProgressPercent: {
      type: Number,
      default: 20,
      min: 0,
      max: 100,
    },
    projectStatusNote: {
      type: String,
      default: 'Project scope initialized. Technical architecture and asset collection in progress.',
    },
    estimatedCompletionDate: {
      type: Date,
    },
    invoiceDetails: {
      invoiceNumber: String,
      advancePaid: { type: Number, default: 0 },
      balanceDue: { type: Number, default: 0 },
      totalAmount: { type: Number, default: 0 },
      domainCharge: { type: Number, default: 0 },
      cloudHostingCharge: { type: Number, default: 0 },
      currency: { type: String, default: '₹' },
    },
  },
  {
    timestamps: true,
  }
);

EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ status: 1 });

export default mongoose.model('Enquiry', EnquirySchema);
