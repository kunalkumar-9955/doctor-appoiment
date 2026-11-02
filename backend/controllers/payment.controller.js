const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment.model');
const Appointment = require('../models/Appointment.model');
const Doctor = require('../models/Doctor.model');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc   Create Razorpay order
// @route  POST /api/payments/create-order
exports.createOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await Appointment.findById(appointmentId).populate('doctor');
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    const options = {
      amount: appointment.fee * 100, // Razorpay uses paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: { appointmentId: appointmentId.toString() },
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    await Payment.create({
      appointment: appointmentId,
      patient: req.user.id,
      doctor: appointment.doctor._id,
      amount: appointment.fee,
      razorpayOrderId: order.id,
      status: 'created',
    });

    res.json({
      success: true,
      data: { orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Verify payment
// @route  POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign).digest('hex');

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: 'paid', razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature },
      { new: true }
    );

    // Update appointment payment status
    await Appointment.findByIdAndUpdate(payment.appointment, {
      paymentStatus: 'paid',
      paymentId: razorpay_payment_id,
    });

    // Update doctor earnings
    await Doctor.findByIdAndUpdate(payment.doctor, { $inc: { totalEarnings: payment.amount } });

    res.json({ success: true, message: 'Payment verified successfully', data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get payment history
// @route  GET /api/payments/history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ patient: req.user.id })
      .populate('appointment', 'appointmentDate timeSlot department')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort('-createdAt');
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get invoice
// @route  GET /api/payments/invoice/:id
exports.getInvoice = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('appointment')
      .populate('patient', 'name email phone address')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name email' } });

    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
    res.json({ success: true, data: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
