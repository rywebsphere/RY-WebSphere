import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Service slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
    },
    fullDescription: {
      type: String,
      required: [true, 'Full description is required'],
    },
    features: {
      type: [String],
      default: [],
    },
    deliverables: {
      type: [String],
      default: [],
    },
    icon: {
      type: String,
      default: 'FaGlobe',
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

ServiceSchema.index({ order: 1 });

export default mongoose.model('Service', ServiceSchema);
