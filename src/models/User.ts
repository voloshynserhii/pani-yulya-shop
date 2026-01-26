import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  verificationCode: String,
  verificationCodeExpires: Date,
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);