import mongoose from 'mongoose';

const PricingPackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Package slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    priceUSD: {
      type: Number,
      default: 49,
    },
    currency: {
      type: String,
      default: '₹',
    },
    period: {
      type: String,
      default: 'one-time starting price',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    features: {
      type: [String],
      default: [],
    },
    revisionLimit: {
      type: String,
      default: 'Up to 2 revision rounds',
    },
    deliveryEstimate: {
      type: String,
      default: '3 to 5 business days',
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

PricingPackageSchema.index({ order: 1 });

export default mongoose.model('PricingPackage', PricingPackageSchema);
