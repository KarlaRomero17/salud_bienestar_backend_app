// SALUD_BIENESTAR_BACKEND_APP/models/Paciente.js

const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  edad: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: false, // Lo mantengo como lo tenías, pero usualmente es 'true' y 'unique: true' para logins
  },
  // --- LÍNEA AÑADIDA ---
  // Guardará una referencia al plan de comida que el usuario elija.
  planComida: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlanComida', // 'PlanComida' es el nombre del modelo que crearemos a continuación.
    default: null,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Paciente', pacienteSchema, 'paciente');