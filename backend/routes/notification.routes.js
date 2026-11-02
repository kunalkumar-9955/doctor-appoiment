const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getNotifications, markAsRead, markAllRead, deleteNotification } = require('../controllers/notification.controller');

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.put('/read-all', protect, markAllRead);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
