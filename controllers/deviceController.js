const Device = require("../models/Device");
const ActionHistory = require("../models/actionHistory");
const Notification = require('../models/Notification');

// Ajouter un nouvel appareil
const addDevice = async (req, res) => {
  try {
    const { room_id, name, type, brand_name, model, energy_consumption } = req.body;

    const newDevice = new Device({
      room_id,
      name,
      type,
      brand_name,
      model,
      energy_consumption,
    });

    const savedDevice = await newDevice.save();
    res.status(201).json(savedDevice);
  } catch (err) {
    res.status(500).json({ message: "Error adding device", error: err.message });
  }
};

// Supprimer un appareil
const deleteDevice = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;

    const device = await Device.findByIdAndDelete(deviceId);
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    res.status(200).json({ message: "Device deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting device", error: err.message });
  }
};

// Récupérer tous les appareils d'une pièce
const getDevicesByRoom = async (req, res) => {
  try {
    const roomId = req.params.roomId;

    const devices = await Device.find({ room_id: roomId });
    res.status(200).json(devices);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving devices", error: err.message });
  }
};

// Basculer l'état d'un appareil et enregistrer dans l'historique
const toggleDeviceState = async (req, res) => {
    try {
      const deviceId = req.params.deviceId;
  
      // Trouver l'appareil dans la base de données
      const device = await Device.findById(deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
  
      // Changer l'état de l'appareil
      const newState = device.state === "on" ? "off" : "on";
      device.state = newState;
      await device.save();
  
      // Ajouter l'action dans l'historique des actions
      const action = newState === "on" ? "Turned ON" : "Turned OFF";
      await ActionHistory.create({ device_id: deviceId, action });
  
      // Créer une notification pour l'utilisateur concernant le changement d'état
      const notificationMessage = newState === "on"
        ? `Le dispositif ${device.name} a été activé.`
        : `Le dispositif ${device.name} a été désactivé.`;
  
      const notification = new Notification({
        user_id: device.owner_id,  // ID de l'utilisateur propriétaire de l'appareil
        related_id: device._id,  // ID de l'appareil concerné
        related_type: "info",  // Type de notification ("device" dans ce cas)
        message: notificationMessage,  // Le message de la notification
        is_read: false,  // La notification est initialement non lue
      });
  
      // Sauvegarder la notification
      await notification.save();
  
      // Répondre avec un message de succès
      res.status(200).json({
        message: `Device state changed to ${newState}`,
        notification: notification,  // Inclure la notification dans la réponse
      });
    } catch (err) {
      res.status(500).json({ message: "Error toggling device state", error: err.message });
    }
  };

// Récupérer l'historique des actions d'un appareil
const getActionHistory = async (req, res) => {
  try {
    const deviceId = req.params.deviceId;

    const actions = await ActionHistory.find({ device_id: deviceId }).sort({ timestamp: -1 });
    res.status(200).json(actions);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving action history", error: err.message });
  }
};

module.exports = {
  addDevice,
  deleteDevice,
  getDevicesByRoom,
  toggleDeviceState,
  getActionHistory,
};
