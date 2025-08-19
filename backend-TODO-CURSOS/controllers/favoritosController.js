//esto es lo que tengo en favoritosController.js
// controllers/favoritosController.js

// controllers/favoritosControllers.js
const pool = require('../db');

const favoritosController = {
  obtenerFavoritos: async (req, res) => {
    try {
      const usuarioId = req.params.usuarioId;
      const query = `
        SELECT f.id, f.curso_id, c.nombre AS curso_nombre, f.fecha_guardado
        FROM favoritos f
        JOIN cursos c ON f.curso_id = c.id
        WHERE f.usuario_id = $1
        ORDER BY f.fecha_guardado DESC
      `;
      const { rows } = await pool.query(query, [usuarioId]);
      res.json(rows);
    } catch (error) {
      console.error('Error obtener favoritos:', error);
      res.status(500).json({ error: 'Error al obtener favoritos' });
    }
  },

  agregarFavorito: async (req, res) => {
    try {
      const { usuario_id, curso_id } = req.body;
      const check = await pool.query(
        'SELECT 1 FROM favoritos WHERE usuario_id = $1 AND curso_id = $2',
        [usuario_id, curso_id]
      );

      if (check.rows.length > 0) {
        return res.status(400).json({ error: 'El curso ya está en favoritos' });
      }

      const { rows } = await pool.query(
        `INSERT INTO favoritos (usuario_id, curso_id, fecha_guardado)
         VALUES ($1, $2, NOW()) RETURNING *`,
        [usuario_id, curso_id]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error('Error agregar favorito:', error);
      res.status(500).json({ error: 'Error al agregar favorito' });
    }
  },

  eliminarFavorito: async (req, res) => {
    try {
      const favoritoId = req.params.id;
      const { rows } = await pool.query(
        'DELETE FROM favoritos WHERE id = $1 RETURNING *',
        [favoritoId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: 'Favorito no encontrado' });
      }

      res.json({ mensaje: 'Favorito eliminado correctamente', favorito: rows[0] });
    } catch (error) {
      console.error('Error eliminar favorito:', error);
      res.status(500).json({ error: 'Error al eliminar favorito' });
    }
  }
};

module.exports = favoritosController;
