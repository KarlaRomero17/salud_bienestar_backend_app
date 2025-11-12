// SALUD_BIENESTAR_BACKEND_APP/routes/planComida.js

const express = require('express');
const router = express.Router();
    
const { getPlanesComida } = require('../controllers/planComidaController');

// La única ruta que necesitamos: GET /api/planes-comida/
router.get('/', getPlanesComida);

module.exports = router;