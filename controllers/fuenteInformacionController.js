const FuenteInformacion = require('../models/FuenteInformacion');
const mongoose = require('mongoose');

// Helper: decide si param es número (id_fuente_informacion) o ObjectId
const findByParam = async (idParam) => {
  if (!idParam) return null;
  // si es entero (número) buscar por id_fuente_informacion
  const asNumber = Number(idParam);
  if (!Number.isNaN(asNumber) && String(asNumber) === String(idParam)) {
    return await FuenteInformacion.findOne({ id_fuente_informacion: asNumber });
  }
  // si es ObjectId válido
  if (mongoose.Types.ObjectId.isValid(idParam)) {
    return await FuenteInformacion.findById(idParam);
  }
  return null;
};

// Listar todas las fuentes de información
const listarFuentesInformacion = async (req, res) => {
  try {
    const fuentes = await FuenteInformacion.find().select('-__v');
    res.json(fuentes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener fuentes de información' });
  }
};

// Obtener una fuente de información por ID (acepta id_fuente_informacion o _id)
const obtenerFuenteInformacion = async (req, res) => {
  try {
    const { id } = req.params;
    const fuente = await findByParam(id);

    if (!fuente) {
      return res.status(404).json({ message: 'Fuente de información no encontrada' });
    }

    res.json(fuente);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la fuente de información' });
  }
};

// Crear una nueva fuente de información
const crearFuenteInformacion = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre || !descripcion) {
      return res.status(400).json({ message: 'nombre y descripcion son obligatorios' });
    }

    const nuevaFuente = new FuenteInformacion({ nombre, descripcion });
    const fuenteGuardada = await nuevaFuente.save();
    res.status(201).json(fuenteGuardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la fuente de información' });
  }
};

// Actualizar una fuente de información (acepta id_fuente_informacion o _id)
const actualizarFuenteInformacion = async (req, res) => {
  try {
    const { id } = req.params;
    const fuente = await findByParam(id);
    if (!fuente) return res.status(404).json({ message: 'Fuente de información no encontrada' });

    // Solo permitir actualizar nombre y descripcion
    const { nombre, descripcion } = req.body;
    if (nombre !== undefined) fuente.nombre = nombre;
    if (descripcion !== undefined) fuente.descripcion = descripcion;

    const fuenteActualizada = await fuente.save();
    res.json(fuenteActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la fuente de información' });
  }
};

// Eliminar una fuente de información (acepta id_fuente_informacion o _id)
const eliminarFuenteInformacion = async (req, res) => {
  try {
    const { id } = req.params;
    const fuente = await findByParam(id);
    if (!fuente) return res.status(404).json({ message: 'Fuente de información no encontrada' });

    await FuenteInformacion.findByIdAndDelete(fuente._id);
    res.json({ message: 'Fuente de información eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la fuente de información' });
  }
};

module.exports = {
  listarFuentesInformacion,
  obtenerFuenteInformacion,
  crearFuenteInformacion,
  actualizarFuenteInformacion,
  eliminarFuenteInformacion,
};
