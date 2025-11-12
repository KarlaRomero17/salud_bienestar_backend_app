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

// Rutas
app.use('/api/usuarios', require('./routes/usuario'));
app.use('/api/pacientes', require('./routes/paciente'));
app.use('/api/fuentes', require('./routes/fuenteInformacion'));
app.use('/api/recordatorios', require('./routes/recordatorios'));
app.use('/api/health-goals', require('./routes/healthGoals'));
app.use('/api/users', require('./routes/users'));
app.use("/api/comentarios", require('./routes/comentario'));
app.use("/api/publicaciones", require('./routes/publicacion'));
app.use('/api/actividad', require('./routes/actividad'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
