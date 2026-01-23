import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  trackId: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  orderReference: String,
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  verificationCode: String,
  verificationCodeExpires: Date,
  orders: [OrderSchema],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);