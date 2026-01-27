import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    reference: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['UAH'], default: 'UAH' },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    productType: { type: String, enum: ['video_greeting', 'music_track', 'toy'], required: true },
    productData: { type: mongoose.Schema.Types.Mixed },
    contacts: { type: mongoose.Schema.Types.Mixed },
    orderDate: { type: Date },
    userEmail: { type: String },
  }, { timestamps: true }
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);