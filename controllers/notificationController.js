const Notification = require('../models/Notification');

// Récupérer toutes les notifications d'un utilisateur
const getNotifications = async (req, res) => {
  try {
    const userId = req.userId; // Récupère l'ID de l'utilisateur depuis le token

    // Récupérer toutes les notifications pour cet utilisateur
    const notifications = await Notification.find({ user_id: userId }).sort({ timestamp: -1 });

    if (notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found for this user.' });
    }

    res.status(200).json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving notifications', error: err.message });
  }
};

// Marquer une notification comme lue
const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    // Trouver la notification par ID
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Mettre à jour l'état de la notification à "lue"
    notification.is_read = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ message: 'Error marking notification as read', error: err.message });
  }
};

// Supprimer une notification
const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    // Trouver et supprimer la notification
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting notification', error: err.message });
  }
};

// Récupérer les notifications non lues
const getUnreadNotifications = async (req, res) => {
  try {
    const userId = req.userId; // Récupère l'ID de l'utilisateur depuis le token

    // Trouver toutes les notifications non lues pour cet utilisateur
    const unreadNotifications = await Notification.find({ user_id: userId, is_read: false });

    if (unreadNotifications.length === 0) {
      return res.status(404).json({ message: 'No unread notifications found for this user.' });
    }

    res.status(200).json(unreadNotifications);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving unread notifications', error: err.message });
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  getUnreadNotifications,
};
