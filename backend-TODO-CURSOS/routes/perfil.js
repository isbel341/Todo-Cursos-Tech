// routes/perfil.js
const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const perfilController = require('../controllers/perfilController');

router.get('/me', verificarToken, perfilController.getPerfilMe);

module.exports = router;
// controllers/perfilController.js
const pool = require('../db');
  