// salud_bienestar_backend_app/models/ActividadModels/SesionActividadModel.js
const mongoose = require('mongoose');

// Sub-esquema para una actividad/ejercicio dentro de la sesión (sin cambios)
const ActividadSesionSchema = new mongoose.Schema({
    // Campos Comunes
    tipo: { type: String, enum: ['Actividad Física', 'Entrenamiento'], required: true },
    nombre: { type: String, required: true },
    calorias: { type: Number },
    
    // Campos para Actividad Física (Correr, Nadar, etc.)
    tipoActividad: { type: String }, 
    distancia: { type: Number }, 
    tiempo: { type: Number }, 

    // Campos para Entrenamiento (Pesas/Calistenia)
    conPesas: { type: Boolean },
    series: { type: Number },
    repeticiones: { type: Number },
    peso: { type: Number }, 
}, { _id: true }); 

// Esquema principal de la sesión de actividad
const SesionActividadSchema = new mongoose.Schema({
    pacienteId: {
        type: String, 
        required: true,
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
    actividades: {
        type: [ActividadSesionSchema],
        // 🚨 CORRECCIÓN CLAVE: Permite array vacío
        default: [], 
    }
});

module.exports = mongoose.model('SesionActividad', SesionActividadSchema);