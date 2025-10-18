import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    username: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    bio: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    instagram: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    facebook: { type: String, default: '' },
    savedSeminars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seminar' }],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);


