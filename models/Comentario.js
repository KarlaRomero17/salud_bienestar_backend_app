const mongoose = require("mongoose");

const comentarioSchema = new mongoose.Schema(
  {
    contenido: {
      type: String,
      required: true,
      trim: true
    },
    autor: {
      type: String,
      required: true
      // Si luego tienes usuarios registrados, aquí puedes guardar el ID del usuario:
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "Usuario"
    },
    publicacionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publicacion", // relación con el modelo Publicacion
      required: true
    }
  },
  { timestamps: true } // crea createdAt y updatedAt automáticamente
);

module.exports = mongoose.model("Comentario", comentarioSchema);
