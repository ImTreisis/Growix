import mongoose from 'mongoose';

const seminarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
    localDateTime: { type: String, required: true, trim: true, default: '' },
    timeZone: { type: String, default: 'UTC' },
    type: { type: String, enum: ['workshop', 'event'], default: 'workshop' },
    style: { type: String, default: '' },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: null },
    endDate: { type: Date, default: null },
    endLocalDateTime: { type: String, default: '' },
    venue: { type: String, required: true, trim: true },
    price: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('Seminar', seminarSchema);


