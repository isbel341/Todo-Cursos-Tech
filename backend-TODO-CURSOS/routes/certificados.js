
// esto es lo que tengo en certificados.js
// routes/certificados.js
const express = require('express');
const router = express.Router();
const certificadosController = require('../controllers/certificadosController');
const { verificarToken } = require('../middlewares/auth');

router.get('/', verificarToken, certificadosController.obtenerCertificados);
router.get('/descargar/:id', verificarToken, certificadosController.descargarCertificadoPDF);
router.post('/generar', verificarToken, certificadosController.generarCertificado);

module.exports = router;
