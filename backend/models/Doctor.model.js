const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
    },
    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],
    experience: {
      type: Number, // years
      default: 0,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    hospital: {
      name: String,
      address: String,
      city: String,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Fee cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    // Availability schedule
    availability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        slots: [
          {
            startTime: String, // "09:00"
            endTime: String,   // "09:30"
            isBooked: { type: Boolean, default: false },
          },
        ],
        isAvailable: { type: Boolean, default: true },
      },
    ],
    // Status
    isApproved: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    isAcceptingAppointments: { type: Boolean, default: true },
    // Stats
    totalAppointments: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    completedConsultations: { type: Number, default: 0 },
    // Languages
    languages: [{ type: String }],
    // Awards
    awards: [{ title: String, year: Number }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to calculate average rating
doctorSchema.virtual('averageRating').get(function () {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});

// Index for search
doctorSchema.index({ specialization: 'text', department: 'text' });
doctorSchema.index({ isApproved: 1, isAcceptingAppointments: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);
