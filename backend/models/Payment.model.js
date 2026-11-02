const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: { type: String, enum: ['razorpay', 'stripe', 'cash'], default: 'razorpay' },
    status: { type: String, enum: ['created', 'paid', 'failed', 'refunded'], default: 'created' },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    stripeSessionId: String,
    invoiceNumber: { type: String, unique: true, sparse: true },
    refundId: String,
    refundAmount: Number,
    refundedAt: Date,
    paidAt: Date,
  },
  { timestamps: true }
);

// Auto-generate invoice number
paymentSchema.pre('save', function (next) {
  if (!this.invoiceNumber && this.status === 'paid') {
    this.invoiceNumber = `MC-INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    this.paidAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);
