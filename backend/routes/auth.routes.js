const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  register, login, googleAuth, verifyOTP, resendOTP,
  forgotPassword, resetPassword, logout, getMe, changePassword
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

// Register
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['patient', 'doctor']).withMessage('Role must be patient or doctor'),
], validate, register);

// Login
router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, login);

// Google Auth (Firebase token verification)
router.post('/google', googleAuth);

// OTP Verification
router.post('/verify-otp', [
  body('email').isEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
], validate, verifyOTP);

router.post('/resend-otp', [body('email').isEmail()], validate, resendOTP);

// Password Reset
router.post('/forgot-password', [body('email').isEmail()], validate, forgotPassword);
router.put('/reset-password/:token', [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, resetPassword);

// Authenticated routes
router.get('/me', protect, getMe);
router.put('/change-password', protect, [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
], validate, changePassword);
router.post('/logout', protect, logout);

module.exports = router;
