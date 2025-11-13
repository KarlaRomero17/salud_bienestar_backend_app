// controllers/consejoController.js
const Consejo = require('../models/Consejo');

exports.getTodosLosConsejos = async (req, res) => {
  try {
    const consejos = await Consejo.find();
    res.json(consejos);
  } catch (error) {
    res.status(500).json({ msg: 'Error al obtener los consejos' });
  }
};