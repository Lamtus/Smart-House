const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    maxlength: 100 
  }, // Nom de l'appareil (ex. "Lampe salon")
  
  type: { 
    type: String, 
    enum: ['light', 'thermostat', 'fan', 'sensor', 'camera', 'lock', 'appliance', 'security'], 
    required: true 
  }, // Type de l'appareil
  
  status: { 
    type: String, 
    enum: ['on', 'off', 'standby'], 
    default: 'off' 
  }, // Statut de l'appareil (allumé, éteint, en veille)
  
  room_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Room", 
    required: true 
  }, // Référence à la pièce où l'appareil est installé
  
  settings: {
    type: mongoose.Schema.Types.Mixed, // Utilisation de Mixed pour gérer des paramètres flexibles spécifiques à chaque type d'appareil
    default: {} 
  },

  brand_name: { 
    type: String, 
    maxlength: 100 
  }, // Marque de l'appareil
  
  model: { 
    type: String, 
    maxlength: 100 
  }, // Modèle de l'appareil
  
  energy_consumption: { 
    type: Number, 
    default: 0 
  }, // Consommation d'énergie (en watts)
  
  created_at: { 
    type: Date, 
    default: Date.now 
  }, // Date de création
  
  updated_at: { 
    type: Date, 
    default: Date.now 
  } // Date de mise à jour
});

// Middleware pour mettre à jour la date "updated_at" avant modification
deviceSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Device", deviceSchema);
