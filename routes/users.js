// routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// CRUD de usuarios
router.post('/', usersController.crearUsuario);                          // Crear usuario
router.get('/:uuid', usersController.obtenerPerfil);                    // Obtener perfil
router.put('/:uuid', usersController.actualizarPerfil);                 // Actualizar perfil

// Gestión de peso e historial
router.post('/:uuid/peso', usersController.registrarPeso);              // Registrar nuevo peso
router.get('/:uuid/historial-peso', usersController.obtenerHistorialPeso); // Obtener historial
router.get('/:uuid/estadisticas-peso', usersController.obtenerEstadisticasPeso); // Estadísticas
router.delete('/:uuid/historial-peso/:registroId', usersController.eliminarRegistroPeso); // Eliminar registro

module.exports = router;