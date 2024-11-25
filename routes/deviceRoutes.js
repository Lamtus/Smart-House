const express = require("express");
const {
  addDevice,
  deleteDevice,
  getDevicesByRoom,
  toggleDeviceState,
  getActionHistory,
} = require("../controllers/deviceController");
const verifyToken = require("../middlewares/authenticate");

const router = express.Router();

// Ajouter un appareil
router.post("/devices", verifyToken, addDevice);

// Supprimer un appareil
router.delete("/devices/:deviceId", verifyToken, deleteDevice);

// Récupérer tous les appareils d'une pièce
router.get("/rooms/:roomId/devices", verifyToken, getDevicesByRoom);

// Basculer l'état d'un appareil
router.put("/devices/:deviceId/state", verifyToken, toggleDeviceState);

// Récupérer l'historique des actions d'un appareil
router.get("/devices/:deviceId/history", verifyToken, getActionHistory);

module.exports = router;
