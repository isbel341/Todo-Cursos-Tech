const pool = require('../db'); // Asegúrate de que este archivo exporta tu conexión a la base de datos
// Crear una nueva suscripción
exports.crearSuscripcion = async (req, res) => {
  try {
    const { usuario_id, plan, fecha_inicio, fecha_fin, metodo_pago } = req.body;

    if (!usuario_id || !plan || !fecha_inicio || !fecha_fin || !metodo_pago) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const query = `
      INSERT INTO suscripciones (usuario_id, plan, fecha_inicio, fecha_fin, metodo_pago)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [usuario_id, plan, fecha_inicio, fecha_fin, metodo_pago];
    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      message: 'Suscripción creada con éxito',
      suscripcion: result.rows[0]
    });
  } catch (error) {
    console.error('Error creando suscripción:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener suscripción por usuario_id (la última activa)
exports.obtenerSuscripcionPorUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;

    const query = `
      SELECT * FROM suscripciones
      WHERE usuario_id = $1
      ORDER BY fecha_fin DESC
      LIMIT 1;
    `;
    const result = await pool.query(query, [usuario_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No tienes suscripción activa.' });
    }

    res.json({ success: true, suscripcion: result.rows[0] });
  } catch (error) {
    console.error('Error obteniendo suscripción:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar suscripción por usuario_id (última suscripción activa)
exports.actualizarSuscripcion = async (req, res) => {
  try {
    const { usuario_id, plan, metodo_pago } = req.body;
    if (!usuario_id || !plan || !metodo_pago) {
      return res.status(400).json({ error: 'Datos incompletos para actualizar.' });
    }

    // Primero obtenemos la última suscripción activa
    const querySelect = `
      SELECT id FROM suscripciones
      WHERE usuario_id = $1
      ORDER BY fecha_fin DESC
      LIMIT 1;
    `;
    const resultSelect = await pool.query(querySelect, [usuario_id]);
    if (resultSelect.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No se encontró suscripción para actualizar.' });
    }
    const id = resultSelect.rows[0].id;

    // Actualizamos la suscripción
    const queryUpdate = `
      UPDATE suscripciones
      SET plan = $1, metodo_pago = $2
      WHERE id = $3
      RETURNING *;
    `;
    const values = [plan, metodo_pago, id];
    const resultUpdate = await pool.query(queryUpdate, values);

    res.json({
      success: true,
      message: 'Suscripción actualizada con éxito',
      suscripcion: resultUpdate.rows[0]
    });
  } catch (error) {
    console.error('Error actualizando suscripción:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
