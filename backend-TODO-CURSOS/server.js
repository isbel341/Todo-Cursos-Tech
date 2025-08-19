// esto es lo que tengo en server.js
// backend-TODO-CURSOS/server.js
const express = require('express');
const pool = require('./db');
const path = require('path'); // ✅ SOLO AQUÍ
const cors = require('cors');
require('dotenv').config();

// Rutas
const authRoutes = require('./routes/auth');
const cursosRoutes = require('./routes/cursos');
const checkoutRoutes = require('./routes/checkout');
const usuariosRoutes = require('./routes/usuarios');
const categoriasRoutes = require('./routes/categorias');
const certificadosRoutes = require('./routes/certificados');
const inscripcionesRoutes = require('./routes/inscripciones');
const chatRoutes = require('./routes/chat');
const comentariosRoutes = require('./routes/comentarios');
const cuponesRoutes = require('./routes/cupones');
// Rutas de evaluaciones y encuestas
const evaluacionesRoutes = require('./routes/evaluaciones');
const favoritosRoutes = require('./routes/favoritos');
const leccionesRoutes = require('./routes/lecciones');
const pagosRoutes = require('./routes/pagos');
const perfilRoutes = require('./routes/perfil'); // Asegúrate de importar las rutas del perfil
const progresoRoutes = require('./routes/progreso'); // Importar rutas de progreso
const suscripcionRoutes = require('./routes/suscripcion'); // ruta correcta a tu archivo
const curso_detalleRoutes = require('./routes/cursoDetalle'); // Importar rutas de cursoDetalle
const cursosCompletadosRoutes = require('./routes/cursosCompletados');
// Configuración de la aplicación


const app = express();
app.use(cors());
app.use(express.json());


// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.get("/api/progreso/curso/:cursoId/usuario/:usuarioId", (req, res) => {
  
    // devolver JSON con progreso
});

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/certificados', certificadosRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/cupones', cuponesRoutes);
// Rutas de evaluaciones y encuestas
app.use('/api/evaluaciones', evaluacionesRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/lecciones', leccionesRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/perfil', perfilRoutes); // Asegúrate de usar las rutas del perfil
app.use('/api/progreso', progresoRoutes); // Usar rutas de progreso
app.use('/api/suscripcion', suscripcionRoutes);
app.use('/api/curso_detalle', curso_detalleRoutes);
app.use('/cursos_img', express.static('cursos_img'));
app.use('/api/cursos-completados', cursosCompletadosRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


