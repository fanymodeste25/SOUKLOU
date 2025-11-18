import Notification from '../models/Notification.js';

export const getNotifications = (req, res) => {
  try {
    const notifications = Notification.getByUserId(req.userId);
    res.json({ notifications });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getUnreadNotifications = (req, res) => {
  try {
    const notifications = Notification.getUnreadByUserId(req.userId);
    res.json({ notifications });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const getUnreadCount = (req, res) => {
  try {
    const count = Notification.getUnreadCount(req.userId);
    res.json({ count });
  } catch (error) {
    console.error('Erreur lors de la récupération du compteur:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const markAsRead = (req, res) => {
  try {
    const { id } = req.params;
    const notification = Notification.findById(parseInt(id));

    if (!notification) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }

    if (notification.user_id !== req.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    Notification.markAsRead(parseInt(id));
    res.json({ message: 'Notification marquée comme lue' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const markAllAsRead = (req, res) => {
  try {
    Notification.markAllAsRead(req.userId);
    res.json({ message: 'Toutes les notifications ont été marquées comme lues' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des notifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const deleteNotification = (req, res) => {
  try {
    const { id } = req.params;
    const notification = Notification.findById(parseInt(id));

    if (!notification) {
      return res.status(404).json({ error: 'Notification non trouvée' });
    }

    if (notification.user_id !== req.userId) {
      return res.status(403).json({ error: 'Accès non autorisé' });
    }

    Notification.delete(parseInt(id));
    res.json({ message: 'Notification supprimée' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const deleteAllNotifications = (req, res) => {
  try {
    Notification.deleteAllByUserId(req.userId);
    res.json({ message: 'Toutes les notifications ont été supprimées' });
  } catch (error) {
    console.error('Erreur lors de la suppression des notifications:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
