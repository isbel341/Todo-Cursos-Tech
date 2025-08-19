// esto es lo que tengo en usuarios.js
// routes/usuarios.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verificarToken } = require('../middlewares/auth');

// Ruta para obtener todos los usuarios (excepto el propio)
router.get('/todos', verificarToken, async (req, res) => {
  const miId = req.user.id;
  try {
    const result = await pool.query(
      'SELECT id, nombre, email, rol_id FROM usuarios WHERE id != $1 ORDER BY nombre',
      [miId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

module.exports = router;
