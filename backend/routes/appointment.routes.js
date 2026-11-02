const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  bookAppointment, getMyAppointments, getAppointmentById,
  cancelAppointment, rescheduleAppointment, getAvailableSlots
} = require('../controllers/appointment.controller');

router.post('/', protect, authorize('patient'), bookAppointment);
router.get('/my', protect, getMyAppointments);
router.get('/slots', getAvailableSlots);
router.get('/:id', protect, getAppointmentById);
router.put('/:id/cancel', protect, cancelAppointment);
router.put('/:id/reschedule', protect, authorize('patient'), rescheduleAppointment);

module.exports = router;
