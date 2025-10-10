const Paciente = require('../models/Paciente');

// Listar todos los pacientes
const listarPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.json(pacientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener pacientes' });
  }
};

module.exports = {
  listarPacientes,
};
