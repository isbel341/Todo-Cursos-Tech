// controllers/perfilController.js
const pool = require('../db');

exports.getPerfilMe = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1) Datos básicos del usuario
    const userRes = await pool.query(
      `SELECT id, nombre, email,
              COALESCE(avatar_url, '') AS avatar_url,
              COALESCE(created_at, fecha_creacion, now()) AS fecha_creacion
       FROM usuarios WHERE id = $1`,
      [userId]
    );
    if (userRes.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    const usuario = userRes.rows[0];

    // 2) Estadísticas: cursos inscritos, certificados, progreso medio, total EXP (si tienes)
    const [inscripcionesRes, certificadosRes, progresoRes] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS total_inscritos FROM inscripciones WHERE usuario_id = $1', [userId]),
      pool.query('SELECT COUNT(*)::int AS total_certificados FROM certificados WHERE usuario_id = $1', [userId]),
      pool.query(
        `SELECT p.curso_id, COALESCE(c.titulo, '') AS titulo, p.porcentaje
         FROM progreso p
         LEFT JOIN cursos c ON p.curso_id = c.id
         WHERE p.usuario_id = $1
         ORDER BY p.updated_at DESC NULLS LAST`,
        [userId]
      )
    ]);

    const estadisticas = {
      cursos: inscripcionesRes.rows[0] ? inscripcionesRes.rows[0].total_inscritos : 0,
      certificados: certificadosRes.rows[0] ? certificadosRes.rows[0].total_certificados : 0,
      // promedio de progreso (si hay registros)
      promedio_progreso: (() => {
        const rows = progresoRes.rows;
        if (!rows || rows.length === 0) return 0;
        const sum = rows.reduce((s, r) => s + Number(r.porcentaje || 0), 0);
        return Math.round(sum / rows.length);
      })()
    };

    // 3) Progreso por curso (limitar a N)
    const progresoPorCurso = progresoRes.rows.map(r => ({
      curso_id: r.curso_id,
      titulo: r.titulo,
      porcentaje: Number(r.porcentaje || 0)
    }));

    // 4) Certificados recientes (limitar 5)
    const certificadosListRes = await pool.query(
      `SELECT ce.id, ce.curso_id, c.titulo as curso, ce.fecha_emision, ce.codigo_certificado
       FROM certificados ce
       LEFT JOIN cursos c ON ce.curso_id = c.id
       WHERE ce.usuario_id = $1
       ORDER BY ce.fecha_emision DESC
       LIMIT 8`,
      [userId]
    );

    // 5) Actividad reciente: usar log_actividad si existe, si no tomar inscripciones
    let actividad = [];
    try {
      const actRes = await pool.query(
        `SELECT id, accion, detalle, fecha
         FROM log_actividad
         WHERE usuario_id = $1
         ORDER BY fecha DESC
         LIMIT 10`,
        [userId]
      );
      actividad = actRes.rows.map(r => ({ id: r.id, texto: r.accion + (r.detalle ? ' • ' + r.detalle : ''), fecha: r.fecha }));
    } catch (e) {
      // fallback: últimas inscripciones
      const insAct = await pool.query(
        `SELECT i.curso_id, c.titulo, i.fecha_inscripcion
         FROM inscripciones i
         LEFT JOIN cursos c ON i.curso_id = c.id
         WHERE i.usuario_id = $1
         ORDER BY i.fecha_inscripcion DESC
         LIMIT 8`,
        [userId]
      );
      actividad = insAct.rows.map(r => ({ texto: `Inscrito en ${r.titulo}`, fecha: r.fecha_inscripcion }));
    }

    // 6) Cursos recientes (si quieres mostrar títulos)
    const recientesRes = await pool.query(
      `SELECT c.id, c.titulo, c.descripcion, c.imagen
       FROM cursos c
       JOIN inscripciones i ON i.curso_id = c.id
       WHERE i.usuario_id = $1
       ORDER BY i.fecha_inscripcion DESC
       LIMIT 6`,
      [userId]
    );

    // Responder
    res.json({
      usuario,
      estadisticas,
      progreso: progresoPorCurso,
      certificados: certificadosListRes.rows,
      actividad,
      cursos_recientes: recientesRes.rows
    });
  } catch (error) {
    console.error('Error en getPerfilMe:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};
// Exportar el controlador