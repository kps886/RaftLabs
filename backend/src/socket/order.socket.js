export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Client joins a room specific to their order ID
    socket.on('joinOrderRoom', (orderId) => {
      socket.join(orderId);
      console.log(`📦 Socket ${socket.id} joined room: ${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};