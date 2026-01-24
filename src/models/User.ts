import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true, unique: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['UAH'], default: 'UAH' },
    productType: { type: String, enum: ['video_greeting', 'music_track', 'toy'], required: true },
    productData: { type: Object },
    contacts: { type: Object },
    orderDate: { type: Date },
  }, { timestamps: true }
);


const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  verificationCode: String,
  verificationCodeExpires: Date,
  orders: [OrderSchema],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);