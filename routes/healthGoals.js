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

// Acciones específicas
router.patch('/:id/completar', healthGoalsController.marcarComoCompletado);     // Marcar como completado
router.patch('/:id/progreso', healthGoalsController.actualizarProgreso);        // Actualizar progreso

// Consultas especializadas
router.get('/proximos-vencer', healthGoalsController.obtenerObjetivosProximosVencer); // Próximos a vencer
router.get('/vencidos', healthGoalsController.obtenerObjetivosVencidos);        // Vencidos
router.get('/estadisticas', healthGoalsController.obtenerEstadisticas);         // Estadísticas

module.exports = router;