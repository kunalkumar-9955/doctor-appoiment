const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getMessages, sendMessage, getConversations } = require('../controllers/chat.controller');

router.get('/conversations', protect, getConversations);
router.get('/:conversationId', protect, getMessages);
router.post('/send', protect, sendMessage);

module.exports = router;
