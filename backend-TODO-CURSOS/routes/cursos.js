// esto es lo que tengo en cursos.js
// routes/cursos.js
const express = require('express');
const router = express.Router();
const { getCursos, getCursoById, agregarCurso } = require('../controllers/cursosController');
const { verificarToken, esAdmin } = require('../middlewares/auth');
const { editarCurso } = require('../controllers/cursosController');

// Middleware para verificar token y rol de administrador
router.put('/:id', verificarToken, esAdmin, editarCurso);

// Públicos
router.get('/', getCursos);
router.get('/:id', getCursoById);

// Solo admin puede crear cursos
router.post('/', verificarToken, esAdmin, agregarCurso);

module.exports = router;

