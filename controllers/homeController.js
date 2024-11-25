// controllers/homeController.js
const Home = require("../models/Home");

// Ajouter une maison
const addHome = async (req, res) => {
  const { name, address } = req.body;
  const userId = req.user.id; // Récupéré depuis le middleware d'authentification

  try {
    const newHome = new Home({
      owner_id: userId,
      name,
      address,
    });

    await newHome.save();

    res.status(201).json({ message: "Home added successfully", home: newHome });
  } catch (error) {
    res.status(500).json({ message: "Error adding home", error });
  }
};

// Modifier une maison
const updateHome = async (req, res) => {
  const { homeId } = req.params;
  const { name, address } = req.body;
  const userId = req.user.id;

  try {
    const home = await Home.findOne({ _id: homeId, owner_id: userId });
    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    }

    home.name = name || home.name;
    home.address = address || home.address;

    await home.save();

    res.status(200).json({ message: "Home updated successfully", home });
  } catch (error) {
    res.status(500).json({ message: "Error updating home", error });
  }
};

// Supprimer une maison
const deleteHome = async (req, res) => {
  const { homeId } = req.params;
  const userId = req.user.id;

  try {
    const home = await Home.findOneAndDelete({ _id: homeId, owner_id: userId });

    if (!home) {
      return res.status(404).json({ message: "Home not found" });
    }

    res.status(200).json({ message: "Home deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting home", error });
  }
};

// Récupérer toutes les maisons de l'utilisateur connecté
const getHomes = async (req, res) => {
  const userId = req.user.id;

  try {
    const homes = await Home.find({ owner_id: userId });

    res.status(200).json({ homes });
  } catch (error) {
    res.status(500).json({ message: "Error fetching homes", error });
  }
};

module.exports = { addHome, updateHome, deleteHome, getHomes };
