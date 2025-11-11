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
}, { _id: false }); 

// Esquema principal de la sesión de actividad
const SesionActividadSchema = new mongoose.Schema({
    pacienteId: {
        // 🚨 CAMBIO CLAVE: Cambiado a String para aceptar el UID de Firebase
        type: String, 
        required: true,
        // Eliminamos 'ref: 'Paciente'' ya que la referencia está en Firebase, no en Mongo
    },
    fecha: {
        type: Date,
        default: Date.now,
    },
    actividades: {
        type: [ActividadSesionSchema],
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'Una sesión debe tener al menos una actividad.'
        }
    }
});

module.exports = mongoose.model('SesionActividad', SesionActividadSchema);