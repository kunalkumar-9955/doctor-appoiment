const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
    },
    medicines: [
      {
        name: { type: String, required: true },
        dosage: String,       // "500mg"
        frequency: String,    // "Twice daily"
        duration: String,     // "7 days"
        instructions: String, // "Take after meals"
      },
    ],
    labTests: [
      {
        name: String,
        instructions: String,
      },
    ],
    advice: String,
    followUpDate: Date,
    // File (optional uploaded prescription image/pdf)
    file: {
      public_id: String,
      url: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Prescription', prescriptionSchema);
