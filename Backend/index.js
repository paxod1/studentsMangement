const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const studentRouter = require('./Routers/studentRouter');
const http = require('http'); // Add this
const socketIo = require('socket.io'); // Add this

dotenv.config();

const app = express();

// Create HTTP server
const server = http.createServer(app); // Modify this

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST']
  }
});

// Track connected users
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Store user information when they connect
  socket.on('register-user', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ID ${socket.id}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    // Remove user from tracking
    for (let [userId, sockId] of connectedUsers.entries()) {
      if (sockId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

// Make io accessible in routes
app.set('io', io);

// CORS configuration
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Route setup
app.use('/student', studentRouter);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => { // Change from app.listen to server.listen
  console.log(`Server is running on http://localhost:${PORT}`);
});