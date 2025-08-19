//esto es lo que tengo en chatController.js
// controllers/chatController.js
const pool = require('../db');

// Obtener mensajes entre el usuario autenticado y otro usuario
exports.obtenerMensajes = async (req, res) => {
  const emisor_id = req.user.id;
  const receptor_id = req.query.receptor_id;

  if (!receptor_id) {
    return res.status(400).json({ error: 'Falta el receptor_id en la consulta' });
  }

  try {
    const result = await pool.query(
      `
      SELECT * FROM mensajes_chat
      WHERE (emisor_id = $1 AND receptor_id = $2)
         OR (emisor_id = $2 AND receptor_id = $1)
      ORDER BY fecha_envio ASC
      `,
      [emisor_id, receptor_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

// Enviar un nuevo mensaje
exports.enviarMensaje = async (req, res) => {
  const emisor_id = req.user.id;
  const { receptor_id, mensaje } = req.body;

  if (!receptor_id || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const result = await pool.query(
      `
      INSERT INTO mensajes_chat (emisor_id, receptor_id, mensaje, fecha_envio, leido)
      VALUES ($1, $2, $3, NOW(), false)
      RETURNING *
      `,
      [emisor_id, receptor_id, mensaje]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ error: 'Error al enviar mensaje' });
  }
};
