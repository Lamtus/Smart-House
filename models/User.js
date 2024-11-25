// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  phone: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Middleware pour hasher le mot de passe
userSchema.pre("save", async function (next) {
  if (this.isModified("password_hash")) {
    this.password_hash = await bcrypt.hash(this.password_hash, 10);
  }
  this.updated_at = Date.now();
  next();
});

// Méthode pour vérifier un mot de passe
userSchema.methods.isPasswordValid = async function (password) {
  return await bcrypt.compare(password, this.password_hash);
};

module.exports = mongoose.model("User", userSchema);
