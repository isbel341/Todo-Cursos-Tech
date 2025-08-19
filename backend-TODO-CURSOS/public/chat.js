//esto es lo que tengo en chat.js
// public/chat.js
const token = localStorage.getItem('token');
let receptor_id = null;

async function cargarUsuarios() {
  const res = await fetch('http://localhost:3001/api/usuarios', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const usuarios = await res.json();

  const select = document.getElementById('usuarios');
  usuarios.forEach(u => {
    const option = document.createElement('option');
    option.value = u.id;
    option.textContent = u.nombre;
    select.appendChild(option);
  });

  receptor_id = usuarios[0].id;
  cargarMensajes();
}

async function cargarMensajes() {
  if (!receptor_id) return;
  const res = await fetch(`http://localhost:3001/api/chat/mensajes?receptor_id=${receptor_id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const mensajes = await res.json();

  const chat = document.getElementById('chat');
  chat.innerHTML = '';
  mensajes.forEach(m => {
    const div = document.createElement('div');
    div.textContent = `${m.emisor_id == getUserId() ? 'Tú' : 'Otro'}: ${m.mensaje}`;
    chat.appendChild(div);
  });
}

function getUserId() {
  // Decodifica el token para extraer el ID
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.id;
}

document.getElementById('usuarios').addEventListener('change', (e) => {
  receptor_id = e.target.value;
  cargarMensajes();
});

document.getElementById('formMensaje').addEventListener('submit', async (e) => {
  e.preventDefault();
  const mensaje = document.getElementById('mensaje').value.trim();
  if (!mensaje) return;

  await fetch('http://localhost:3001/api/chat/enviar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ receptor_id, mensaje })
  });

  document.getElementById('mensaje').value = '';
  cargarMensajes();
});

document.addEventListener('DOMContentLoaded', () => {
  if (!token) return alert('Debes iniciar sesión');
  cargarUsuarios();
});
