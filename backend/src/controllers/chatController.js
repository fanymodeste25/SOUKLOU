import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

export const getConversations = (req, res) => {
  try {
    const conversations = Conversation.findByUserId(req.userId);
    res.json({ conversations });
  } catch (error) {
    console.error('Erreur lors de la récupération des conversations:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const createConversation = (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'ID utilisateur requis' });
    }

    if (parseInt(userId) === req.userId) {
      return res.status(400).json({ error: 'Vous ne pouvez pas créer une conversation avec vous-même' });
    }

    const conversation = Conversation.create(req.userId, parseInt(userId));
    res.status(201).json({ conversation });
  } catch (error) {
    console.error('Erreur lors de la création de la conversation:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getMessages = (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = Conversation.findById(parseInt(conversationId));

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    // Vérifier que l'utilisateur fait partie de la conversation
    if (conversation.user1_id !== req.userId && conversation.user2_id !== req.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const messages = Message.findByConversation(parseInt(conversationId));

    // Marquer les messages comme lus
    Message.markAsRead(parseInt(conversationId), req.userId);

    res.json({ messages });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const sendMessage = (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Le message ne peut pas être vide' });
    }

    const conversation = Conversation.findById(parseInt(conversationId));

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation non trouvée' });
    }

    // Vérifier que l'utilisateur fait partie de la conversation
    if (conversation.user1_id !== req.userId && conversation.user2_id !== req.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    const message = Message.create({
      conversationId: parseInt(conversationId),
      senderId: req.userId,
      content: content.trim()
    });

    res.status(201).json({ message });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getUnreadCount = (req, res) => {
  try {
    const count = Message.getUnreadCount(req.userId);
    res.json({ count });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de messages non lus:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
