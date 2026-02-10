import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  validated: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Review || mongoose.model('Review', ReviewSchema);
