const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getDashboardStats, getAllUsers, updateUserStatus,
  getAllDoctors, approveDoctorAccount, getAllAppointments,
  getRevenueStats, deleteUser
} = require('../controllers/admin.controller');

router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.delete('/users/:id', deleteUser);
router.get('/doctors', getAllDoctors);
router.put('/doctors/:id/approve', approveDoctorAccount);
router.get('/appointments', getAllAppointments);
router.get('/revenue', getRevenueStats);

module.exports = router;
