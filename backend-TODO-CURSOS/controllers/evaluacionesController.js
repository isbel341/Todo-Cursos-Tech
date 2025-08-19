// controllers/evaluacionesController.js
const pool = require('../db');
const { marcarCursoCompletado } = require('./cursosCompletadosController');

// 📌 Crear evaluación (admin/tutor)
exports.createEvaluacion = async (req, res) => {
  // Si viene en body, lo usa, si no, lo toma del query o params
  const curso_id = req.body.curso_id || req.query.curso_id || req.params.curso_id;
  const { pregunta, opcion1, opcion2, opcion3, opcion_correcta } = req.body;

  if (!curso_id || !pregunta || !opcion1 || !opcion2 || !opcion3 || !opcion_correcta) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO evaluaciones (curso_id, pregunta, opcion1, opcion2, opcion3, opcion_correcta)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [curso_id, pregunta, opcion1, opcion2, opcion3, opcion_correcta]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear evaluación:', err);
    res.status(500).json({ error: 'Error al crear evaluación' });
  }
};

// 📌 Actualizar evaluación (admin/tutor)
exports.updateEvaluacion = async (req, res) => {
  const { id } = req.params;
  const { pregunta, opcion1, opcion2, opcion3, opcion_correcta } = req.body;

  try {
    const result = await pool.query(
      `UPDATE evaluaciones
       SET pregunta=$1, opcion1=$2, opcion2=$3, opcion3=$4, opcion_correcta=$5
       WHERE id=$6 RETURNING *`,
      [pregunta, opcion1, opcion2, opcion3, opcion_correcta, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Evaluación no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar evaluación:', err);
    res.status(500).json({ error: 'Error al actualizar evaluación' });
  }
};

// 📌 Eliminar evaluación (admin/tutor)
exports.deleteEvaluacion = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM evaluaciones WHERE id=$1 RETURNING *',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Evaluación no encontrada' });
    }

    res.json({ mensaje: 'Evaluación eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar evaluación:', err);
    res.status(500).json({ error: 'Error al eliminar evaluación' });
  }
};

// 📌 Obtener preguntas de un curso (para estudiantes)
exports.getEvaluaciones = async (req, res) => {
  const curso_id = req.query.curso_id || req.params.curso_id;

  if (!curso_id) {
    return res.status(400).json({ error: 'El ID del curso es obligatorio' });
  }

  try {
    const result = await pool.query(
      `SELECT id, pregunta, opcion1, opcion2, opcion3
       FROM evaluaciones 
       WHERE curso_id = $1`,
      [curso_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener evaluaciones:', err);
    res.status(500).json({ error: 'Error al obtener evaluaciones' });
  }
};

// 📌 Responder evaluación (para estudiantes)
exports.responderEvaluacion = async (req, res) => {
  const curso_id = req.body.curso_id || req.query.curso_id || req.params.curso_id;
  const { respuestas } = req.body;
  const usuario_id = req.user.id;

  if (!curso_id) {
    return res.status(400).json({ error: 'El ID del curso es obligatorio' });
  }

  if (!Array.isArray(respuestas) || respuestas.length === 0) {
    return res.status(400).json({ error: 'No se recibieron respuestas' });
  }

  try {
    await pool.query('BEGIN');

    let correctas = 0;
    const resultados = [];

    for (const { evaluacion_id, respuesta } of respuestas) {
      const evalRes = await pool.query(
        `SELECT opcion_correcta FROM evaluaciones WHERE id = $1`,
        [evaluacion_id]
      );

      if (evalRes.rowCount === 0) {
        throw new Error(`Pregunta con id ${evaluacion_id} no encontrada`);
      }

      const esCorrecta = evalRes.rows[0].opcion_correcta === respuesta;
      if (esCorrecta) correctas++;

      await pool.query(
        `INSERT INTO respuestas_evaluacion (usuario_id, evaluacion_id, respuesta, correcta, fecha)
         VALUES ($1, $2, $3, $4, NOW())`,
        [usuario_id, evaluacion_id, respuesta, esCorrecta]
      );

      resultados.push({ evaluacion_id, correcta: esCorrecta });
    }

    // Marcar curso como completado automáticamente
    const existeCurso = await pool.query(
      'SELECT * FROM cursos_completados WHERE usuario_id = $1 AND curso_id = $2',
      [usuario_id, curso_id]
    );

    if (existeCurso.rowCount === 0) {
      await pool.query(
        'INSERT INTO cursos_completados (usuario_id, curso_id, fecha_completado) VALUES ($1, $2, NOW())',
        [usuario_id, curso_id]
      );
    }

    await pool.query('COMMIT');
    res.json({
      resultados,
      correctas,
      total: respuestas.length,
      mensaje: 'Curso marcado como completado automáticamente'
    });

  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error al registrar respuestas:', err);
    res.status(500).json({ error: 'Error al registrar respuestas' });
  }
};

// 📌 Obtener resultado de un curso (para estudiantes)
exports.getResultado = async (req, res) => {
  const curso_id = req.params.curso_id || req.query.curso_id;
  const usuario_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT r.evaluacion_id, r.respuesta, r.correcta, e.pregunta
       FROM respuestas_evaluacion r
       JOIN evaluaciones e ON r.evaluacion_id = e.id
       WHERE r.usuario_id = $1 AND e.curso_id = $2`,
      [usuario_id, curso_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener resultado:', err);
    res.status(500).json({ error: 'Error al obtener resultado' });
  }
};
