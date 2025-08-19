// middlewares/auth.js
const jwt = require('jsonwebtoken');

// Middleware: verifica que exista token válido
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Encabezado Authorization mal formado' });
  }

  const token = parts[1];

  // Verifica token JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      // Si el token expiró o es inválido, enviamos mensaje claro
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ error: 'Token expirado. Inicia sesión de nuevo.' });
      }
      return res.status(403).json({ error: 'Token inválido' });
    }

    // Guardamos info del usuario en req.user
    req.user = { id: payload.id, email: payload.email, rol: payload.rol };
    next();
  });
}

// Middleware: solo admin (rol 3)
function esAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'No autenticado' });
  if (String(req.user.rol) !== '3') {
    return res.status(403).json({ error: 'Acceso denegado. Requiere rol de admin.' });
  }
  next();
}

// Middleware: admin o tutor (rol 3 o 2)
function esAdminOTutor(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'No autenticado' });
  const rol = String(req.user.rol);
  if (rol !== '3' && rol !== '2') {
    return res.status(403).json({ error: 'Acceso denegado. Requiere rol de admin o tutor.' });
  }
  next();
}

module.exports = { verificarToken, esAdmin, esAdminOTutor };
