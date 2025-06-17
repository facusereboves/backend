document.addEventListener('DOMContentLoaded', () => {
const form = document.getElementById('login-form');
const message = document.getElementById('message');

  if (!form) return; // Evita errores en páginas sin el formulario

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
        message.textContent = 'Por favor, completá todos los campos.';
        return;
    }

    try {
    const response = await fetch('/api/sessions/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
        message.textContent = 'Login exitoso. Cargando...';

        localStorage.setItem('token', data.token);

        setTimeout(() => {
            window.location.href = `${window.location.origin}/public/productos.html`;
        }, 1000);
    } else {
        message.textContent = data.error || 'Error en el login';
    }
    } catch (error) {
    message.textContent = 'Error de conexión con el servidor';
    }
});
});
