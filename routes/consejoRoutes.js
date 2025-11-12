// routes/consejoRoutes.js
const express = require('express');
const router = express.Router();
const { getTodosLosConsejos } = require('../controllers/consejoController');

// GET /api/consejos
router.get('/', getTodosLosConsejos);

module.exports = router;