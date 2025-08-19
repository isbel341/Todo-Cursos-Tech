//esto es lo que tengo en chat.js
// routes/chat.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { verificarToken } = require('../middlewares/auth');

// Obtener mensajes entre usuarios
router.get('/mensajes', verificarToken, chatController.obtenerMensajes);

// Enviar un nuevo mensaje
router.post('/enviar', verificarToken, chatController.enviarMensaje);

module.exports = router;
