const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  related_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true 
  },
  related_type: { 
    type: String, 
    enum: ['info', 'alert'], 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  is_read: { 
    type: Boolean, 
    default: false 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// Indexe pour faciliter la recherche des notifications par utilisateur et date
notificationSchema.index({ user_id: 1, timestamp: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
