const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  getUnreadNotifications,
} = require('../controllers/notificationController');
const  verifyToken  = require('../middlewares/authenticate');

// Route pour récupérer toutes les notifications
router.get('/', verifyToken, getNotifications);

// Route pour marquer une notification comme lue
router.put('/:notificationId/read', verifyToken, markNotificationAsRead);

// Route pour supprimer une notification
router.delete('/:notificationId', verifyToken, deleteNotification);

// Route pour récupérer les notifications non lues
router.get('/unread', verifyToken, getUnreadNotifications);

module.exports = router;
