// SALUD_BIENESTAR_BACKEND_APP/config/consejosSeed.js
const mongoose = require('mongoose');
const path = require('path');
const Consejo = require('../models/Consejo');

require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const consejos = [
  "Dedica 5 minutos a la meditación para empezar el día con calma.",
  "Bebe un vaso de agua tan pronto como te despiertes.",
  "Estira tu cuerpo durante 10 minutos cada mañana.",
  "Asegúrate de que la mitad de tu plato en el almuerzo sean vegetales.",
  "Sal a caminar 15 minutos después de comer para ayudar a la digestión.",
  "Toma un descanso de 5 minutos de la pantalla cada hora.",
  "Come un puñado de nueces o almendras como snack saludable.",
  "Apunta tres cosas por las que estás agradecido antes de dormir.",
  "Evita las pantallas (teléfono, TV) al menos 30 minutos antes de acostarte.",
  "Intenta dormir entre 7 y 8 horas cada noche.",
  "Reemplaza las bebidas azucaradas por agua o té sin azúcar.",
  "Practica la respiración profunda: inhala 4 segundos, sostén 4, exhala 6."
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) throw new Error('No se encontró MONGODB_URI');

    await mongoose.connect(mongoURI);
    console.log('MongoDB Conectado para el seed de consejos.');

    await Consejo.deleteMany({});
    console.log('Consejos antiguos eliminados.');
    
    const consejosParaInsertar = consejos.map(texto => ({ texto }));
    await Consejo.insertMany(consejosParaInsertar);
    console.log('¡Base de datos poblada con nuevos consejos!');

  } catch (error) {
    console.error('ERROR EN EL SCRIPT SEED:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión a MongoDB cerrada.');
  }
};

seedDatabase();