const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getAllDoctors, getDoctorById, getDoctorProfile,
  updateDoctorProfile, updateAvailability, getDoctorStats,
  addReview, getDoctorAppointments, updateAppointmentStatus,
  uploadPrescription, getDoctorEarnings, toggleAcceptingAppointments
} = require('../controllers/doctor.controller');

// Public routes
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);

// Doctor authenticated routes
router.get('/profile/me', protect, authorize('doctor'), getDoctorProfile);
router.put('/profile/me', protect, authorize('doctor'), updateDoctorProfile);
router.put('/availability', protect, authorize('doctor'), updateAvailability);
router.get('/stats/me', protect, authorize('doctor'), getDoctorStats);
router.get('/appointments/me', protect, authorize('doctor'), getDoctorAppointments);
router.put('/appointments/:id/status', protect, authorize('doctor'), updateAppointmentStatus);
router.post('/prescriptions', protect, authorize('doctor'), uploadPrescription);
router.get('/earnings/me', protect, authorize('doctor'), getDoctorEarnings);
router.put('/toggle-accepting', protect, authorize('doctor'), toggleAcceptingAppointments);

// Patient route — add review
router.post('/:id/reviews', protect, authorize('patient'), addReview);

module.exports = router;
