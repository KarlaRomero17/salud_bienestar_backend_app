const mongoose = require('mongoose');


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
       
        default: [], 
    }
});

module.exports = mongoose.model('SesionActividad', SesionActividadSchema);