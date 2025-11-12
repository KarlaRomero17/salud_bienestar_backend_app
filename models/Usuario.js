const mongoose = require('mongoose');

const historialPesoSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    default: Date.now,
  },
  peso: {
    type: Number,
    required: true,
  },
  altura: {
    type: Number,
    default: null,
  },
  edad: {
    type: Number,
    default: null,
  },
  genero: {
    type: String,
    default: null,
  },
  unidad: {
    type: String,
    default: 'kg',
  },
});

const usuarioSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
  peso_actual: {
    type: Number,
    required: false,
    default: null,
  },
  unidad_peso: {
    type: String,
    default: 'kg',
  },
  altura: {
    type: Number,
    default: null,
  },
  edad: {
    type: Number,
    default: null,
  },
  genero: {
    type: String,
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
  historial_peso: [historialPesoSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Usuario', usuarioSchema, 'usuarios');
