const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  createOrder, verifyPayment, getPaymentHistory, getInvoice
} = require('../controllers/payment.controller');

router.post('/create-order', protect, authorize('patient'), createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);
router.get('/invoice/:id', protect, getInvoice);

module.exports = router;
