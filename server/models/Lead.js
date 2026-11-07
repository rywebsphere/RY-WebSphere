import mongoose from 'mongoose';

const ContactAttemptSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ['Call', 'WhatsApp', 'Email', 'Meeting', 'Other'],
      default: 'Call',
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    outcome: {
      type: String,
      enum: [
        'Connected',
        'No Answer',
        'Interested',
        'Follow-up Requested',
        'Declined',
        'Proposal Requested',
        'Wrong Number',
      ],
      default: 'Connected',
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    performedByName: {
      type: String,
      default: '',
    },
  },
  { _id: true }
);

const LeadSchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [160, 'Business name cannot exceed 160 characters'],
    },
    category: {
      type: String,
      required: [true, 'Business category is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    internationalPhone: {
      type: String,
      trim: true,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    hasWebsite: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: null,
    },
    userRatingsTotal: {
      type: Number,
      default: 0,
    },
    googleMapsUrl: {
      type: String,
      trim: true,
      default: '',
    },
    placeId: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        'New',
        'Contacted',
        'Interested',
        'Follow-up',
        'Proposal Sent',
        'Converted',
        'Not Interested',
        'Do Not Contact',
      ],
      default: 'New',
      index: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
      index: true,
    },
    assignedToName: {
      type: String,
      default: 'Unassigned',
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    createdByName: {
      type: String,
      default: 'Ranjan Yadav (Owner)',
      trim: true,
    },
    internalNotes: {
      type: String,
      default: '',
      trim: true,
    },
    contactAttempts: [ContactAttemptSchema],
    followUpDate: {
      type: Date,
      default: null,
      index: true,
    },
    followUpNotes: {
      type: String,
      default: '',
      trim: true,
    },
    quotationDetails: {
      service: { type: String, default: 'Custom Website Development' },
      proposedBudget: { type: String, default: '₹2,999' },
      notes: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for fast CRM searching
LeadSchema.index({
  businessName: 'text',
  category: 'text',
  location: 'text',
  address: 'text',
  phone: 'text',
});

const Lead = mongoose.model('Lead', LeadSchema);

export default Lead;
