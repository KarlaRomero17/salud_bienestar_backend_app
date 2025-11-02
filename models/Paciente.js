const mongoose = require('mongoose');
//.
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
    required: false,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Paciente', pacienteSchema, 'paciente');

