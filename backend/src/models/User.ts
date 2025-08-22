import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  tenantId: string;
  role: 'admin' | 'user' | 'owner';
  subscription?: {
    plan: string;
    status: 'active' | 'inactive' | 'trial' | 'cancelled';
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tenantId: {
    type: String,
    required: true,
    index: true
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'owner'],
    default: 'user'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'trial', 'cancelled'],
      default: 'trial'
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    currentPeriodEnd: Date
  }
}, {
  timestamps: true
});

// Compound index for tenant-based queries
userSchema.index({ tenantId: 1, email: 1 });

export const User = mongoose.model<IUser>('User', userSchema);