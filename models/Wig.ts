import mongoose, { Schema, model, models } from 'mongoose';

export interface IWig {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  price: number;
  discount?: number;
  finalPrice: number;
  color: string;
  stock: number;
  available: boolean;
  images: string[];
  video?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WigSchema = new Schema<IWig>(
  {
    name: {
      type: String,
      required: [true, 'Wig name is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    finalPrice: {
      type: Number,
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: 0,
      default: 0,
    },
    available: {
      type: Boolean,
      default: true,
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (v: string[]) {
          return v.length > 0;
        },
        message: 'At least one image is required',
      },
    },
    video: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug from name before saving
WigSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Calculate final price based on discount
  if (this.isModified('price') || this.isModified('discount')) {
    const discountAmount = (this.price * (this.discount || 0)) / 100;
    this.finalPrice = this.price - discountAmount;
  }

  next();
});

const Wig = models.Wig || model<IWig>('Wig', WigSchema);

export default Wig;
