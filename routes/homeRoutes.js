// routes/homeRoutes.js
const express = require("express");
const { addHome, updateHome, deleteHome, getHomes } = require("../controllers/homeController");
const authenticate = require("../middlewares/authenticate");

const router = express.Router();

// Routes protégées
router.post("/", authenticate, addHome); // Ajouter une maison
router.put("/:homeId", authenticate, updateHome); // Modifier une maison
router.delete("/:homeId", authenticate, deleteHome); // Supprimer une maison
router.get("/", authenticate, getHomes); // Récupérer toutes les maisons

module.exports = router;
