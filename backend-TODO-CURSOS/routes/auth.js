// esto es lo que tengo en auth.js
// routes/auth.js
const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword
} = require('../controllers/authController');

// Ruta para registrar usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para pedir enlace de reseteo (olvidé mi contraseña)
router.post('/request-reset', requestPasswordReset);

// Ruta para cambiar contraseña con token
router.post('/reset-password', resetPassword);

module.exports = router;
