// esto es lo que tengo en favoritos.js
// routes/favoritos.js
const express = require('express');
const router = express.Router();
const favoritosController = require('../controllers/favoritosController');

// Obtener favoritos de un usuario
router.get('/:usuarioId', favoritosController.obtenerFavoritos);

// Agregar favorito
router.post('/', favoritosController.agregarFavorito);

// Eliminar favorito por id
router.delete('/:id', favoritosController.eliminarFavorito);

module.exports = router;
// Exportar el router