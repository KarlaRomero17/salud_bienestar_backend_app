// models/User.js
const mongoose = require('mongoose');

const pesoHistorialSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true,
    default: Date.now
  },
  peso: {
    type: Number,
    required: true,
    min: [20, 'El peso debe ser mayor a 20kg'],
    max: [300, 'El peso debe ser menor a 300kg']
  },
  grasa_corporal: {
    type: Number,
    min: [5, 'El porcentaje de grasa debe ser mayor a 5%'],
    max: [50, 'El porcentaje de grasa debe ser menor a 50%']
  },
  altura: {
    type: Number,
    min: [100, 'La altura debe ser mayor a 100cm'],
    max: [250, 'La altura debe ser menor a 250cm']
  },
  edad: {
    type: Number,
    min: [10, 'La edad debe ser mayor a 10 años'],
    max: [120, 'La edad debe ser menor a 120 años']
  },
  genero: {
    type: String,
    enum: ['masculino', 'femenino']
  },
  medida_cintura: {
    type: Number,
    min: [50, 'La medida de cintura debe ser mayor a 50cm'],
    max: [200, 'La medida de cintura debe ser menor a 200cm']
  },
  unidad: {
    type: String,
    enum: ['kg', 'lb'],
    default: 'kg'
  }
});

const userSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
    // REMOVED: index: true - ya se define abajo con schema.index()
  },
  token: {
    type: String,
    required: true
  },
  peso_actual: {
    type: Number,
    min: [20, 'El peso debe ser mayor a 20kg'],
    max: [300, 'El peso debe ser menor a 300kg']
  },
  unidad_peso: {
    type: String,
    enum: ['kg', 'lb'],
    default: 'kg'
  },
  altura: {
    type: Number,
    min: [100, 'La altura debe ser mayor a 100cm'],
    max: [250, 'La altura debe ser menor a 250cm']
  },
  edad: {
    type: Number,
    min: [10, 'La edad debe ser mayor a 10 años'],
    max: [120, 'La edad debe ser menor a 120 años']
  },
  genero: {
    type: String,
    enum: ['masculino', 'femenino', 'otro', 'prefiero_no_decir']
  },
  historial_peso: [pesoHistorialSchema],
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para mejor performance - DEFINIDOS UNA SOLA VEZ
// userSchema.index({ uuid: 1 });
// userSchema.index({ email: 1 });
userSchema.index({ 'historial_peso.fecha': -1 });

// Método para agregar registro de peso
// En models/User.js - MODIFICA ESTE MÉTODO
// userSchema.methods.agregarRegistroPeso = function(pesoData) {
//   const nuevoRegistro = {
//     fecha: new Date(),
//     peso: pesoData.peso,
//     grasa_corporal: pesoData.grasa_corporal,
//     altura: pesoData.altura,
//     edad: pesoData.edad,
//     genero: pesoData.genero,
//     medida_cintura: pesoData.medida_cintura,
//     unidad: pesoData.unidad
//   };

//   this.historial_peso.unshift(nuevoRegistro); // Agregar al inicio del array
  
//   // Mantener solo los últimos 100 registros para no hacer el documento muy grande
//   if (this.historial_peso.length > 100) {
//     this.historial_peso = this.historial_peso.slice(0, 100);
//   }
//  // Actualizar solo datos que no afecten los objetivos:
// //   this.unidad_peso = pesoData.unidad;
// //   this.altura = pesoData.altura;
// //   this.edad = pesoData.edad;
// //   this.genero = pesoData.genero;
  
//   // peso_actual para no afectar los objetivos
//   // this.peso_actual = pesoData.peso; // ← ELIMINA ESTA LÍNEA

//   return this.save();
// };

// Método para obtener historial paginado
userSchema.methods.obtenerHistorialPaginado = function(pagina = 1, limite = 10) {
  const inicio = (pagina - 1) * limite;
  const fin = inicio + limite;
  
  return this.historial_peso.slice(inicio, fin);
};

module.exports = mongoose.model('Usuarios', userSchema);