const mongoose = require('mongoose');

// Contador para autoincremento (colección 'counters')
const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', CounterSchema, 'counters');

const fuenteInformacionSchema = new mongoose.Schema({
  id_fuente_informacion: {
    type: Number,
    unique: true,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Antes de guardar, asignar un id autoincremental si es un documento nuevo
fuenteInformacionSchema.pre('save', async function (next) {
  const doc = this;
  if (doc.isNew && (doc.id_fuente_informacion === undefined || doc.id_fuente_informacion === null)) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        'fuenteInformacion',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      doc.id_fuente_informacion = counter.seq;
      return next();
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.models.FuenteInformacion || mongoose.model('FuenteInformacion', fuenteInformacionSchema, 'fuenteInformacion');
