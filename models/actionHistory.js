const mongoose = require("mongoose");

const actionHistorySchema = new mongoose.Schema({
  device_id: { type: mongoose.Schema.Types.ObjectId, ref: "Device", required: true },
  action: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ActionHistory", actionHistorySchema);
