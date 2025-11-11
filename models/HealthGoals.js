// models/HealthGoals.js
const mongoose = require('mongoose');

const healthGoalSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        default: '-OdER-8T0_WKhxrfi5HY'
    },
    title: {
        type: String,
        required: [true, 'El título del objetivo es requerido'],
        trim: true,
        maxlength: [100, 'El título no puede tener más de 100 caracteres']
    },
    type: {
        type: String,
        required: [true, 'El tipo de objetivo es requerido'],
        enum: {
            values: ['loss', 'gain'],
            message: 'El tipo debe ser "loss" o "gain"'
        }
    },
    targetWeight: {
        type: Number,
        required: [true, 'El peso objetivo es requerido'],
        min: [0.1, 'El peso objetivo debe ser mayor a 0']
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'lb'],
        default: 'kg'
    },
    targetDate: {
        type: Date,
        required: [true, 'La fecha objetivo es requerida']
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    initialWeight: {
        type: Number,
        min: 0
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Índices para mejor performance - DEFINIDOS UNA SOLA VEZ
healthGoalSchema.index({ userId: 1, createdAt: -1 });
healthGoalSchema.index({ completed: 1, targetDate: 1 });
healthGoalSchema.index({ active: 1 });

module.exports = mongoose.model('Objetivos', healthGoalSchema);