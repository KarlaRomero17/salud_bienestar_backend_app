const express = require("express");
const router = express.Router();
const publicacionController = require("../controllers/publicacionController")

//Listar 
router.get("/", publicacionController.obtenerPublicaciones);
//Agregar
router.post("/", publicacionController.crearPublicacion);
//Obtener por ID
router.get("/:id", publicacionController.obtenerPublicacionPorId);
//Editar
router.put('/:id', publicacionController.editarPublicacion);
//Eliminar
router.delete('/:id', publicacionController.eliminarPublicacion);

module.exports = router;