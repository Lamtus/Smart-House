// routes/roomRoutes.js
const express = require("express");
const { addRoom, updateRoom, deleteRoom, getRooms } = require("../controllers/roomController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

// Routes protégées
router.post("/", authenticate, addRoom); // Ajouter une pièce
router.put("/:roomId", authenticate, updateRoom); // Modifier une pièce
router.delete("/:roomId", authenticate, deleteRoom); // Supprimer une pièce
router.get("/:homeId", authenticate, getRooms); // Récupérer toutes les pièces d'une maison

module.exports = router;
