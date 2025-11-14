const mongoose = require('mongoose');


const TipoActividadSchema = new mongoose.Schema({
    label: { type: String, required: true, unique: true }, // 'Trotar'
    value: { type: String, required: true, unique: true }, // 'trotar'
});


const EjercicioPredefinidoSchema = new mongoose.Schema({
    nombre: { type: String, required: true, unique: true }, 
    categoria: { type: String, required: true }, 
    esConPesas: { type: Boolean, required: true }, 
});

// ℹ️ Exportamos ambos modelos
const TipoActividad = mongoose.model('TipoActividad', TipoActividadSchema);
const EjercicioPredefinido = mongoose.model('EjercicioPredefinido', EjercicioPredefinidoSchema);

module.exports = {
    TipoActividad,
    EjercicioPredefinido,
};