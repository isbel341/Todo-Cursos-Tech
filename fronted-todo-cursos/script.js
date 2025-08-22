const API_URL = 'https://todo-cursos-tech-backend-1.onrender.com';

// script.js
// Alternar visibilidad del menú hamburguesa
function toggleMenu() {
  const nav = document.getElementById("navLinks");
  nav.classList.toggle("show-menu");
}

// Simulación de estado de sesión (en producción esto vendrá del backend)
let estaLogueado = false; // ✅ CAMBIA esto a `true` tras iniciar sesión

// Páginas que requieren inicio de sesión
const requiereLogin = ['bienvenida.html', 'cursos.html', 'logout.html', 'ajustes.html', 'soporte.html'];

// Verificación antes de navegar
function checkLogin(event, url) {
  if (!estaLogueado && requiereLogin.includes(url)) {
    event.preventDefault();
    alert('Debes iniciar sesión para acceder a esta sección.');
    window.location.href = 'login.html';
  }
}

// Ocultar menú al seleccionar una opción en móvil
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const nav = document.getElementById("navLinks");
    if (nav.classList.contains('show-menu')) {
      nav.classList.remove('show-menu');
    }
  });
});

// Mostrar/ocultar elementos según estado de sesión
window.addEventListener('DOMContentLoaded', () => {
  const cerrarSesion = document.getElementById("cerrarSesion");
  const loginLink = document.getElementById("loginLink");

  if (estaLogueado) {
    cerrarSesion.style.display = "block";
    loginLink.style.display = "none";
  } else {
    cerrarSesion.style.display = "none";
    loginLink.style.display = "block";
  }
});
// Ejemplo de llamada a la API para agregar un curso al carrito
// Asegúrate de reemplazar el ID del curso con el real que deseas agregar
await fetch(`${API_URL}/api/carrito`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  },
  body: JSON.stringify({ cursos_id: 5 }) // reemplaza 5 por el ID real del curso
});

// Manejo de eventos para enlaces de navegación
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', (event) => {
    const url = link.getAttribute('href');
    checkLogin(event, url);
  });
});
// Manejo del evento de clic en el botón de menú hamburguesa
document.getElementById("menuToggle").addEventListener("click", toggleMenu);
// Manejo del evento de clic en el botón de cerrar sesión
document.getElementById("cerrarSesion").addEventListener("click", () => {         
  estaLogueado = false; // Simula el cierre de sesión
  alert('Has cerrado sesión correctamente.');
  window.location.href = 'index.html'; // Redirige a la página principal
});
// Manejo del evento de clic en el enlace de inicio de sesión 
document.getElementById("loginLink").addEventListener("click", () => {
  window.location.href = 'login.html'; // Redirige a la página de inicio de sesión
});
// Manejo del evento de clic en el enlace de registro
document.getElementById("registerLink").addEventListener("click", () => {
  window.location.href = 'register.html'; // Redirige a la página de registro
});
// Manejo del evento de clic en el enlace de soporte  
document.getElementById("supportLink").addEventListener("click", () => {
  window.location.href = 'soporte.html'; // Redirige a la página de soporte
});
// Manejo del evento de clic en el enlace de ajustes
document.getElementById("settingsLink").addEventListener("click", () => {
  window.location.href = 'ajustes.html'; // Redirige a la página de ajustes
});
// Manejo del evento de clic en el enlace de cursos
document.getElementById("coursesLink").addEventListener("click", () => {
  window.location.href = 'cursos.html'; // Redirige a la página de cursos
});
// Manejo del evento de clic en el enlace de bienvenida
document.getElementById("welcomeLink").addEventListener("click", () => {
  window.location.href = 'bienvenida.html'; // Redirige a la página de bienvenida
});
// Manejo del evento de clic en el enlace de logout
document.getElementById("logoutLink").addEventListener("click", () => {
  window.location.href = 'logout.html'; // Redirige a la página de cierre de sesión
});
// Manejo del evento de clic en el enlace de carrito  
document.getElementById("cartLink").addEventListener("click", () => {
  window.location.href = 'carrito.html'; // Redirige a la página del carrito
});
// Manejo del evento de clic en el enlace de perfil
document.getElementById("profileLink").addEventListener("click", () => {
  window.location.href = 'perfil.html'; // Redirige a la página del perfil
});
// Manejo del evento de clic en el enlace de ayuda    
document.getElementById("helpLink").addEventListener("click", () => {
  window.location.href = 'ayuda.html'; // Redirige a la página de ayuda
});
// Manejo del evento de clic en el enlace de contacto
document.getElementById("contactLink").addEventListener("click", () => {
  window.location.href = 'contacto.html'; // Redirige a la página de contacto
});
// Manejo del evento de clic en el enlace de términos y condiciones
document.getElementById("termsLink").addEventListener("click", () => {
  window.location.href = 'terminos.html'; // Redirige a la página de términos y condiciones
});
// Manejo del evento de clic en el enlace de política de privacidad
document.getElementById("privacyLink").addEventListener("click", () => {
  window.location.href = 'privacidad.html'; // Redirige a la página de política de privacidad
});
// Manejo del evento de clic en el enlace de mapa del sitio 
document.getElementById("sitemapLink").addEventListener("click", () => {
  window.location.href = 'mapa.html'; // Redirige a la página del mapa del sitio
});
// Manejo del evento de clic en el enlace de blog
document.getElementById("blogLink").addEventListener("click", () => {
  window.location.href = 'blog.html'; // Redirige a la página del blog
});
// Manejo del evento de clic en el enlace de noticias
document.getElementById("newsLink").addEventListener("click", () => {
  window.location.href = 'noticias.html'; // Redirige a la página de noticias
});
// Manejo del evento de clic en el enlace de eventos
document.getElementById("eventsLink").addEventListener("click", () => {
  window.location.href = 'eventos.html'; // Redirige a la página de eventos
});
// Manejo del evento de clic en el enlace de testimonios
document.getElementById("testimonialsLink").addEventListener("click", () => {
  window.location.href = 'testimonios.html'; // Redirige a la página de testimonios
});
// Manejo del evento de clic en el enlace de galería
document.getElementById("galleryLink").addEventListener("click", () => {
  window.location.href = 'galeria.html'; // Redirige a la página de galería
});
// Manejo del evento de clic en el enlace de preguntas frecuentes
document.getElementById("faqLink").addEventListener("click", () => {
  window.location.href = 'faq.html'; // Redirige a la página de preguntas frecuentes
});
// Manejo del evento de clic en el enlace de política de cookies
document.getElementById("cookiesLink").addEventListener("click", () => {
  window.location.href = 'cookies.html'; // Redirige a la página de política de cookies
});
// Manejo del evento de clic en el enlace de accesibilidad
document.getElementById("accessibilityLink").addEventListener("click", () => {
  window.location.href = 'accesibilidad.html'; // Redirige a la página de accesibilidad
});
// Manejo del evento de clic en el enlace de mapa del sitio
document.getElementById("sitemapLink").addEventListener("click", () => {
  window.location.href = 'mapa.html'; // Redirige a la página del mapa del sitio
});
// Manejo del evento de clic en el enlace de política de seguridad
document.getElementById("securityLink").addEventListener("click", () => { 
  window.location.href = 'seguridad.html'; // Redirige a la página de política de seguridad
});
// Manejo del evento de clic en el enlace de política de devoluciones
document.getElementById("returnsLink").addEventListener("click", () => {
  window.location.href = 'devoluciones.html'; // Redirige a la página de política de devoluciones
});
// Manejo del evento de clic en el enlace de política de envíos
document.getElementById("shippingLink").addEventListener("click", () => {
  window.location.href = 'envios.html'; // Redirige a la página de política de envíos
});
// Manejo del evento de clic en el enlace de política de reembolsos
document.getElementById("refundsLink").addEventListener("click", () => {
  window.location.href = 'reembolsos.html'; // Redirige a la página de política de reembolsos
});
// Manejo del evento de clic en el enlace de política de garantía
document.getElementById("warrantyLink").addEventListener("click", () => {
  window.location.href = 'garantia.html'; // Redirige a la página de política de garantía
});
// Manejo del evento de clic en el enlace de política de privacidad infantil  
document.getElementById("childrenPrivacyLink").addEventListener("click", () => {
  window.location.href = 'privacidad-infantil.html'; // Redirige a la página de política de privacidad infantil
}); 
// Manejo del evento de clic en el enlace de política de seguridad infantil
document.getElementById("childrenSecurityLink").addEventListener("click", () => { 
  window.location.href = 'seguridad-infantil.html'; // Redirige a la página de política de seguridad infantil
});
// Manejo del evento de clic en el enlace de política de cookies infantil
document.getElementById("childrenCookiesLink").addEventListener("click", () => {
  window.location.href = 'cookies-infantil.html'; // Redirige a la página de política de cookies infantil
});
// Manejo del evento de clic en el enlace de política de accesibilidad infantil
document.getElementById("childrenAccessibilityLink").addEventListener("click", () => {
  window.location.href = 'accesibilidad-infantil.html'; // Redirige a la página de política de accesibilidad infantil
});
// Manejo del evento de clic en el enlace de política de seguridad infantil
document.getElementById("childrenSecurityLink").addEventListener("click", () => {
  window.location.href = 'seguridad-infantil.html'; // Redirige a la página de política de seguridad infantil
});
// Manejo del evento de clic en el enlace de política de privacidad infantil
document.getElementById("childrenPrivacyLink").addEventListener("click", () => {
  window.location.href = 'privacidad-infantil.html'; // Redirige a la página de política de privacidad infantil
});
// Manejo del evento de clic en el enlace de política de cookies infantil
document.getElementById("childrenCookiesLink").addEventListener("click", () => {
  window.location.href = 'cookies-infantil.html'; // Redirige a la página de política de cookies infantil
});
// Manejo del evento de clic en el enlace de política de accesibilidad infantil
document.getElementById("childrenAccessibilityLink").addEventListener("click", () => {
  window.location.href = 'accesibilidad-infantil.html'; // Redirige a la página de política de accesibilidad infantil
});
// Manejo del evento de clic en el enlace de política de seguridad infantil
document.getElementById("childrenSecurityLink").addEventListener("click", () => {
  window.location.href = 'seguridad-infantil.html'; // Redirige a la página de política de seguridad infantil
});
// Manejo del evento de clic en el enlace de política de privacidad infantil
document.getElementById("childrenPrivacyLink").addEventListener("click", () => {  
  window.location.href = 'privacidad-infantil.html'; // Redirige a la página de política de privacidad infantil
});

const usuario_id = 1; // Aquí pones el ID del usuario logueado

// Ver estado actual
async function verSuscripcion() {
    const res = await fetch(`/api/suscripcion/${usuario_id}`);
    const data = await res.json();
    const estadoDiv = document.getElementById("estadoSuscripcion");

    if (data.success) {
        estadoDiv.innerHTML = `
            Estado: ${data.suscripcion.estado} <br>
            Inicio: ${new Date(data.suscripcion.fecha_inicio).toLocaleDateString()} <br>
            Fin: ${new Date(data.suscripcion.fecha_fin).toLocaleDateString()}
        `;
    } else {
        estadoDiv.innerText = "No tienes suscripción activa.";
    }
}

// Iniciar suscripción
document.getElementById("btnIniciar").addEventListener("click", async () => {
    const res = await fetch("/api/suscripcion/iniciar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id, meses: 1 })
    });
    const data = await res.json();
    alert(data.message || "Suscripción iniciada");
    verSuscripcion();
});

// Cancelar suscripción
document.getElementById("btnCancelar").addEventListener("click", async () => {
    const res = await fetch("/api/suscripcion/cancelar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id })
    });
    const data = await res.json();
    alert(data.message || "Suscripción cancelada");
    verSuscripcion();
});

// Cargar al inicio
verSuscripcion();
