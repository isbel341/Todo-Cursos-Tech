//esto es lo que tengo en cupones.js
// routes/cupones.js

const express = require('express');
const router = express.Router();
const pool = require('../db');
const { verificarToken, esAdmin } = require('../middlewares/auth');

// 📌 Obtener todos los cupones (solo admin)
router.get('/', verificarToken, esAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cupones ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cupones' });
  }
});

// 📌 Crear cupón
router.post('/', verificarToken, esAdmin, async (req, res) => {
  const { codigo, descuento_porcentaje, fecha_expiracion } = req.body;
  if (!codigo || !descuento_porcentaje || !fecha_expiracion) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  try {
    await pool.query(
      'INSERT INTO cupones (codigo, descuento_porcentaje, fecha_expiracion) VALUES ($1, $2, $3)',
      [codigo, descuento_porcentaje, fecha_expiracion]
    );
    res.json({ mensaje: 'Cupón creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear cupón' });
  }
});

// 📌 Validar cupón (para el usuario)
router.get('/validar/:codigo', async (req, res) => {
  const { codigo } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM cupones WHERE codigo = $1 AND fecha_expiracion >= CURRENT_DATE',
      [codigo]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Cupón no válido o expirado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al validar cupón' });
  }
});

// 📌 Eliminar cupón (solo admin)
router.delete('/:id', verificarToken, esAdmin, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM cupones WHERE id = $1', [id]);
    res.json({ mensaje: 'Cupón eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar cupón' });
  }
});

module.exports = router;
