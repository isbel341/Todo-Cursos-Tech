// esto es lo que tengo en categorias.js
// routes/categorias.js
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias ORDER BY nombre');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

module.exports = router;
