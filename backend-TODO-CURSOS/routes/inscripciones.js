const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const { getInscripciones } = require('../controllers/inscripcionesController');

// La ruta está protegida con verificarToken para validar JWT
router.get('/', verificarToken, getInscripciones);

module.exports = router;
