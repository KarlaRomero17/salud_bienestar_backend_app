// SALUD_BIENESTAR_BACKEND_APP/controllers/planComidaController.js

const PlanComida = require('../models/PlanComida');

// La única función que necesitamos: obtener todos los planes de comida.
exports.getPlanesComida = async (req, res) => {
  try {
    const planes = await PlanComida.find();
    res.json(planes);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener los planes de comida' });
  }
};