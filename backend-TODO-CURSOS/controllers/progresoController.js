//esto es lo que tengo en progresoController.js
// controllers/progresoController.js
const pool = require('../db');

exports.marcarLeccionCompletada = async (req, res) => {
  try {
    const { curso_id, leccion_id, completado } = req.body;
    const usuario_id = req.user.id;  // obtener usuario del token

    if (!usuario_id || !curso_id || !leccion_id) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    await pool.query(`
      INSERT INTO progreso_lecciones (usuario_id, curso_id, leccion_id, completado)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (usuario_id, leccion_id)
      DO UPDATE SET completado = EXCLUDED.completado, fecha = CURRENT_TIMESTAMP
    `, [usuario_id, curso_id, leccion_id, completado || true]);

    res.json({ message: 'Lección marcada correctamente' });
  } catch (error) {
    console.error('Error en marcarLeccionCompletada:', error);
    res.status(500).json({ error: 'Error al actualizar progreso' });
  }
};

exports.obtenerProgresoCurso = async (req, res) => {
  try {
    const { curso_id } = req.params;
    const usuario_id = req.user.id;  // obtener usuario del token

    if (!usuario_id || !curso_id) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    const result = await pool.query(
      'SELECT porcentaje FROM progreso WHERE usuario_id = $1 AND curso_id = $2',
      [usuario_id, curso_id]
    );

    if (result.rows.length === 0) {
      return res.json({ porcentaje: 0 });
    }

    res.json({ porcentaje: result.rows[0].porcentaje });
  } catch (error) {
    console.error('Error en obtenerProgresoCurso:', error);
    res.status(500).json({ error: 'Error al obtener progreso' });
  }
};
