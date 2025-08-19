//este código define las rutas para manejar la suscripción de usuarios en una aplicación Express.js
// routes/suscripciones.js
const express = require('express');
const router = express.Router();
const suscripcionController = require('../controllers/suscripcionController');

// Obtener suscripción del usuario
router.get('/:usuario_id', suscripcionController.obtenerSuscripcionPorUsuario);

// Crear nueva suscripción
router.post('/', suscripcionController.crearSuscripcion);

// Actualizar suscripción (usa POST con body que contiene usuario_id, plan y metodo_pago)
router.post('/actualizar', suscripcionController.actualizarSuscripcion);

module.exports = router;
