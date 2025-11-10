const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
// const authMiddleware = require('../middlewares/authMiddleware');

// Aplicar middleware de autenticación a todas las rutas
// router.use(authMiddleware);

// Rutas de objetivos
router.post('/', goalController.createGoal);
router.get('/', goalController.getGoals);
router.get('/stats', goalController.getStats);
router.get('/:id', goalController.getGoal);
router.put('/:id', goalController.updateGoal);
router.patch('/:id/progress', goalController.updateProgress);
router.delete('/:id', goalController.deleteGoal);

module.exports = router;