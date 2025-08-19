// routes/cursosCompletados.js
const express = require('express');
const router = express.Router();
const cursosCompletadosController = require('../controllers/cursosCompletadosController');
const { verificarToken } = require('../middlewares/auth');

// Marcar curso como completado
router.post('/marcar', verificarToken, cursosCompletadosController.marcarCursoCompletado);

// Obtener cursos completados del usuario
router.get('/', verificarToken, cursosCompletadosController.obtenerCursosCompletados);

module.exports = router;
