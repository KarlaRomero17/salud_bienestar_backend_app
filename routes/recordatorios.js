const express = require('express');
const router = express.Router();
const recordatorioController = require('../controllers/recordatoriosController');

// CRUD básico
router.get('/', recordatorioController.obtenerTodosRecordatorios);           // Listar todos
router.get('/:id', recordatorioController.obtenerRecordatorioPorId);         // Obtener por ID
router.post('/', recordatorioController.crearRecordatorio);                  // Crear
router.put('/:id', recordatorioController.actualizarRecordatorio);           // Actualizar
router.delete('/:id', recordatorioController.eliminarRecordatorio);          // Eliminar

// Rutas especiales
router.get('/hoy/recordatorios', recordatorioController.obtenerRecordatoriosHoy);          // Hoy
router.get('/proximos/recordatorios', recordatorioController.obtenerRecordatoriosProximos); // Próximos
router.get('/vencidos/recordatorios', recordatorioController.obtenerRecordatoriosVencidos); // Vencidos
router.post('/:id/tomado', recordatorioController.marcarComoTomado);                       // Marcar como tomado
router.patch('/:id/activar-desactivar', recordatorioController.alternarRecordatorio);                // Activar/desactivar

module.exports = router;