const Publicacion = require("../models/Publicacion");
const Comentario = require('../models/Comentario');

// Obtener todas las publicaciones
exports.obtenerPublicaciones = async (req, res) => {
  try {
    const publicaciones = await Publicacion.find().sort({ createdAt: -1 });
    res.json(publicaciones);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicaciones", error });
  }
};

// Crear una nueva publicación
exports.crearPublicacion = async (req, res) => {
  try {
    const nuevaPublicacion = new Publicacion(req.body);
    await nuevaPublicacion.save();
    res.status(201).json(nuevaPublicacion);
  } catch (error) {
    res.status(400).json({ message: "Error al crear publicación", error });
  }
};


//Obtener publicacion por ID
exports.obtenerPublicacionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscamos la publicación por su ID
    const publicacion = await Publicacion.findById(id)
      .populate('autor', 'nombre') 
      .populate({
        path: 'comentarios',
        populate: { path: 'autor', select: 'nombre' } // muestra autor del comentario si aplica
      });

    if (!publicacion) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    res.status(200).json(publicacion);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener publicación', error });
  }
};


//Editar publicación
exports.editarPublicacion = async (req, res) => {
  try {
    const { titulo, contenido } = req.body;

    const publicacionActualizada = await Publicacion.findByIdAndUpdate(
      req.params.id,
      { titulo, contenido },
      { new: true }
    );

    if (!publicacionActualizada) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    res.json({ message: "Publicación actualizada correctamente", publicacion: publicacionActualizada });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la publicación", error });
  }
};

//Eliminar publicación
exports.eliminarPublicacion = async (req, res) => {
  try {
    const publicacionEliminada = await Publicacion.findByIdAndDelete(req.params.id);

    if (!publicacionEliminada) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    //Eliminar comentarios asociados a la publicacion
    await Comentario.deleteMany({ publicacionId: req.params.id });

    res.json({ message: "Publicación y comentarios eliminados correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la publicación", error });
  }
};
