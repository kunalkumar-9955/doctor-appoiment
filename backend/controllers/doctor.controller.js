const Doctor = require('../models/Doctor.model');
const Appointment = require('../models/Appointment.model');
const Prescription = require('../models/Prescription.model');
const Payment = require('../models/Payment.model');

// @desc   Get all doctors (public, with filters)
// @route  GET /api/doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const { specialization, department, search, page = 1, limit = 12, sort = '-rating' } = req.query;
    const query = { isApproved: true };

    if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
    if (department) query.department = { $regex: department, $options: 'i' };
    if (search) {
      query.$or = [
        { specialization: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [doctors, total] = await Promise.all([
      Doctor.find(query).populate('user', 'name email avatar phone').sort(sort).skip(skip).limit(Number(limit)),
      Doctor.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: doctors,
      pagination: { total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single doctor
// @route  GET /api/doctors/:id
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email avatar phone gender')
      .populate('reviews.patient', 'name avatar');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get doctor's own profile
// @route  GET /api/doctors/profile/me
exports.getDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', '-password');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    res.json({ success: true, data: doctor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update doctor profile
// @route  PUT /api/doctors/profile/me
exports.updateDoctorProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('user', '-password');
    res.json({ success: true, data: doctor, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update doctor availability
// @route  PUT /api/doctors/availability
exports.updateAvailability = async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      { $set: { availability: req.body.availability } },
      { new: true }
    );
    res.json({ success: true, data: doctor.availability, message: 'Availability updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get doctor stats
// @route  GET /api/doctors/stats/me
exports.getDoctorStats = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const [pending, confirmed, completed, todayCount] = await Promise.all([
      Appointment.countDocuments({ doctor: doctor._id, status: 'pending' }),
      Appointment.countDocuments({ doctor: doctor._id, status: 'confirmed' }),
      Appointment.countDocuments({ doctor: doctor._id, status: 'completed' }),
      Appointment.countDocuments({ doctor: doctor._id, appointmentDate: { $gte: new Date().setHours(0,0,0,0) } }),
    ]);

    res.json({
      success: true,
      data: {
        pending, confirmed, completed,
        todayAppointments: todayCount,
        totalEarnings: doctor.totalEarnings,
        rating: doctor.rating,
        totalReviews: doctor.totalReviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get doctor appointments
// @route  GET /api/doctors/appointments/me
exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    const { status, page = 1, limit = 10 } = req.query;
    const query = { doctor: doctor._id };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email avatar phone dateOfBirth bloodGroup')
      .sort('-appointmentDate')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Appointment.countDocuments(query);
    res.json({ success: true, data: appointments, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update appointment status (doctor)
// @route  PUT /api/doctors/appointments/:id/status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, notes },
      { new: true }
    ).populate('patient', 'name email');

    // Emit real-time notification via socket
    const io = req.app.get('io');
    if (io) {
      io.to(appointment.patient._id.toString()).emit('appointment_updated', {
        appointmentId: appointment._id,
        status,
        message: `Your appointment has been ${status}`,
      });
    }

    res.json({ success: true, data: appointment, message: `Appointment ${status}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Upload prescription
// @route  POST /api/doctors/prescriptions
exports.uploadPrescription = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    const prescription = await Prescription.create({ ...req.body, doctor: doctor._id });

    await Appointment.findByIdAndUpdate(req.body.appointment, { prescription: prescription._id, status: 'completed' });
    doctor.completedConsultations += 1;
    await doctor.save();

    res.status(201).json({ success: true, data: prescription, message: 'Prescription uploaded' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get doctor earnings
// @route  GET /api/doctors/earnings/me
exports.getDoctorEarnings = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    const payments = await Payment.find({ doctor: doctor._id, status: 'paid' })
      .populate('appointment', 'appointmentDate')
      .sort('-createdAt').limit(20);

    // Monthly earnings for chart
    const monthly = await Payment.aggregate([
      { $match: { doctor: doctor._id, status: 'paid' } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, total: { $sum: '$amount' } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    res.json({ success: true, data: { totalEarnings: doctor.totalEarnings, recent: payments, monthly } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Toggle accepting appointments
exports.toggleAcceptingAppointments = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    doctor.isAcceptingAppointments = !doctor.isAcceptingAppointments;
    await doctor.save();
    res.json({ success: true, isAcceptingAppointments: doctor.isAcceptingAppointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Add review to doctor
// @route  POST /api/doctors/:id/reviews
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    // Check if already reviewed
    const alreadyReviewed = doctor.reviews.find(r => r.patient.toString() === req.user.id);
    if (alreadyReviewed) return res.status(400).json({ success: false, message: 'Already reviewed' });

    doctor.reviews.push({ patient: req.user.id, rating, comment });
    doctor.totalReviews = doctor.reviews.length;
    doctor.rating = doctor.reviews.reduce((a, r) => a + r.rating, 0) / doctor.reviews.length;
    await doctor.save();

    res.json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
