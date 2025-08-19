//esto es lo que tengo en checkoutController.js
// controllers/checkoutController.js

const pool = require('../db');

// Checkout simple: convierte carrito en inscripciones y limpia carrito
exports.checkout = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Obtener items del carrito
    const carritoRes = await pool.query(
      `SELECT curso_id FROM carrito_compras WHERE usuario_id = $1`,
      [userId]
    );
    const items = carritoRes.rows;

    if (items.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío' });
    }

    // 2. Insertar en inscripciones (una por curso)
    const now = new Date();
    const insertPromises = items.map(i => {
      return pool.query(
        `INSERT INTO inscripciones (usuario_id, curso_id, fecha_inscripcion)
         VALUES ($1, $2, $3)
         ON CONFLICT (usuario_id, curso_id) DO NOTHING`, // evita duplicados si ya está inscrito
        [userId, i.curso_id, now]
      );
    });
    await Promise.all(insertPromises);

    // 3. Limpiar carrito
    await pool.query(
      `DELETE FROM carrito_compras WHERE usuario_id = $1`,
      [userId]
    );

    res.json({ message: 'Checkout completado. Estás inscrito en los cursos.' });
  } catch (err) {
    console.error('Error en checkout:', err);
    res.status(500).json({ error: 'Error durante el checkout' });
  }
};

// Obtener carrito de compras del usuario
exports.getCarrito = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT cc.id, c.titulo, c.precio, cc.fecha_agregado
         FROM carrito_compras cc
         JOIN cursos c ON cc.curso_id = c.id
         WHERE cc.usuario_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Carrito vacío' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener carrito:', err);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
};
