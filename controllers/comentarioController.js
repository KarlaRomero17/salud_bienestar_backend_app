const Comentario = require("../models/Comentario");
const Publicacion = require('../models/Publicacion');

// Obtener todos los comentarios
exports.obtenerComentarios = async (req, res) => {
  try {
    const comentarios = await Comentario.find().sort({ createdAt: -1 });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener comentarios", error });
  }
};

// Crear un nuevo comentario
exports.crearComentario = async (req, res) => {
  try {

    //Creando comentario
    const { contenido, autor, publicacionId } = req.body;
    const nuevoComentario = new Comentario({
      contenido,
      autor,
      publicacionId
    });

    await nuevoComentario.save();

    //Agregando el comentario a la publicación
    await Publicacion.findByIdAndUpdate(publicacionId, {
      $push: { comentarios: nuevoComentario._id }
    });

    res.status(201).json({
      message: 'Comentario agregado correctamente',
      comentario: nuevoComentario
    });
  } catch (error) {
    res.status(400).json({ message: "Error al crear comentario", error });
  }
};

// Obtener comentarios por ID de publicación
exports.obtenerComentariosPorPublicacion = async (req, res) => {
  try {
    const { publicacionId } = req.params;
    const comentarios = await Comentario.find({ publicacionId }).sort({ createdAt: -1 });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener comentarios", error });
  }
};


//Editar comentario
exports.editarComentario = async (req, res) => {
  try {
    const { contenido } = req.body;

    const comentarioActualizado = await Comentario.findByIdAndUpdate(
      req.params.id,
      { contenido },
      { new: true }
    );

    if (!comentarioActualizado) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    res.json({ message: "Comentario actualizado correctamente", comentario: comentarioActualizado });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el comentario", error });
  }
};


//Eliminar comentario
exports.eliminarComentario = async (req, res) => {
  try {
    const comentarioEliminado = await Comentario.findByIdAndDelete(req.params.id);

    if (!comentarioEliminado) {
      return res.status(404).json({ message: "Comentario no encontrado" });
    }

    // También eliminar referencia del comentario en la publicación
    await Publicacion.findByIdAndUpdate(comentarioEliminado.publicacionId, {
      $pull: { comentarios: comentarioEliminado._id },
    });

    res.json({ message: "Comentario eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el comentario", error });
  }
};

