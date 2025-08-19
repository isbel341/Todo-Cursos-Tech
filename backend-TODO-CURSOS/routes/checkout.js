//esto es lo que tengo en checkout.js
// routes/checkout.js
const express = require('express');
const router = express.Router();
const { checkout } = require('../controllers/checkoutController');
const { verificarToken } = require('../middlewares/auth');

router.post('/', verificarToken, checkout);

module.exports = router;
