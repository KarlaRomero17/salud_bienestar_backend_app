// salud_bienestar_backend_app/models/ActividadModels/EjercicioModel.js
const mongoose = require('mongoose');

// Modelo para los tipos de actividad física (Trotar, Caminar, etc.)
const TipoActividadSchema = new mongoose.Schema({
    label: { type: String, required: true, unique: true }, // 'Trotar'
    value: { type: String, required: true, unique: true }, // 'trotar'
});

// Modelo para los ejercicios predefinidos (Press de banca, Flexiones, etc.)
const EjercicioPredefinidoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true }, // 'Press de banca (Barra)'
    categoria: { type: String, required: true }, // 'Fuerza - Tren Superior (Pesas)'
    esConPesas: { type: Boolean, required: true }, // Determinado por la categoría
});

// ℹ️ Exportamos ambos modelos
const TipoActividad = mongoose.model('TipoActividad', TipoActividadSchema);
const EjercicioPredefinido = mongoose.model('EjercicioPredefinido', EjercicioPredefinidoSchema);

module.exports = {
    TipoActividad,
    EjercicioPredefinido,
};