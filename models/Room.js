// models/Room.js
const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  home_id: { type: mongoose.Schema.Types.ObjectId, ref: "Home", required: true },
  name: { type: String, required: true, maxlength: 100 },
  type: {
    type: String,
    enum: ['living', 'kitchen', 'bedroom', 'bathroom'],
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Middleware pour mettre à jour la date "updated_at" avant modification
roomSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

module.exports = mongoose.model("Room", roomSchema);
