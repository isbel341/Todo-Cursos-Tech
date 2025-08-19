// controllers/authController.js
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Helper: genera token aleatorio largo
const generarTokenReset = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Función para crear suscripción gratis por 30 días
async function crearSuscripcionGratis(usuario_id) {
  const fechaInicio = new Date();
  const fechaFin = new Date();
  fechaFin.setDate(fechaFin.getDate() + 30); // 30 días gratis

  const query = `
    INSERT INTO suscripciones (usuario_id, fecha_inicio, fecha_fin, estado, plan)
    VALUES ($1, $2, $3, 'prueba', 'gratis')
    RETURNING *;
  `;

  const result = await pool.query(query, [usuario_id, fechaInicio, fechaFin]);
  return result.rows[0];
}

exports.registerUser = async (req, res) => {
  const { nombre, email, password, rol_id } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Si no pasan rol_id, por defecto será estudiante (rol 1)
    const rol = rol_id || 1;

    // Crear usuario y devolver ID
    const resultUsuario = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol_id) VALUES ($1, $2, $3, $4) RETURNING id',
      [nombre, email, hashedPassword, rol]
    );

    const usuario_id = resultUsuario.rows[0].id;

    // Crear suscripción gratis automáticamente
    const suscripcion = await crearSuscripcionGratis(usuario_id);

    res.status(201).json({ 
      message: 'Usuario registrado correctamente y suscripción de prueba creada',
      usuario_id,
      suscripcion
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Contraseña incorrecta' });

    // Incluimos el rol en el payload
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol_id },
      process.env.JWT_SECRET,
      { expiresIn: '365d' }
    );

    res.json({ token, nombre: user.nombre, rol: user.rol_id, id: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Paso 1: pedir reset (genera token, lo guarda y devuelve enlace de prueba)
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const userRes = await pool.query('SELECT id, nombre FROM usuarios WHERE email = $1', [email]);
    const user = userRes.rows[0];
    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });

    const token = generarTokenReset();
    const ahora = new Date();
    const expira = new Date(ahora.getTime() + 1000 * 60 * 30); // 30 minutos

    await pool.query(
      `INSERT INTO reset_tokens (usuario_id, token, expira_en) VALUES ($1, $2, $3)`,
      [user.id, token, expira]
    );

    // En producción se enviaría por correo. Aquí devolvemos el enlace para pruebas.
    const enlace = `reset_password.html?token=${token}`;
    res.json({
      message: 'Token generado. Usa el enlace para cambiar la contraseña (válido 30 min).',
      enlace
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al generar token de reseteo' });
  }
};

// Paso 2: resetear contraseña usando token
exports.resetPassword = async (req, res) => {
  const { token, nuevaPassword } = req.body;
  try {
    const now = new Date();
    const tokenRes = await pool.query(
      'SELECT * FROM reset_tokens WHERE token = $1 AND usado = false',
      [token]
    );
    const row = tokenRes.rows[0];
    if (!row) return res.status(400).json({ error: 'Token inválido o ya usado' });

    if (new Date(row.expira_en) < now) return res.status(400).json({ error: 'Token expirado' });

    // Hashear la nueva contraseña y actualizar
    const hashed = await bcrypt.hash(nuevaPassword, 10);
    await pool.query('UPDATE usuarios SET password = $1 WHERE id = $2', [hashed, row.usuario_id]);

    // Marcar token como usado
    await pool.query('UPDATE reset_tokens SET usado = true WHERE id = $1', [row.id]);

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al resetear contraseña' });
  }
};
