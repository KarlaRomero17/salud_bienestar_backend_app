// SALUD_BIENESTAR_BACKEND_APP/models/PlanComida.js

const mongoose = require('mongoose');

// Define cómo se verá cada comida individual
const ComidaSchema = new mongoose.Schema({
  hora: { type: String, required: true },
  descripcion: { type: String, required: true },
});

// Define la estructura para un día de la semana
const DiaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    required: true,
  },
  comidas: [ComidaSchema],
});

// Define el plan de comida completo
const PlanComidaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  descripcion: { type: String, required: true },
  semana: [DiaSchema],
});

module.exports = mongoose.model('PlanComida', PlanComidaSchema, 'planesComida');