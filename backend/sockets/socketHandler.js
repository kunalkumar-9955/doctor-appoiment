// Socket.io handler for real-time features
const onlineUsers = new Map(); // userId -> socketId

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User joins their personal room
    socket.on('join', (userId) => {
      socket.join(userId);
      onlineUsers.set(userId, socket.id);
      // Broadcast online status
      io.emit('user_online', { userId, online: true });
      console.log(`👤 User ${userId} joined room`);
    });

    // Join appointment-specific video room
    socket.on('join_video_room', (roomId) => {
      socket.join(`video_${roomId}`);
      socket.to(`video_${roomId}`).emit('user_joined_video', { socketId: socket.id });
    });

    // WebRTC signaling
    socket.on('video_offer', ({ roomId, offer }) => {
      socket.to(`video_${roomId}`).emit('video_offer', { offer, from: socket.id });
    });

    socket.on('video_answer', ({ roomId, answer }) => {
      socket.to(`video_${roomId}`).emit('video_answer', { answer, from: socket.id });
    });

    socket.on('ice_candidate', ({ roomId, candidate }) => {
      socket.to(`video_${roomId}`).emit('ice_candidate', { candidate, from: socket.id });
    });

    // Real-time chat typing indicator
    socket.on('typing', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('user_typing', { userId });
    });

    socket.on('stop_typing', ({ conversationId }) => {
      socket.to(conversationId).emit('user_stop_typing');
    });

    // Appointment room
    socket.on('join_appointment', (appointmentId) => {
      socket.join(`appointment_${appointmentId}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      // Find and remove user from online list
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          io.emit('user_online', { userId, online: false });
          console.log(`👤 User ${userId} disconnected`);
          break;
        }
      }
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  // Helper to get online users (exported for controllers)
  io.getOnlineUsers = () => Array.from(onlineUsers.keys());
};
