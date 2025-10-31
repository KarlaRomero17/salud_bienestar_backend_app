const mongoose = require('mongoose');

const fuenteInformacionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: false,
  },
  categoria: {
    type: String,
    required: false,
  },
  autor: {
    type: String,
    required: false,
  },
  fechaPublicacion: {
    type: Date,
    required: false,
  },
  activo: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FuenteInformacion', fuenteInformacionSchema, 'fuenteInformacion');
