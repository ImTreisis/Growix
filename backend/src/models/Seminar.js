import mongoose from 'mongoose';

const seminarSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: Date, required: true },
    style: { type: String, enum: ['salsa', 'tango', 'bachata', 'kizomba', 'other'], required: true },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('Seminar', seminarSchema);


