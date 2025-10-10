const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Cargar variables de entorno
require('dotenv/config');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Conectar a la base de datos
connectDB();

// Rutas (ejemplo, descomentar cuando tengas rutas)
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/pacientes', require('./routes/paciente'));

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
