const mongoose = require("mongoose");

const publicacionSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    contenido: {
      type: String,
      required: true,
    },
    autor: {
      type: String,
      required: true,
    },
    comentarios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comentario' // modelo de comentarios
    }
  ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Publicacion", publicacionSchema);
