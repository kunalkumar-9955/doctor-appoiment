const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['blood_test', 'xray', 'mri', 'ct_scan', 'ecg', 'urine_test', 'prescription', 'other'],
      required: true,
    },
    description: String,
    file: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
      format: String,
    },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    reportDate: { type: Date, default: Date.now },
    isSharedWithDoctor: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
