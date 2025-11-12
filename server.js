const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Asumo que tu archivo de conexión está en config/db.js

// Cargar variables de entorno
require('dotenv/config');


const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// En server.js
app.use('/api/consejos', require('./routes/consejoRoutes'));

// Conectar a la base de datos
connectDB();

// Rutas
app.use('/api/pacientes', require('./routes/paciente'));
app.use('/api/fuentes', require('./routes/fuenteInformacion'));
app.use('/api/recordatorios', require('./routes/recordatorios'));

// --- AÑADE ESTA LÍNEA PARA LOS PLANES DE COMIDA ---
app.use('/api/planes-comida', require('./routes/planComida'));

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));