import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    seminar: { type: mongoose.Schema.Types.ObjectId, ref: 'Seminar', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestEmail: { type: String, default: '', trim: true, lowercase: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    paidAt: { type: Date, default: null },
    stripePaymentIntentId: { type: String, default: '' },
    amountCents: { type: Number, default: 0 },
    platformFeeCents: { type: Number, default: 0 },
  },
  { timestamps: true }
);

registrationSchema.index(
  { seminar: 1, user: 1 },
  { unique: true, partialFilterExpression: { user: { $type: 'objectId' } } }
);
registrationSchema.index(
  { seminar: 1, guestEmail: 1 },
  { unique: true, partialFilterExpression: { guestEmail: { $type: 'string', $gt: '' } } }
);

export default mongoose.model('Registration', registrationSchema);
