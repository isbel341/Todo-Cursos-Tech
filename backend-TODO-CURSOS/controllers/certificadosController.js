// controllers/certificadosController.js
// Este controlador maneja la generación y descarga de certificados
const pool = require('../db');
const PDFDocument = require('pdfkit');
const crypto = require('crypto');
const path = require('path');

// Obtener certificados de un usuario
async function obtenerCertificados(req, res) {
  if (!req.user?.id) return res.status(401).json({ error: 'Usuario no autenticado' });

  try {
    const result = await pool.query(`
      SELECT ce.id, ce.fecha_emision, ce.codigo_certificado,
             c.id AS curso_id, c.titulo AS curso,
             u.nombre AS estudiante
      FROM certificados ce
      LEFT JOIN cursos c ON ce.curso_id = c.id
      LEFT JOIN usuarios u ON ce.usuario_id = u.id
      WHERE ce.usuario_id = $1
      ORDER BY ce.fecha_emision DESC
    `, [req.user.id]);

    res.json(Array.isArray(result.rows) ? result.rows : []);
  } catch (error) {
    console.error('Error al obtener certificados:', error);
    res.status(500).json({ error: 'Error al obtener certificados', detalle: error.message });
  }
}

// Descargar certificado en PDF
async function descargarCertificadoPDF(req, res) {
  if (!req.user?.id) return res.status(401).json({ error: 'Usuario no autenticado' });

  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT ce.fecha_emision, ce.codigo_certificado,
             c.titulo AS curso, u.nombre AS estudiante
      FROM certificados ce
      LEFT JOIN cursos c ON ce.curso_id = c.id
      LEFT JOIN usuarios u ON ce.usuario_id = u.id
      WHERE ce.id = $1 AND ce.usuario_id = $2
    `, [id, req.user.id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Certificado no encontrado' });

    const cert = result.rows[0];
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="certificado_${cert.codigo_certificado}.pdf"`);
    doc.pipe(res);

    doc.rect(0, 0, doc.page.width, 150).fill('#00796b');
    const logoPath = path.join(__dirname, '../public/logo1.png');
    try { doc.image(logoPath, 50, 40, { width: 80 }); } catch {}
    doc.fillColor('#ffffff').fontSize(40).text('Certificado', 0, 60, { align: 'center' });

    const medallaPath = path.join(__dirname, '../public/medalla.png');
    try { doc.image(medallaPath, doc.page.width / 2 - 25, 160, { width: 50 }); } catch {}

    doc.moveDown(5);
    doc.fillColor('#000000').fontSize(14).text('Certifico que el alumno', { align: 'center' });
    doc.font('Helvetica-Bold').fontSize(20).text(cert.estudiante || 'Estudiante', { align: 'center' });
    doc.moveDown(0.5);
    doc.font('Helvetica').fontSize(14).text('concluyó con éxito el curso de', { align: 'center' });
    doc.font('Helvetica-Bold').fontSize(22).text(cert.curso || 'Curso no especificado', { align: 'center', underline: true });
    doc.moveDown(1);
    doc.fontSize(10).fillColor('#555').text(`Código de verificación: ${cert.codigo_certificado}`, { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Error al generar PDF:', error.stack);
    res.status(500).json({ error: 'Error al generar PDF', detalle: error.message });
  }
}

// Generar certificado vía API
async function generarCertificado(req, res) {
  const usuarioId = req.user?.id;
  if (!usuarioId) return res.status(401).json({ error: 'Usuario no autenticado' });

  const curso_id = req.body.curso_id;
  if (!curso_id) return res.status(400).json({ error: 'El ID del curso es obligatorio' });

  try {
    const existente = await pool.query(
      'SELECT id FROM certificados WHERE usuario_id = $1 AND curso_id = $2',
      [usuarioId, curso_id]
    );

    if (existente.rows.length > 0)
      return res.status(400).json({ error: 'Ya tienes un certificado de este curso.' });

    const codigo = crypto.randomBytes(4).toString('hex').toUpperCase();
    const result = await pool.query(
      `INSERT INTO certificados (usuario_id, curso_id, fecha_emision, codigo_certificado)
       VALUES ($1, $2, NOW(), $3) RETURNING *`,
      [usuarioId, curso_id, codigo]
    );

    res.status(201).json({ mensaje: 'Certificado generado', certificado: result.rows[0] });
  } catch (err) {
    console.error('Error al generar certificado:', err.stack);
    res.status(500).json({ error: 'Error al generar certificado', detalle: err.message });
  }
}

// Función interna para usar desde cursosCompletadosController
async function generarCertificadoInterno(usuarioId, cursoId) {
  const existente = await pool.query(
    'SELECT id FROM certificados WHERE usuario_id = $1 AND curso_id = $2',
    [usuarioId, cursoId]
  );

  if (existente.rows.length > 0) return null; // ya existe

  const codigo = crypto.randomBytes(4).toString('hex').toUpperCase();
  const result = await pool.query(
    `INSERT INTO certificados (usuario_id, curso_id, fecha_emision, codigo_certificado)
     VALUES ($1, $2, NOW(), $3) RETURNING *`,
    [usuarioId, cursoId, codigo]
  );

  return result.rows[0];
}

module.exports = { 
  obtenerCertificados, 
  descargarCertificadoPDF, 
  generarCertificado, 
  generarCertificadoInterno  // exportamos para uso interno
};
