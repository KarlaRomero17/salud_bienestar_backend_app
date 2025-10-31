const FuenteInformacion = require('../models/FuenteInformacion');

// Listar todas las fuentes de información
const listarFuentesInformacion = async (req, res) => {
  try {
    const fuentes = await FuenteInformacion.find();
    res.json(fuentes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener fuentes de información' });
  }
};

// Obtener una fuente de información por ID
const obtenerFuenteInformacion = async (req, res) => {
  try {
    const { id } = req.params;
    const fuente = await FuenteInformacion.findById(id);
    
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
    const nuevaFuente = new FuenteInformacion(req.body);
    const fuenteGuardada = await nuevaFuente.save();
    res.status(201).json(fuenteGuardada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la fuente de información' });
  }
};

// Actualizar una fuente de información
const actualizarFuenteInformacion = async (req, res) => {
  try {
    const { id } = req.params;
    const fuenteActualizada = await FuenteInformacion.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!fuenteActualizada) {
      return res.status(404).json({ message: 'Fuente de información no encontrada' });
    }
    
    res.json(fuenteActualizada);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar la fuente de información' });
  }
};

// Eliminar una fuente de información
const eliminarFuenteInformacion = async (req, res) => {
  try {
    const { id } = req.params;
    const fuenteEliminada = await FuenteInformacion.findByIdAndDelete(id);
    
    if (!fuenteEliminada) {
      return res.status(404).json({ message: 'Fuente de información no encontrada' });
    }
    
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
