// routes/evaluaciones.js
const express = require('express');
const router = express.Router();
const { verificarToken, esAdminOTutor } = require('../middlewares/auth');
const evaluacionesCtrl = require('../controllers/evaluacionesController');

// Si una función no está implementada en el controlador, evitamos que rompa el server
const dummy = (req, res) => res.status(501).json({ error: 'Función no implementada' });

// Rutas para admin/tutor
router.post('/', verificarToken, esAdminOTutor, evaluacionesCtrl.createEvaluacion || dummy);
router.put('/:id', verificarToken, esAdminOTutor, evaluacionesCtrl.updateEvaluacion || dummy);
router.delete('/:id', verificarToken, esAdminOTutor, evaluacionesCtrl.deleteEvaluacion || dummy);

// Rutas para estudiantes
router.get('/', verificarToken, evaluacionesCtrl.getEvaluaciones || dummy);
router.post('/responder', verificarToken, evaluacionesCtrl.responderEvaluacion);
router.get('/resultado/:curso_id', verificarToken, evaluacionesCtrl.getResultado || dummy);

module.exports = router;
