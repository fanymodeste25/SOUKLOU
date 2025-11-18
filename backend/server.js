import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import chatRoutes from './src/routes/chatRoutes.js';
import assignmentRoutes from './src/routes/assignmentRoutes.js';
import submissionRoutes from './src/routes/submissionRoutes.js';
import commentRoutes from './src/routes/commentRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';
import { setupChatSocket } from './src/socket/chatSocket.js';
import './src/models/database.js'; // Initialiser la base de données

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API SOUKLOU 🎓',
    version: '2.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      chat: '/api/chat',
      assignments: '/api/assignments',
      submissions: '/api/submissions',
      comments: '/api/comments',
      notifications: '/api/notifications'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);

// Configuration Socket.io
setupChatSocket(io);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur serveur' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}`);
  console.log(`💬 WebSocket prêt pour le chat en temps réel`);
});
