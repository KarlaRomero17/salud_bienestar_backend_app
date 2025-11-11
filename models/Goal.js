const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título del objetivo es requerido'],
    trim: true
  },
  type: {
    type: String,
    enum: ['loss', 'gain', 'maintain'],
    required: true
  },
  targetWeight: {
    type: Number,
    required: [true, 'El peso objetivo es requerido'],
    min: [0.1, 'El peso objetivo debe ser mayor a 0']
  },
  unit: {
    type: String,
    enum: ['kg', 'lb'],
    default: 'kg'
  },
  targetDate: {
    type: Date,
    required: [true, 'La fecha objetivo es requerida']
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Objetivos', goalSchema);