/**
 * AUTH - Login y Registro
 */

// Verificar si ya está autenticado
if (localStorage.getItem('token')) {
    const userRole = localStorage.getItem('userRole');
    redirigirSegunRol(userRole);
}

function redirigirSegunRol(role) {
    switch(role) {
        case 'ADMIN':
            window.location.href = '/admin.html';
            break;
        case 'PROVEEDOR':
            window.location.href = '/proveedor.html';
            break;
        case 'CLIENTE':
            window.location.href = '/cliente.html';
            break;
        default:
            window.location.href = '/index.html';
    }
}

// LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            mostrarAlerta('Por favor completa todos los campos', 'warning');
            return;
        }

        deshabilitarBoton('loginBtn', true);

        try {
            const response = await api.post('/auth/login', { email, password }, false);

            // Guardar datos en localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.usuario.id);
            localStorage.setItem('userRole', response.usuario.tipo);
            localStorage.setItem('userName', `${response.usuario.nombre} ${response.usuario.apellido}`);

            mostrarAlerta('¡Bienvenido! Redirigiendo...', 'success');

            setTimeout(() => {
                redirigirSegunRol(response.usuario.tipo);
            }, 1000);

        } catch (error) {
            console.error('Error en login:', error);
            mostrarAlerta(error.message || 'Credenciales incorrectas', 'danger');
            deshabilitarBoton('loginBtn', false);
        }
    });
}

// REGISTRO
const registroForm = document.getElementById('registroForm');
if (registroForm) {
    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            tipo: document.getElementById('tipo').value,
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            direccion: document.getElementById('direccion').value.trim() || null,
            ciudad: document.getElementById('ciudad').value.trim() || null,
            departamento: document.getElementById('departamento').value.trim() || null,
            documentoTipo: document.getElementById('documentoTipo').value,
            documentoNumero: document.getElementById('documentoNumero').value.trim()
        };

        // Validaciones
        if (!formData.email || !formData.password || !formData.tipo || 
            !formData.nombre || !formData.apellido || !formData.telefono ||
            !formData.documentoTipo || !formData.documentoNumero) {
            mostrarAlerta('Por favor completa todos los campos obligatorios', 'warning');
            return;
        }

        if (formData.password.length < 6) {
            mostrarAlerta('La contraseña debe tener al menos 6 caracteres', 'warning');
            return;
        }

        deshabilitarBoton('registroBtn', true);

        try {
            const response = await api.post('/auth/registro', formData, false);

            // Guardar datos en localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.usuario.id);
            localStorage.setItem('userRole', response.usuario.tipo);
            localStorage.setItem('userName', `${response.usuario.nombre} ${response.usuario.apellido}`);

            mostrarAlerta('¡Registro exitoso! Redirigiendo...', 'success');

            setTimeout(() => {
                redirigirSegunRol(response.usuario.tipo);
            }, 1500);

        } catch (error) {
            console.error('Error en registro:', error);
            mostrarAlerta(error.message || 'Error al registrarse', 'danger');
            deshabilitarBoton('registroBtn', false);
        }
    });
}