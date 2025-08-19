const express = require('express');
const router = express.Router();
const leccionesController = require('../controllers/leccionesController');

router.get('/curso/:curso_id', leccionesController.getLeccionesPorCurso);
router.get('/:id', leccionesController.getLeccion);
router.post('/', leccionesController.crearLeccion);
router.put('/:id', leccionesController.editarLeccion);
router.delete('/:id', leccionesController.eliminarLeccion);

module.exports = router;