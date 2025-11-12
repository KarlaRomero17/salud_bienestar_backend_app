// routes/healthGoals.js
const express = require('express');
const router = express.Router();
const healthGoalsController = require('../controllers/healthGoalsController');

// CRUD básico
router.get('/', healthGoalsController.obtenerTodosObjetivos);                    // Listar todos
router.get('/:id', healthGoalsController.obtenerObjetivoPorId);                 // Obtener por ID
router.post('/', healthGoalsController.crearObjetivo);                          // Crear
router.put('/:id', healthGoalsController.actualizarObjetivo);                   // Actualizar
router.delete('/:id', healthGoalsController.eliminarObjetivo);                  // Eliminar lógico


// Consultas especializadas
router.get('/proximos-vencer', healthGoalsController.obtenerObjetivosProximosVencer); // Próximos a vencer
router.get('/vencidos', healthGoalsController.obtenerObjetivosVencidos);        // Vencidos
router.get('/estadisticas', healthGoalsController.obtenerEstadisticas);         // Estadísticas

router.put('/:id/progreso', healthGoalsController.actualizarProgreso);
router.put('/:id/completar', healthGoalsController.marcarCompletado);
module.exports = router;