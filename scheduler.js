const cron = require("node-cron");
const Mode = require("./models/Mode");
const Device = require("./models/Device");
const Notification = require("./models/Notification"); 

// Fonction pour appliquer un mode
const applyMode = async (mode) => {
  try {
    // Activer les appareils selon les paramètres du mode
    for (const setting of mode.settings) {
      await Device.findByIdAndUpdate(setting.device_id, { state: setting.state });
    }
    
    console.log(`Mode '${mode.name}' appliqué avec succès.`);

    // Créer une notification pour l'activation du mode
    const notificationMessage = `Le mode '${mode.name}' a été activé. Il sera désactivé à ${mode.end_time}.`;
    const notification = new Notification({
      // user_id: mode.user_id, // Assurer que chaque mode a un user_id associé
      related_id: mode._id,
      related_type: 'info', // Type info car c'est une activation du mode
      message: notificationMessage
    });
    await notification.save();
    
  } catch (err) {
    console.error(`Erreur lors de l'application du mode '${mode.name}':`, err.message);
  }
};

// Fonction pour désactiver un mode
const deactivateMode = async (mode) => {
  try {
    // Désactiver tous les appareils associés à ce mode
    for (const setting of mode.settings) {
      await Device.findByIdAndUpdate(setting.device_id, { state: "off" });
    }
    
    console.log(`Mode '${mode.name}' désactivé avec succès.`);

    // Créer une notification pour la désactivation du mode
    const notificationMessage = `Le mode '${mode.name}' a été désactivé.`;
    const notification = new Notification({
      user_id: mode.user_id, // Assurer que chaque mode a un user_id associé
      related_id: mode._id,
      related_type: 'info', // Type info car c'est une désactivation du mode
      message: notificationMessage
    });
    await notification.save();
    
  } catch (err) {
    console.error(`Erreur lors de la désactivation du mode '${mode.name}':`, err.message);
  }
};

// Planificateur de tâches
const scheduleModes = () => {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const currentTime = now.toISOString().slice(11, 16); // Format HH:mm
    console.log(currentTime)
    try {
      // Activer les modes planifiés
      const modesToActivate = await Mode.find({ start_time: currentTime });
      for (const mode of modesToActivate) {
        await applyMode(mode);
      }

      // Désactiver les modes planifiés
      const modesToDeactivate = await Mode.find({ end_time: currentTime });
      for (const mode of modesToDeactivate) {
        await deactivateMode(mode);
      }
    } catch (err) {
      console.error("Erreur lors du traitement des modes planifiés:", err.message);
    }
  });
};

module.exports = scheduleModes;
