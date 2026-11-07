import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Project category is required'],
      enum: [
        'Gym',
        'Salon',
        'Healthcare',
        'Restaurant',
        'Education',
        'Business',
        'E-commerce',
        'Web Applications',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    problemObjective: {
      type: String,
      default: '',
    },
    highlights: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    technologies: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    screenshots: {
      type: [String],
      default: [],
    },
    demoUrl: {
      type: String,
      default: '',
    },
    githubUrl: {
      type: String,
      default: '',
    },
    isDemo: {
      type: Boolean,
      default: true, // Default to demo project per transparency requirement
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

ProjectSchema.index({ category: 1 });
ProjectSchema.index({ isPublished: 1 });

export default mongoose.model('Project', ProjectSchema);
