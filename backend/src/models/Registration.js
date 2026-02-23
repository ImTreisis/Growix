import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    seminar: { type: mongoose.Schema.Types.ObjectId, ref: 'Seminar', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    paidAt: { type: Date, default: null },
    stripePaymentIntentId: { type: String, default: '' },
    amountCents: { type: Number, default: 0 },
    platformFeeCents: { type: Number, default: 0 },
  },
  { timestamps: true }
);

registrationSchema.index({ seminar: 1, user: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
