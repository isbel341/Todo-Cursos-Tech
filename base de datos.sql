

-- codigo de la base de datos 
--tabla categorias
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);
-- tabla certifiados 
CREATE TABLE certificados (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  curso_id INTEGER NOT NULL,
  fecha_emision TIMESTAMP NOT NULL,
  codigo_certificado VARCHAR(50) NOT NULL
);
-- tabla evaluaciones
CREATE TABLE evaluaciones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER NOT NULL,
  curso_id INTEGER NOT NULL,
  texto TEXT,
  calificacion INTEGER,
  fecha TIMESTAMP WITHOUT TIME ZONE
);
--tabla de descuento 
CREATE TABLE cupones (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL,
  descuento_porcentaje INTEGER NOT NULL,
  fecha_expiracion DATE NOT NULL
);

-- tabla de recursos
CREATE TABLE curso_detalle (
  id SERIAL PRIMARY KEY,
  curso_id INTEGER NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  url TEXT,
  orden INTEGER,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- tabla de cursos 
CREATE TABLE cursos (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT,
  categoria_id INTEGER REFERENCES categorias(id),
  nivel VARCHAR(50),
  video_url TEXT
  creado_por INTEGER, -- probablemente referencia al usuario que creó el curso
fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP

);

-- tabla de cursos completados 
CREATE TABLE cursos_completados (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  curso_id INTEGER REFERENCES cursos(id),
  fecha_completado TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--tabla de evaluaciones 
CREATE TABLE evaluaciones (
  id SERIAL PRIMARY KEY,
  curso_id INTEGER REFERENCES cursos(id),
  pregunta TEXT NOT NULL,
  opcion1 TEXT NOT NULL,
  opcion2 TEXT NOT NULL,
  opcion3 TEXT NOT NULL,
  opcion_correcta TEXT NOT NULL,
  puntaje INTEGER DEFAULT 1
);

--tabla de evaluaciones_preguntas
CREATE TABLE evaluaciones_preguntas (
  id SERIAL PRIMARY KEY,
  curso_id INTEGER REFERENCES cursos(id),
  pregunta TEXT NOT NULL,
  opcion1 TEXT NOT NULL,
  opcion2 TEXT NOT NULL,
  opcion3 TEXT NOT NULL,
  opcion_correcta TEXT NOT NULL,
  puntaje INTEGER DEFAULT 1
);

--tabla de evaluaciones_resultados
CREATE TABLE evaluaciones_resultados (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  curso_id INTEGER REFERENCES cursos(id),
  puntaje NUMERIC(5,2),
  fecha TIMESTAMP
);

--tabla de favoritos
CREATE TABLE favoritos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  curso_id INTEGER REFERENCES cursos(id),
  fecha_guardado TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--tabla de lecciones
CREATE TABLE lecciones (
  id SERIAL PRIMARY KEY,
  curso_id INTEGER REFERENCES cursos(id),
  titulo VARCHAR(200) NOT NULL,
  contenido TEXT,
  video_url TEXT
);

--tabla de log_actividad
CREATE TABLE log_actividad (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  accion TEXT NOT NULL,
  detalle TEXT,
  fecha TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--tabla de mensajes_chat
CREATE TABLE mensajes_chat (
  id SERIAL PRIMARY KEY,
  emisor_id INTEGER REFERENCES usuarios(id),
  receptor_id INTEGER REFERENCES usuarios(id),
  mensaje TEXT NOT NULL,
  fecha_envio TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  leido BOOLEAN DEFAULT FALSE
);

--tabla de mensajes_soporte 
CREATE TABLE mensajes_soporte (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  asunto VARCHAR(100),
  mensaje TEXT,
  respondido BOOLEAN DEFAULT FALSE,
  fecha TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--tabla de 
CREATE TABLE pagos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  curso_id INTEGER REFERENCES cursos(id),
  monto NUMERIC(10,2) NOT NULL,
  metodo_pago VARCHAR(50),
  estado VARCHAR(20),
  fecha_pago TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  suscripciones_id INTEGER REFERENCES suscripciones(id)
);

--tabla de 
CREATE TABLE progreso (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  leccion_id INTEGER REFERENCES lecciones(id),
  curso_id INTEGER REFERENCES cursos(id),
  completado BOOLEAN DEFAULT FALSE,
  porcentaje INTEGER DEFAULT 0,
  fecha TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--tabla de 
CREATE TABLE reset_tokens (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  token TEXT NOT NULL,
  creado_en TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expira_en TIMESTAMP WITHOUT TIME ZONE,
  usado BOOLEAN DEFAULT FALSE
);

--tabla de 
CREATE TABLE respuestas_evaluacion (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  evaluacion_id INTEGER REFERENCES evaluaciones(id),
  respuesta TEXT NOT NULL,
  correcta BOOLEAN,
  fecha TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

--tabla de 
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL
);

--tabla de 
CREATE TABLE sesiones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  ip_direccion VARCHAR(100),
  dispositivo VARCHAR(100),
  navegador VARCHAR(100),
  exito BOOLEAN,
  fecha_inicio TIMESTAMP WITHOUT TIME ZONE,
  fecha_cierre TIMESTAMP WITHOUT TIME ZONE
);

--tabla de 
CREATE TABLE suscripciones (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  fecha_inicio TIMESTAMP WITHOUT TIME ZONE,
  fecha_fin TIMESTAMP WITHOUT TIME ZONE,
  estado VARCHAR(20),
  plan VARCHAR(50)
);

--tabla de 
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100),
  password TEXT,
  rol VARCHAR(20),
  fecha_registro TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  rol_id INTEGER REFERENCES roles(id)
);




