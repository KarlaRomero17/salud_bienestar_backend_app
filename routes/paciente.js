const express = require('express');
const router = express.Router();
const { listarPacientes } = require('../controllers/pacienteController');

// GET /api/pacientes
router.get('/', listarPacientes);

module.exports = router;
