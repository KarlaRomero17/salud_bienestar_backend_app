const express = require("express");
const router = express.Router();
const comentarioController = require("../controllers/comentarioController");

//Listar
router.get("/", comentarioController.obtenerComentarios);
//Agreagr
router.post("/", comentarioController.crearComentario);
//Obtener por id de publicación
router.get("/publicacion/:publicacionId", comentarioController.obtenerComentariosPorPublicacion);
//Editar
router.put('/:id', comentarioController.editarComentario);
//Eliminar
router.delete('/:id', comentarioController.eliminarComentario);

module.exports = router;