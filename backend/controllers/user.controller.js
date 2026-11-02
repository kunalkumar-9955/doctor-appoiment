const User = require('../models/User.model');
const Report = require('../models/Report.model');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const allowed = ['name', 'phone', 'gender', 'dateOfBirth', 'bloodGroup', 'address', 'allergies', 'chronicConditions', 'emergencyContact'];
    const updates = {};
    allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });
    res.json({ success: true, data: user, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    const { url, public_id } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { avatar: { url, public_id } }, { new: true });
    res.json({ success: true, data: { avatar: user.avatar }, message: 'Avatar updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getHealthRecords = async (req, res) => {
  try {
    const reports = await Report.find({ patient: req.user.id }).sort('-createdAt');
    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadReport = async (req, res) => {
  try {
    const report = await Report.create({ ...req.body, patient: req.user.id });
    res.status(201).json({ success: true, data: report, message: 'Report uploaded' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
