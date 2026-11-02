const User = require('../models/User.model');
const Doctor = require('../models/Doctor.model');
const Appointment = require('../models/Appointment.model');
const Payment = require('../models/Payment.model');

// @desc   Admin dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalDoctors, totalAppointments, pendingDoctors, todayAppointments, revenue] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      Doctor.countDocuments({ isApproved: true }),
      Appointment.countDocuments(),
      Doctor.countDocuments({ isApproved: false }),
      Appointment.countDocuments({ appointmentDate: { $gte: new Date().setHours(0,0,0,0) } }),
      Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    ]);

    // Monthly appointment trend
    const monthlyTrend = await Appointment.aggregate([
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers, totalDoctors, totalAppointments,
        pendingDoctors, todayAppointments,
        totalRevenue: revenue[0]?.total || 0,
        monthlyTrend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (role) query.role = role;
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const users = await User.find(query).sort('-createdAt').skip((page-1)*limit).limit(Number(limit));
    const total = await User.countDocuments(query);
    res.json({ success: true, data: users, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    res.json({ success: true, data: user, message: `User ${isActive ? 'activated' : 'deactivated'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const { isApproved, page = 1, limit = 20 } = req.query;
    const query = {};
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';
    const doctors = await Doctor.find(query).populate('user', 'name email avatar phone createdAt')
      .sort('-createdAt').skip((page-1)*limit).limit(Number(limit));
    const total = await Doctor.countDocuments(query);
    res.json({ success: true, data: doctors, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveDoctorAccount = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, { isApproved }, { new: true }).populate('user', 'name email');
    res.json({ success: true, data: doctor, message: `Doctor ${isApproved ? 'approved' : 'rejected'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email')
      .populate({ path: 'doctor', populate: { path: 'user', select: 'name' } })
      .sort('-createdAt').skip((page-1)*limit).limit(Number(limit));
    const total = await Appointment.countDocuments(query);
    res.json({ success: true, data: appointments, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRevenueStats = async (req, res) => {
  try {
    const monthly = await Payment.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);
    const total = await Payment.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    res.json({ success: true, data: { monthly, totalRevenue: total[0]?.total || 0 } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
