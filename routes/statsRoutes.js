// routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Rutas existentes
router.get('/user/:userId', statsController.obtenerEstadisticas);
router.get('/user/:userId/grafico-peso', statsController.obtenerGraficoPeso);
router.get('/user/:userId/grafico-objetivos', statsController.obtenerGraficoObjetivos);
router.get('/user/:userId/periodo', statsController.obtenerEstadisticasPorPeriodo);

// Nueva ruta para estadísticas con filtros
router.get('/:uuid', statsController.obtenerEstadisticasCompletas);
router.get('/user/:userId/resumen', statsController.obtenerResumenEjecutivo);

module.exports = router;