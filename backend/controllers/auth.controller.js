const User = require('../models/User.model');
const Doctor = require('../models/Doctor.model');
const { sendTokenResponse } = require('../middleware/auth.middleware');
const { sendOTPEmail, sendPasswordResetEmail } = require('../utils/email');
const crypto = require('crypto');

// @desc   Register user
// @route  POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    
    // MOCK MODE: If MongoDB is not connected, simulate success
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        message: '[DEMO MODE] Registration successful. (Database not connected)',
        email,
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Create user
    const user = await User.create({ name, email, password, role: role || 'patient', phone });

    // Generate OTP for email verification
    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });

    // Send OTP email
    try {
      await sendOTPEmail(email, name, otp);
    } catch (emailError) {
      console.error('Email send failed:', emailError.message);
    }

    // If doctor role, create doctor profile
    if (role === 'doctor') {
      await Doctor.create({
        user: user._id,
        specialization: req.body.specialization || 'General',
        department: req.body.department || 'General Medicine',
        licenseNumber: req.body.licenseNumber || `LIC-${Date.now()}`,
        consultationFee: req.body.consultationFee || 500,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email with the OTP sent.',
      email,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // MOCK MODE: If MongoDB is not connected, simulate success
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const mockUser = { _id: 'demo123', name: 'Demo User', email, role: 'patient' };
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ id: mockUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
      return res.status(200).cookie('token', token).json({
        success: true,
        token,
        data: mockUser,
        message: '[DEMO MODE] Login successful'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.password) {
      return res.status(401).json({ success: false, message: 'Please login with Google.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account has been deactivated.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Google/Firebase Auth
// @route  POST /api/auth/google
exports.googleAuth = async (req, res) => {
  try {
    const { uid, email, name, photoURL, role } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        firebaseUid: uid,
        isGoogleAuth: true,
        isEmailVerified: true,
        role: role || 'patient',
        avatar: { url: photoURL || '' },
      });

      if (role === 'doctor') {
        await Doctor.create({
          user: user._id,
          specialization: 'General',
          department: 'General Medicine',
          licenseNumber: `GLIC-${Date.now()}`,
          consultationFee: 500,
        });
      }
    } else {
      user.lastLogin = new Date();
      if (!user.firebaseUid) user.firebaseUid = uid;
      await user.save({ validateBeforeSave: false });
    }

    sendTokenResponse(user, 200, res, 'Google login successful');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Verify OTP
// @route  POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    // MOCK MODE: If MongoDB is not connected, simulate success
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      const mockUser = { _id: 'demo123', name: 'Demo User', email, role: 'patient' };
      const jwt = require('jsonwebtoken');
      const token = jwt.sign({ id: mockUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
      return res.status(200).cookie('token', token).json({
        success: true,
        token,
        data: mockUser,
        message: '[DEMO MODE] Email verified and login successful'
      });
    }

    const user = await User.findOne({ email }).select('+otp +otpExpire');

    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    if (user.otpExpire < Date.now()) return res.status(400).json({ success: false, message: 'OTP expired.' });

    user.isEmailVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res, 'Email verified successfully');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Resend OTP
// @route  POST /api/auth/resend-otp
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const otp = user.generateOTP();
    await user.save({ validateBeforeSave: false });
    await sendOTPEmail(email, user.name, otp);

    res.json({ success: true, message: 'OTP resent to your email.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Forgot Password
// @route  POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'No user with that email.' });

    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, user.name, resetUrl);

    res.json({ success: true, message: 'Password reset email sent.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Reset Password
// @route  PUT /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful');
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get current user
// @route  GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, data: { _id: req.user?.id || 'demo123', name: 'Demo User', email: 'demo@example.com', role: 'patient' } });
    }
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Change Password
// @route  PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password is incorrect.' });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Logout
// @route  POST /api/auth/logout
exports.logout = (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 5 * 1000), httpOnly: true });
  res.json({ success: true, message: 'Logged out successfully' });
};
