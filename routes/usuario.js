const express = require('express');
const router = express.Router();
const {
  listarUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorUid,
  crearUsuario,
  actualizarUsuario,
  actualizarUsuarioPorUid,
  agregarHistorialPeso,
  eliminarUsuario,
  desactivarUsuario,
} = require('../controllers/usuarioController');

// GET /api/usuarios - Listar todos los usuarios
router.get('/', listarUsuarios);

// GET /api/usuarios/:id - Obtener un usuario por ID de MongoDB
router.get('/:id', obtenerUsuarioPorId);

// GET /api/usuarios/uid/:uid - Obtener un usuario por UID de Firebase
router.get('/uid/:uid', obtenerUsuarioPorUid);

// POST /api/usuarios - Crear un nuevo usuario
router.post('/', crearUsuario);

// PUT /api/usuarios/:id - Actualizar un usuario por ID de MongoDB
router.put('/:id', actualizarUsuario);

// PUT /api/usuarios/uid/:uid - Actualizar un usuario por UID de Firebase
router.put('/uid/:uid', actualizarUsuarioPorUid);

// POST /api/usuarios/uid/:uid/historial-peso - Agregar registro al historial de peso
router.post('/uid/:uid/historial-peso', agregarHistorialPeso);

// DELETE /api/usuarios/:id - Eliminar un usuario
router.delete('/:id', eliminarUsuario);

// PATCH /api/usuarios/uid/:uid/desactivar - Desactivar usuario (soft delete)
router.patch('/uid/:uid/desactivar', desactivarUsuario);

module.exports = router;
