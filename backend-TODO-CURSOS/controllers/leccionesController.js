const pool = require('../db');

// Helper para verificar permisos
function puedeEditar(rol) {
    return rol === 'admin' || rol === 'tutor';
}

// Obtener todas las lecciones de un curso
exports.getLeccionesPorCurso = async (req, res) => {
    const { curso_id } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM lecciones WHERE curso_id = $1 ORDER BY id ASC',
            [curso_id]
        );
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener lecciones' });
    }
};

// Obtener una lección por ID
exports.getLeccion = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM lecciones WHERE id = $1', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la lección' });
    }
};

// Crear una lección (solo admin/tutor)
exports.crearLeccion = async (req, res) => {
    const rol = req.headers['x-rol']; // O usa req.user.rol si tienes auth real
    if (!puedeEditar(rol)) return res.status(403).json({ error: 'Sin permisos' });

    const { curso_id, titulo, contenido, video_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO lecciones (curso_id, titulo, contenido, video_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [curso_id, titulo, contenido, video_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear lección' });
    }
};

// Editar una lección (solo admin/tutor)
exports.editarLeccion = async (req, res) => {
    const rol = req.headers['x-rol'];
    if (!puedeEditar(rol)) return res.status(403).json({ error: 'Sin permisos' });

    const { id } = req.params;
    const { titulo, contenido, video_url } = req.body;
    try {
        const result = await pool.query(
            'UPDATE lecciones SET titulo=$1, contenido=$2, video_url=$3 WHERE id=$4 RETURNING *',
            [titulo, contenido, video_url, id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al editar lección' });
    }
};

// Eliminar una lección (solo admin/tutor)
exports.eliminarLeccion = async (req, res) => {
    const rol = req.headers['x-rol'];
    if (!puedeEditar(rol)) return res.status(403).json({ error: 'Sin permisos' });

    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM lecciones WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'No encontrada' });
        res.json({ message: 'Lección eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar lección' });
    }
};