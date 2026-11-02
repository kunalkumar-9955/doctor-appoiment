const express = require('express');
const router = express.Router();
const { getAppVersion, updateAppVersion } = require('../controllers/version.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', getAppVersion);
router.post('/', protect, authorize('admin'), updateAppVersion);

module.exports = router;
