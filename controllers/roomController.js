// controllers/roomController.js
const Room = require("../models/Room");
const Home = require("../models/Home");

// Ajouter une pièce
const addRoom = async (req, res) => {
  const { name, type, homeId } = req.body;
  const userId = req.user.id;

  try {
    // Vérifier que la maison existe et appartient à l'utilisateur
    const home = await Home.findOne({ _id: homeId, owner_id: userId });
    if (!home) {
      return res.status(404).json({ message: "Home not found or unauthorized" });
    }

    const newRoom = new Room({
      home_id: homeId,
      name,
      type,
    });

    await newRoom.save();

    res.status(201).json({ message: "Room added successfully", room: newRoom });
  } catch (error) {
    res.status(500).json({ message: "Error adding room", error });
  }
};

// Modifier une pièce
const updateRoom = async (req, res) => {
  const { roomId } = req.params;
  const { name, type } = req.body;
  const userId = req.user.id;

  try {
    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Vérifier si la maison associée à la pièce appartient à l'utilisateur
    const home = await Home.findOne({ _id: room.home_id, owner_id: userId });
    if (!home) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    room.name = name || room.name;
    room.type = type || room.type;

    await room.save();

    res.status(200).json({ message: "Room updated successfully", room });
  } catch (error) {
    res.status(500).json({ message: "Error updating room", error });
  }
};

// Supprimer une pièce
const deleteRoom = async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user.id;

  try {
    const room = await Room.findOne({ _id: roomId });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Vérifier si la maison associée à la pièce appartient à l'utilisateur
    const home = await Home.findOne({ _id: room.home_id, owner_id: userId });
    if (!home) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    await room.remove();

    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting room", error });
  }
};

// Récupérer toutes les pièces d'une maison
const getRooms = async (req, res) => {
  const { homeId } = req.params;
  const userId = req.user.id;

  try {
    const home = await Home.findOne({ _id: homeId, owner_id: userId });
    if (!home) {
      return res.status(404).json({ message: "Home not found or unauthorized" });
    }

    const rooms = await Room.find({ home_id: homeId });

    res.status(200).json({ rooms });
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error });
  }
};

module.exports = { addRoom, updateRoom, deleteRoom, getRooms };
