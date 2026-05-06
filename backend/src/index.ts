import http from 'http';
import app from './app';
import dotenv from 'dotenv';
import { Server } from 'socket.io';

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Adjust for production
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  
  // Real-time tracking rooms can be joined here
  socket.on('join_booking_room', (bookingId) => {
    socket.join(`booking_${bookingId}`);
    console.log(`Socket ${socket.id} joined room booking_${bookingId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
