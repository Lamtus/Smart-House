const mongoose = require("mongoose");

const modeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  home_id: { type: mongoose.Schema.Types.ObjectId, ref: "Home", required: true },
  settings: [
    {
      device_id: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
      state: { type: String, enum: ["on", "off"], required: true },
    },
  ],
  start_time: { type: String }, // Format HH:mm (ex: "22:00")
  end_time: { type: String },   // Format HH:mm (ex: "06:00")
  is_active: { type: Boolean, default: false }, // Ajout du champ is_active
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Mode", modeSchema);
