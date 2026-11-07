import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
      default: '',
    },
    projectType: {
      type: String,
      trim: true,
      default: '',
    },
    feedback: {
      type: String,
      required: [true, 'Feedback text is required'],
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

TestimonialSchema.index({ isPublished: 1, createdAt: -1 });

export default mongoose.model('Testimonial', TestimonialSchema);
