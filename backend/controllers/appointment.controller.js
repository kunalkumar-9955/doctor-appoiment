const Appointment = require('../models/Appointment.model');
const Doctor = require('../models/Doctor.model');
const Notification = require('../models/Notification.model');
const { sendAppointmentConfirmation } = require('../utils/email');
const { v4: uuidv4 } = require('uuid');

// @desc   Book appointment
// @route  POST /api/appointments
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, department, appointmentDate, timeSlot, type, symptoms } = req.body;

    const doctor = await Doctor.findById(doctorId).populate('user', 'name email');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    if (!doctor.isApproved) return res.status(400).json({ success: false, message: 'Doctor not approved' });
    if (!doctor.isAcceptingAppointments) return res.status(400).json({ success: false, message: 'Doctor not accepting appointments' });

    // Check slot availability
    const existingAppt = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      'timeSlot.startTime': timeSlot.startTime,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (existingAppt) return res.status(400).json({ success: false, message: 'This slot is already booked.' });

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      department,
      appointmentDate: new Date(appointmentDate),
      timeSlot,
      type: type || 'in-person',
      symptoms,
      fee: doctor.consultationFee,
      videoRoomId: type === 'video' ? uuidv4() : undefined,
    });

    // Create notification for doctor
    await Notification.create({
      recipient: doctor.user._id,
      type: 'appointment_booked',
      title: 'New Appointment Booked',
      message: `A new appointment has been booked for ${new Date(appointmentDate).toLocaleDateString()}`,
      data: { appointmentId: appointment._id },
    });

    // Send confirmation email
    try {
      await sendAppointmentConfirmation(req.user.email, req.user.name, {
        doctorName: doctor.user.name,
        department,
        date: new Date(appointmentDate).toLocaleDateString('en-IN'),
        time: `${timeSlot.startTime} - ${timeSlot.endTime}`,
        type,
      });
    } catch (e) { console.error('Email error:', e.message); }

    // Emit via socket
    const io = req.app.get('io');
    if (io) io.to(doctor.user._id.toString()).emit('new_appointment', { appointment });

    res.status(201).json({ success: true, data: appointment, message: 'Appointment booked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get my appointments (patient or doctor)
// @route  GET /api/appointments/my
exports.getMyAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = req.user.role === 'patient'
      ? { patient: req.user.id }
      : { doctor: (await Doctor.findOne({ user: req.user.id }))?._id };

    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('doctor', 'specialization department consultationFee')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name avatar' } })
      .populate('patient', 'name avatar phone')
      .sort('-appointmentDate')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Appointment.countDocuments(query);
    res.json({ success: true, data: appointments, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single appointment
// @route  GET /api/appointments/:id
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name avatar email phone' } })
      .populate('patient', 'name avatar email phone dateOfBirth bloodGroup')
      .populate('prescription');

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Cancel appointment
// @route  PUT /api/appointments/:id/cancel
exports.cancelAppointment = async (req, res) => {
  try {
    const { reason } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    if (['completed', 'cancelled'].includes(appointment.status)) {
      return res.status(400).json({ success: false, message: `Cannot cancel a ${appointment.status} appointment` });
    }

    appointment.status = 'cancelled';
    appointment.cancelledBy = req.user.role;
    appointment.cancellationReason = reason;
    appointment.cancelledAt = new Date();
    await appointment.save();

    res.json({ success: true, message: 'Appointment cancelled successfully', data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Reschedule appointment
// @route  PUT /api/appointments/:id/reschedule
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentDate, timeSlot } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { appointmentDate: new Date(appointmentDate), timeSlot },
      { new: true }
    );
    res.json({ success: true, data: appointment, message: 'Appointment rescheduled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get available slots for a doctor on a date
// @route  GET /api/appointments/slots
exports.getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });

    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
    const daySchedule = doctor.availability.find(a => a.day === dayName);

    if (!daySchedule || !daySchedule.isAvailable) {
      return res.json({ success: true, data: [], message: 'Doctor not available on this day' });
    }

    // Get already booked slots
    const booked = await Appointment.find({
      doctor: doctorId,
      appointmentDate: { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 86400000) },
      status: { $in: ['pending', 'confirmed'] },
    }).select('timeSlot');

    const bookedTimes = booked.map(a => a.timeSlot.startTime);
    const availableSlots = daySchedule.slots.filter(s => !bookedTimes.includes(s.startTime));

    res.json({ success: true, data: availableSlots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
