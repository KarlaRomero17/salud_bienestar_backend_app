const express = require('express');
const router = express.Router();
const {
  listarFuentesInformacion,
  obtenerFuenteInformacion,
  crearFuenteInformacion,
  actualizarFuenteInformacion,
  eliminarFuenteInformacion,
} = require('../controllers/fuenteInformacionController');

// GET /api/fuentes - Listar todas las fuentes de información
router.get('/', listarFuentesInformacion);

// GET /api/fuentes/:id - Obtener una fuente de información por ID
router.get('/:id', obtenerFuenteInformacion);

// POST /api/fuentes - Crear una nueva fuente de información
router.post('/', crearFuenteInformacion);

// PUT /api/fuentes/:id - Actualizar una fuente de información
router.put('/:id', actualizarFuenteInformacion);

// DELETE /api/fuentes/:id - Eliminar una fuente de información
router.delete('/:id', eliminarFuenteInformacion);

module.exports = router;
