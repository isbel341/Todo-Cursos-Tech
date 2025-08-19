// controllers/cursosCompletadosController.js
// Este controlador maneja los cursos completados por los usuarios
const pool = require('../db');
const { generarCertificadoInterno } = require('./certificadosController');

// Marcar curso como completado
exports.marcarCursoCompletado = async (req, res) => {
  const usuarioId = req.user.id;
  const { cursoId } = req.body;

  try {
    const existente = await pool.query(
      'SELECT * FROM cursos_completados WHERE usuario_id = $1 AND curso_id = $2',
      [usuarioId, cursoId]
    );

    if (existente.rows.length > 0) {
      return res.status(400).json({ error: 'Curso ya registrado como completado' });
    }

    const resultado = await pool.query(
      'INSERT INTO cursos_completados (usuario_id, curso_id, fecha_completado) VALUES ($1, $2, NOW()) RETURNING *',
      [usuarioId, cursoId]
    );

    // Generar certificado automáticamente si no existe
    await generarCertificadoInterno(usuarioId, cursoId);

    res.status(201).json({ 
      mensaje: 'Curso marcado como completado y certificado generado si no existía', 
      registro: resultado.rows[0] 
    });
  } catch (err) {
    console.error('Error al marcar curso completado:', err);
    res.status(500).json({ error: 'Error del servidor', detalle: err.message });
  }
};

// Obtener cursos completados del usuario
exports.obtenerCursosCompletados = async (req, res) => {
  const usuarioId = req.user.id;

  try {
    const resultado = await pool.query(`
      SELECT c.id as id, c.titulo
      FROM cursos_completados cc
      JOIN cursos c ON cc.curso_id = c.id
      WHERE cc.usuario_id = $1
      ORDER BY cc.fecha_completado DESC
    `, [usuarioId]);

    res.json(resultado.rows);
  } catch (err) {
    console.error('Error al obtener cursos completados:', err);
    res.status(500).json({ error: 'Error del servidor', detalle: err.message });
  }
};
