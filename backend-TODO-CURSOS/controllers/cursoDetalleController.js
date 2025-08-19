// Controlador para manejar las operaciones de curso_detalle
const express = require('express');
const pool = require('../db'); // conexión a PostgreSQL con pg Pool

exports.getVideosPorCurso = async (req, res) => {
  const curso_id = req.query.curso_id;
  if (!curso_id) {
    return res.status(400).json({ error: 'Falta curso_id' });
  }
  try {
    const resultado = await pool.query(
      'SELECT id, titulo, descripcion, url, orden FROM curso_detalle WHERE curso_id = $1 ORDER BY orden ASC',
      [curso_id]
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener videos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
exports.agregarVideo = async (req, res) => {
  const { curso_id, titulo, descripcion, url, orden } = req.body;
  if (!curso_id || !titulo || !url) {
    return res.status(400).json({ error: 'curso_id, titulo y url son requeridos' });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO curso_detalle (curso_id, titulo, descripcion, url, orden)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [curso_id, titulo, descripcion || '', url, orden || 0]
    );
    res.status(201).json({ mensaje: 'Video agregado', video: resultado.rows[0] });
  } catch (error) {
    console.error('Error al agregar video:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
