const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/homeRoutes");
const roomRoutes = require("./routes/roomRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const modeRoutes = require("./routes/modeRoutes");
// const notificationRoutes = require('./routes/notificationRoutes');
const scheduleModes = require("./scheduler");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/homes", homeRoutes); // Gestion des maisons
app.use("/api/rooms", roomRoutes); // Gestion des pièces
app.use("/devices", deviceRoutes); // Gestion des appareils
app.use("/api/modes", modeRoutes);
// app.use("/api/notifications", notificationRoutes);
app.use("/api/notifications", require("./routes/notificationRoutes"));

scheduleModes();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
