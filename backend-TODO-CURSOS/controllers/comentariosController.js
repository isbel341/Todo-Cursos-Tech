//esto es lo que tengo en comentariosController.js
// controllers/comentariosController.js

const pool = require('../db');

// Obtener todos los comentarios de un curso
const obtenerComentarios = async (req, res) => {
    try {
        const { curso_id } = req.params;

        if (!curso_id) {
            return res.status(400).json({ error: 'No se especificó el curso' });
        }

        const result = await pool.query(
            `SELECT c.id, c.texto, c.calificacion, c.fecha,
                    u.nombre AS usuario
             FROM comentarios c
             JOIN usuarios u ON u.id = c.usuario_id
             WHERE c.curso_id = $1
             ORDER BY c.fecha DESC`,
            [curso_id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener comentarios:', err);
        res.status(500).json({ error: 'Error al obtener comentarios' });
    }
};

// Agregar un comentario
const agregarComentario = async (req, res) => {
    try {
        const { curso_id } = req.params;
        const { texto, calificacion } = req.body;

        if (!curso_id) {
            return res.status(400).json({ error: 'No se especificó el curso' });
        }

        if (!texto || !calificacion) {
            return res.status(400).json({ error: 'Texto y calificación son obligatorios' });
        }

        const usuario_id = req.user.id; // Obtenido del token
        const fecha = new Date();

        const result = await pool.query(
            `INSERT INTO comentarios (usuario_id, curso_id, texto, calificacion, fecha)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [usuario_id, curso_id, texto, calificacion, fecha]
        );

        res.json({ message: 'Comentario agregado correctamente', comentario: result.rows[0] });
    } catch (err) {
        console.error('Error al insertar comentario:', err);
        res.status(500).json({ error: 'No se pudo insertar el comentario' });
    }
};

module.exports = {
    obtenerComentarios,
    agregarComentario
};
