import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      default: 'RY WebSphere',
      trim: true,
    },
    ownerName: {
      type: String,
      default: 'Ranjan Yadav',
      trim: true,
    },
    tagline: {
      type: String,
      default: 'Your Vision. Our Web. Unlimited Possibilities.',
      trim: true,
    },
    announcementText: {
      type: String,
      default: 'Professional Website Packages Starting at ₹2,999',
      trim: true,
    },
    announcementEnabled: {
      type: Boolean,
      default: true,
    },
    businessEmail: {
      type: String,
      default: 'rywebsphere@gmail.com',
      trim: true,
    },
    whatsappNumber: {
      type: String,
      default: 'YOUR_WHATSAPP_NUMBER',
      trim: true,
    },
    portfolioUrl: {
      type: String,
      default: 'YOUR_PORTFOLIO_URL',
      trim: true,
    },
    socialLinks: {
      github: { type: String, default: 'https://github.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      twitter: { type: String, default: 'https://twitter.com' },
      instagram: { type: String, default: '' },
    },
    serviceAreas: {
      type: [String],
      default: ['India (All States & Cities)', 'International Clients (US, UK, UAE, Global Remote)'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Setting', SettingSchema);
