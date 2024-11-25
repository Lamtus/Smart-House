const Mode = require("../models/Mode");
const Device = require("../models/Device");
const Notification = require('../models/Notification');

// Ajouter un mode
const addMode = async (req, res) => {
  try {
    const { home_id, name, start_time, end_time, settings } = req.body;

    // Validation des données
    if (!home_id || !name || !settings) {
      return res.status(400).json({ message: "Les champs home_id, name et settings sont requis." });
    }

    // Vérifier que les appareils dans les paramètres existent
    for (const setting of settings) {
      const device = await Device.findById(setting.device_id);
      if (!device) {
        return res.status(404).json({ message: `Appareil avec ID ${setting.device_id} introuvable.` });
      }
    }

    // Créer et sauvegarder le mode
    const mode = new Mode({
      home_id,
      name,
      start_time: start_time || null,
      end_time: end_time || null,
      settings,
    });

    await mode.save();
    res.status(201).json({ message: "Mode ajouté avec succès.", mode });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de l'ajout du mode.", error: err.message });
  }
};

// Activer un mode
const activateMode = async (req, res) => {
  try {
    const modeId = req.params.modeId;

    // Trouver le mode par ID
    const mode = await Mode.findById(modeId);
    if (!mode) {
      return res.status(404).json({ message: 'Mode introuvable' });
    }

    // Vérifier si le mode est déjà actif
    if (mode.is_active) {
      return res.status(400).json({ message: 'Le mode est déjà actif.' });
    }

    // Activer le mode
    mode.is_active = true;
    await mode.save();

    // Appliquer les paramètres des appareils
    for (const setting of mode.settings) {
      await Device.findByIdAndUpdate(setting.device_id, { state: setting.state });
    }

    // Créer une notification
    const notificationMessage = `Le mode ${mode.name} a été activé.`;
    const notification = new Notification({
      user_id: mode.home_id, // Reliez cela au propriétaire de la maison
      related_id: mode._id,
      related_type: 'info',
      message: notificationMessage,
    });
    await notification.save();

    res.status(200).json({ message: `Mode ${mode.name} activé avec succès.`, notification });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'activation du mode.', error: err.message });
  }
};

// Désactiver un mode
const deactivateMode = async (req, res) => {
  try {
    const modeId = req.params.modeId;

    // Trouver le mode par ID
    const mode = await Mode.findById(modeId);
    if (!mode) {
      return res.status(404).json({ message: 'Mode introuvable' });
    }

    // Vérifier si le mode est déjà inactif
    if (!mode.is_active) {
      return res.status(400).json({ message: 'Le mode est déjà inactif.' });
    }

    // Désactiver le mode
    mode.is_active = false;
    await mode.save();

    // Réinitialiser les appareils affectés
    for (const setting of mode.settings) {
      await Device.findByIdAndUpdate(setting.device_id, { state: 'off' });
    }

    // Créer une notification
    const notificationMessage = `Le mode ${mode.name} a été désactivé.`;
    const notification = new Notification({
      user_id: mode.home_id, // Reliez cela au propriétaire de la maison
      related_id: mode._id,
      related_type: 'info',
      message: notificationMessage,
    });
    await notification.save();

    res.status(200).json({ message: `Mode ${mode.name} désactivé avec succès.`, notification });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la désactivation du mode.', error: err.message });
  }
};

// Récupérer tous les modes d'une maison
const getModesByHome = async (req, res) => {
  try {
    const { home_id } = req.params;

    const modes = await Mode.find({ home_id });
    res.status(200).json(modes);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des modes.", error: err.message });
  }
};

// Mettre à jour un mode
const updateMode = async (req, res) => {
  try {
    const { mode_id } = req.params;
    const updates = req.body;

    // Vérifier que les appareils dans les paramètres existent (si les paramètres sont mis à jour)
    if (updates.settings) {
      for (const setting of updates.settings) {
        const device = await Device.findById(setting.device_id);
        if (!device) {
          return res.status(404).json({ message: `Appareil avec ID ${setting.device_id} introuvable.` });
        }
      }
    }

    const updatedMode = await Mode.findByIdAndUpdate(mode_id, updates, { new: true });
    if (!updatedMode) {
      return res.status(404).json({ message: "Mode introuvable." });
    }

    res.status(200).json({ message: "Mode mis à jour avec succès.", mode: updatedMode });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du mode.", error: err.message });
  }
};

// Supprimer un mode
const deleteMode = async (req, res) => {
  try {
    const { mode_id } = req.params;

    const deletedMode = await Mode.findByIdAndDelete(mode_id);
    if (!deletedMode) {
      return res.status(404).json({ message: "Mode introuvable." });
    }

    res.status(200).json({ message: "Mode supprimé avec succès." });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du mode.", error: err.message });
  }
};

module.exports = {
  addMode,
  getModesByHome,
  updateMode,
  deleteMode,
  activateMode,
  deactivateMode
};
