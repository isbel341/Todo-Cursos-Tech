const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');

// Obtener todos los pagos
router.get('/', pagosController.getPagos);

// Obtener pago por ID
router.get('/:id', pagosController.getPagoPorId);

// Crear nuevo pago
router.post('/', pagosController.crearPago);

// Editar pago
router.put('/:id', pagosController.editarPago);

// Eliminar pago
router.delete('/:id', pagosController.eliminarPago);

module.exports = router;
