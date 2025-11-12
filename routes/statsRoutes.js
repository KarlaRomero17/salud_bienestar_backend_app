const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

router.get('/:userId', statsController.obtenerEstadisticas);
router.get('/:userId/grafico-peso', statsController.obtenerGraficoPeso);
router.get('/:userId/grafico-objetivos', statsController.obtenerGraficoObjetivos);
router.get('/:userId/periodo', statsController.obtenerEstadisticasPorPeriodo);

module.exports = router;
