// salud_bienestar_backend_app/routes/actividad.js
const express = require('express');
const router = express.Router();
const ActividadController = require('../controllers/ActividadControllers/ActividadController');

// 1. Rutas para Sesiones de Actividad (CRUD)
// POST /api/actividad/sesion - Guardar una nueva sesión
router.post('/sesion', ActividadController.crearSesionActividad);

// GET /api/actividad/sesiones/:pacienteId - Obtener el historial de sesiones de un paciente
router.get('/sesiones/:pacienteId', ActividadController.getSesionesPorPaciente);

// 2. Rutas para el Catálogo de Datos (Para el Dropdown/Picker)
// GET /api/actividad/catalogo - Obtener Tipos de Actividad y Ejercicios Predefinidos
router.get('/catalogo', ActividadController.getActividadData);

// 3. Rutas para Estadísticas
// GET /api/actividad/estadisticas/:pacienteId - Obtener métricas de progreso
router.get('/estadisticas/:pacienteId', ActividadController.getEstadisticas);


module.exports = router;