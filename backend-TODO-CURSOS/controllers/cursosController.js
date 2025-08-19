//esto es lo que tengo en cursosController.js
// En controllers/cursosController.js
const pool = require('../db');

const getCursos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, cat.nombre as categoria
      FROM cursos c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      ORDER BY fecha_creacion DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los cursos' });
  }
};

const getCursoById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT c.*, cat.nombre as categoria
      FROM cursos c
      LEFT JOIN categorias cat ON c.categoria_id = cat.id
      WHERE c.id = $1
    `, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el curso' });
  }
};

const agregarCurso = async (req, res) => {
  console.log('Datos recibidos para crear curso:', req.body); // ✅ aquí sí existe req
  const { titulo, descripcion, categoria_id, nivel, video_url, creado_por } = req.body;

  try {
    const usuario = await pool.query('SELECT id FROM usuarios WHERE id = $1', [creado_por]);
if (usuario.rows.length === 0) {
  return res.status(400).json({ error: 'Usuario creador no válido' });
}


    await pool.query(
      
      `INSERT INTO cursos (titulo, descripcion, categoria_id, nivel, video_url, creado_por)
VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [
        titulo,
        descripcion,
        categoria_id,
        nivel,
        video_url, // Asegúrate de que este campo exista en tu tabla
        creado_por // Asegúrate de que este campo exista en tu tabla
      ]
    
    );
    res.status(201).json({ message: 'Curso agregado correctamente' });
  } catch (err) {
    console.error('Error al agregar el curso:', err);
    res.status(500).json({ error: err.message });
  }
};

// 〰️ ➤ Función para editar curso (agregada aquí)
const editarCurso = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, categoria_id, nivel, video_url } = req.body;

  try {
    const resultado = await pool.query(
      `UPDATE cursos SET titulo = $1, descripcion = $2, categoria_id = $3, nivel = $4, video_url = $5 WHERE id = $6`,
      [titulo, descripcion, categoria_id, nivel, video_url, id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.json({ message: 'Curso actualizado correctamente' });
  } catch (err) {
    console.error('Error al editar curso:', err); // ✅ imprime el error completo
    res.status(500).json({ error: 'Error al editar curso' });
  }
};

// Exportar las funciones
module.exports = { getCursos, getCursoById, agregarCurso, editarCurso }; // ✅ exportamos la nueva función


