// esto es lo que tengo en comentarios.js
// routes/comentarios.js
const express = require('express');
const router = express.Router();
const comentariosController = require('../controllers/comentariosController');
const { verificarToken } = require('../middlewares/auth');

// Obtener comentarios de un curso
router.get('/:curso_id', comentariosController.obtenerComentarios);

// Agregar comentario a un curso (usuario debe estar logueado)
router.post('/:curso_id', verificarToken, comentariosController.agregarComentario);

module.exports = router;
