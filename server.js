const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");

// Cargar variables de entorno
require('dotenv').config();

const app = express();

// Middlewares
app.use(bodyParser.json());

// Configuración SIMPLE y FUNCIONAL de CORS
app.use(cors({
  origin: true, // Permite todos los orígenes (funciona para desarrollo y producción)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Conectar a la base de datos
connectDB();

// Rutas
app.use('/api/consejos', require('./routes/consejoRoutes'));
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
app.use('/api/planes-comida', require('./routes/planComida'));

// Ruta de salud
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Sistema de Salud y Bienestar - API',
    version: '1.0.0',
    health: '/health'
  });
});

// Puerto
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});