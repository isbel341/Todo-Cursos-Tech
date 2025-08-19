//esto es lo que tengo en cursoDetalle.js
// En routes/cursoDetalle.js
const express = require('express');
const router = express.Router();
const cursoDetalleController = require('../controllers/cursoDetalleController');

router.get('/videos', cursoDetalleController.getVideosPorCurso);
router.post('/videos', cursoDetalleController.agregarVideo);

module.exports = router;
