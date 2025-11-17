import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

const userSockets = new Map(); // userId -> socketId

export const setupChatSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Utilisateur connecté: ${socket.userId}`);

    // Enregistrer la socket de l'utilisateur
    userSockets.set(socket.userId, socket.id);

    // Rejoindre les salles de conversation de l'utilisateur
    const conversations = Conversation.findByUserId(socket.userId);
    conversations.forEach(conv => {
      socket.join(`conversation_${conv.id}`);
    });

    // Événement: envoyer un message
    socket.on('send_message', (data) => {
      try {
        const { conversationId, content } = data;

        if (!content || content.trim() === '') {
          socket.emit('error', { message: 'Le message ne peut pas être vide' });
          return;
        }

        const conversation = Conversation.findById(conversationId);

        if (!conversation) {
          socket.emit('error', { message: 'Conversation non trouvée' });
          return;
        }

        // Vérifier que l'utilisateur fait partie de la conversation
        if (conversation.user1_id !== socket.userId && conversation.user2_id !== socket.userId) {
          socket.emit('error', { message: 'Accès non autorisé' });
          return;
        }

        // Créer le message
        const message = Message.create({
          conversationId,
          senderId: socket.userId,
          content: content.trim()
        });

        // Envoyer le message à tous les participants de la conversation
        io.to(`conversation_${conversationId}`).emit('new_message', message);

        // Notifier l'autre utilisateur s'il est en ligne
        const otherUserId = conversation.user1_id === socket.userId
          ? conversation.user2_id
          : conversation.user1_id;

        const otherSocketId = userSockets.get(otherUserId);
        if (otherSocketId) {
          io.to(otherSocketId).emit('notification', {
            type: 'new_message',
            conversationId,
            message
          });
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        socket.emit('error', { message: 'Erreur lors de l\'envoi du message' });
      }
    });

    // Événement: l'utilisateur tape un message
    socket.on('typing', (data) => {
      const { conversationId } = data;
      socket.to(`conversation_${conversationId}`).emit('user_typing', {
        userId: socket.userId,
        conversationId
      });
    });

    // Événement: l'utilisateur arrête de taper
    socket.on('stop_typing', (data) => {
      const { conversationId } = data;
      socket.to(`conversation_${conversationId}`).emit('user_stop_typing', {
        userId: socket.userId,
        conversationId
      });
    });

    // Événement: marquer les messages comme lus
    socket.on('mark_as_read', (data) => {
      const { conversationId } = data;
      Message.markAsRead(conversationId, socket.userId);

      // Notifier l'autre utilisateur
      socket.to(`conversation_${conversationId}`).emit('messages_read', {
        conversationId,
        userId: socket.userId
      });
    });

    // Événement: rejoindre une nouvelle conversation
    socket.on('join_conversation', (data) => {
      const { conversationId } = data;
      socket.join(`conversation_${conversationId}`);
    });

    // Déconnexion
    socket.on('disconnect', () => {
      console.log(`❌ Utilisateur déconnecté: ${socket.userId}`);
      userSockets.delete(socket.userId);
    });
  });
};
