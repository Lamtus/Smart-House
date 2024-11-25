// routes/authRoutes.js
const express = require("express");
const { signUp, login } = require("../controllers/authController");
const validateUser = require("../middlewares/validateUser");

const router = express.Router();

// Routes pour l'authentification
router.post("/signup", validateUser, signUp);
router.post("/login", login);

module.exports = router;
