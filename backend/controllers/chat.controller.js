const ChatMessage = require('../models/ChatMessage.model');

// Generate conversation ID (sorted user IDs concatenated)
const getConversationId = (id1, id2) => [id1, id2].sort().join('_');

// @desc   Get all conversations
exports.getConversations = async (req, res) => {
  try {
    const messages = await ChatMessage.aggregate([
      { $match: { $or: [{ sender: req.user._id }, { receiver: req.user._id }] } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$conversationId', lastMessage: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$lastMessage' } },
    ]);

    const populated = await ChatMessage.populate(messages, [
      { path: 'sender', select: 'name avatar role' },
      { path: 'receiver', select: 'name avatar role' },
    ]);

    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get messages for a conversation
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const messages = await ChatMessage.find({ conversationId })
      .populate('sender', 'name avatar')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Mark messages as read
    await ChatMessage.updateMany(
      { conversationId, receiver: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({ success: true, data: messages.reverse() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, messageType, appointmentId } = req.body;
    const conversationId = getConversationId(req.user.id, receiverId);

    const newMessage = await ChatMessage.create({
      conversationId,
      sender: req.user.id,
      receiver: receiverId,
      appointment: appointmentId,
      message,
      messageType: messageType || 'text',
    });

    const populated = await newMessage.populate('sender', 'name avatar');

    // Emit via socket
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId).emit('new_message', populated);
      io.to(req.user.id).emit('new_message', populated);
    }

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
