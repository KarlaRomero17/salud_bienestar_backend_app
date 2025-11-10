const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título del objetivo es requerido'],
    trim: true
  },
  type: {
    type: String,
    enum: ['loss', 'gain'],
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
    required: [true, 'La fecha objetivo es requerida'],
    validate: {
      validator: function(date) {
        return date > new Date();
      },
      message: 'La fecha objetivo debe ser futura'
    }
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índice para búsquedas eficientes
goalSchema.index({ userId: 1, isActive: 1 });
goalSchema.index({ targetDate: 1 });

module.exports = mongoose.model('Objetivo', goalSchema);