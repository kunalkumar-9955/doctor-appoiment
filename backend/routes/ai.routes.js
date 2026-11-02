const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { chatWithAI, symptomChecker, getDoctorRecommendation, getHealthTips } = require('../controllers/ai.controller');

router.post('/chat', protect, chatWithAI);
router.post('/symptom-check', protect, symptomChecker);
router.post('/recommend-doctor', protect, getDoctorRecommendation);
router.get('/health-tips', protect, getHealthTips);

module.exports = router;
