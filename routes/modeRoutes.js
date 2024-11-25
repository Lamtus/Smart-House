const express = require("express");
const { addMode, getModesByHome, updateMode, deleteMode, activateMode, deactivateMode } = require("../controllers/modeController");
const verifyToken = require("../middlewares/authenticate");

const router = express.Router();

// Ajouter un mode
router.post("/", verifyToken, addMode);

// Récupérer tous les modes d'une maison
router.get("/:home_id", verifyToken, getModesByHome);

// Mettre à jour un mode
router.put("/:mode_id", verifyToken, updateMode);

// Supprimer un mode
router.delete("/:mode_id", verifyToken, deleteMode);


router.put('/:modeId/activate', verifyToken, activateMode);

router.put('/:modeId/deactivate', verifyToken, deactivateMode);

module.exports = router;
