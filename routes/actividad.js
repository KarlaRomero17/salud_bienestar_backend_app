
const express = require('express');
const router = express.Router();
const ActividadController = require('../controllers/ActividadControllers/ActividadController');



router.get('/sesion/hoy/:pacienteId', ActividadController.getSesionHoy);

// Guardar una nueva sesión
router.post('/sesion', ActividadController.crearSesionActividad);

// Agregar actividades a sesión existente
router.put('/sesion/:idSesion', ActividadController.updateSesionActividad);

router.put('/sesion/replace/:idSesion', ActividadController.updateSesionActividad);     

// Obtener el historial de sesiones de un paciente
router.get('/sesiones/:pacienteId', ActividadController.getSesionesPorPaciente);

// Obtener Tipos de Actividad y Ejercicios Predefinidos
router.get('/catalogo', ActividadController.getActividadData);

// Obtener métricas de progreso
router.get('/estadisticas/:pacienteId', ActividadController.getEstadisticas);


module.exports = router;