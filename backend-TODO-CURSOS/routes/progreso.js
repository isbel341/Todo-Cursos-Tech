const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const {
  marcarLeccionCompletada,
  obtenerProgresoCurso
} = require('../controllers/progresoController');

// POST para marcar lección completada (token requerido)
router.post('/marcar', verificarToken, marcarLeccionCompletada);

// GET para obtener progreso (solo curso_id, usuario_id viene del token)
router.get('/curso/:curso_id', verificarToken, obtenerProgresoCurso);

module.exports = router;
