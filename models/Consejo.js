// SALUD_BIENESTAR_BACKEND_APP/models/Consejo.js
const mongoose = require('mongoose');

const ConsejoSchema = new mongoose.Schema({
  texto: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('Consejo', ConsejoSchema, 'consejos');