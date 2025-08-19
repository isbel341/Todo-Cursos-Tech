// controllers/inscripcionesController.js
const pool = require('../db');

exports.getInscripciones = async (req, res) => {
  try {
    // Validar que el usuario está autenticado y req.user existe
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Usuario no autenticado' });
    }

    const userId = req.user.id;

    console.log('Usuario consultando inscripciones:', userId);

    const query = `
      SELECT i.curso_id, c.titulo, c.descripcion, c.nivel, c.imagen,
             COALESCE(p.porcentaje, 0) AS progreso
      FROM inscripciones i
      JOIN cursos c ON i.curso_id = c.id
      LEFT JOIN progreso p ON p.usuario_id = i.usuario_id AND p.curso_id = i.curso_id
      WHERE i.usuario_id = $1
    `;

    const result = await pool.query(query, [userId]);

    console.log('Resultado inscripciones:', result.rows);

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener inscripciones:', err);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
};
