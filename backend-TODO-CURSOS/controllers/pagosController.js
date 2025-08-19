const pool = require('../db');

// Obtener todos los pagos
const getPagos = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM pagos ORDER BY fecha_pago DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener pago por ID
const getPagoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM pagos WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener pago:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear nuevo pago
const crearPago = async (req, res) => {
  try {
    const { usuario_id, curso_id, monto, metodo_pago, estado } = req.body;

    console.log('Datos recibidos para crear pago:', req.body);

    if (
      typeof usuario_id !== 'number' || isNaN(usuario_id) ||
      typeof curso_id !== 'number' || isNaN(curso_id) ||
      typeof monto !== 'number' || isNaN(monto) ||
      !metodo_pago ||
      !estado
    ) {
      return res.status(400).json({ message: 'Faltan datos obligatorios o tienen formato incorrecto' });
    }

    const query = `
      INSERT INTO pagos (usuario_id, curso_id, monto, metodo_pago, estado, fecha_pago)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id
    `;
    const values = [usuario_id, curso_id, monto, metodo_pago, estado];

    const result = await pool.query(query, values);
    res.status(201).json({ id: result.rows[0].id });
  } catch (error) {
    console.error('Error al crear pago:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Editar pago
const editarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, metodo_pago, monto } = req.body;

    const pagoExistente = await pool.query('SELECT * FROM pagos WHERE id = $1', [id]);
    if (pagoExistente.rows.length === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    await pool.query(`
      UPDATE pagos
      SET estado = COALESCE($1, estado),
          metodo_pago = COALESCE($2, metodo_pago),
          monto = COALESCE($3, monto)
      WHERE id = $4
    `, [estado, metodo_pago, monto, id]);

    res.json({ message: 'Pago actualizado correctamente' });
  } catch (error) {
    console.error('Error al editar pago:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar pago
const eliminarPago = async (req, res) => {
  try {
    const { id } = req.params;

    const pagoExistente = await pool.query('SELECT * FROM pagos WHERE id = $1', [id]);
    if (pagoExistente.rows.length === 0) {
      return res.status(404).json({ message: 'Pago no encontrado' });
    }

    await pool.query('DELETE FROM pagos WHERE id = $1', [id]);
    res.json({ message: 'Pago eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar pago:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getPagos,
  getPagoPorId,
  crearPago,
  editarPago,
  eliminarPago
};
