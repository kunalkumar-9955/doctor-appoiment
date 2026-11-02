const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getProfile, updateProfile, uploadAvatar, getHealthRecords, uploadReport } = require('../controllers/user.controller');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, uploadAvatar);
router.get('/health-records', protect, getHealthRecords);
router.post('/reports', protect, uploadReport);

module.exports = router;
