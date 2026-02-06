/**
 * Autenticación - Login y Registro
 */

// Verificar si ya está autenticado
if (isAuthenticated()) {
    const userData = getUserData();
    if (userData && userData.tipo) {
        redirectToDashboard(userData.tipo);
    }
}

// Función para redirigir según rol
function redirectToDashboard(role) {
    switch(role) {
        case 'ADMIN':
            window.location.href = '/admin.html';
            break;
        case 'PROVEEDOR':
            window.location.href = '/dashboard.html?role=proveedor';
            break;
        case 'CLIENTE':
            window.location.href = '/dashboard.html?role=cliente';
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
        
        // Validaciones
        if (!email || !password) {
            showAlert('Por favor completa todos los campos', 'warning');
            return;
        }
        
        if (!isValidEmail(email)) {
            showAlert('El email no es válido', 'warning');
            return;
        }
        
        setButtonLoading('loginBtn', true);
        
        try {
            const response = await fetchAPI(API_ENDPOINTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            if (response.success && response.data) {
                // Guardar token y datos del usuario
                localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.usuario));
                localStorage.setItem(STORAGE_KEYS.USER_ID, response.data.usuario.id);
                localStorage.setItem(STORAGE_KEYS.USER_ROLE, response.data.usuario.tipo);
                
                showAlert('¡Bienvenido! Redirigiendo...', 'success');
                
                setTimeout(() => {
                    redirectToDashboard(response.data.usuario.tipo);
                }, 1000);
            } else {
                showAlert(response.message || 'Error al iniciar sesión', 'danger');
                setButtonLoading('loginBtn', false);
            }
        } catch (error) {
            console.error('Error en login:', error);
            showAlert(error.message || 'Error al iniciar sesión. Verifica tus credenciales.', 'danger');
            setButtonLoading('loginBtn', false);
        }
    });
}

// REGISTRO
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Obtener datos del formulario
        const formData = {
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            tipo: document.getElementById('tipo').value,
            nombre: document.getElementById('nombre').value.trim(),
            apellido: document.getElementById('apellido').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            direccion: document.getElementById('direccion').value.trim(),
            ciudad: document.getElementById('ciudad').value.trim(),
            departamento: document.getElementById('departamento').value.trim(),
            documentoTipo: document.getElementById('documentoTipo').value,
            documentoNumero: document.getElementById('documentoNumero').value.trim()
        };
        
        // Validaciones
        if (!formData.email || !formData.password || !formData.tipo || 
            !formData.nombre || !formData.apellido || !formData.telefono ||
            !formData.documentoTipo || !formData.documentoNumero) {
            showAlert('Por favor completa todos los campos obligatorios', 'warning');
            return;
        }
        
        if (!isValidEmail(formData.email)) {
            showAlert('El email no es válido', 'warning');
            return;
        }
        
        if (formData.password.length < 6) {
            showAlert('La contraseña debe tener al menos 6 caracteres', 'warning');
            return;
        }
        
        setButtonLoading('registerBtn', true);
        
        try {
            const response = await fetchAPI(API_ENDPOINTS.REGISTRO, {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            
            if (response.success && response.data) {
                // Guardar token y datos del usuario
                localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.usuario));
                localStorage.setItem(STORAGE_KEYS.USER_ID, response.data.usuario.id);
                localStorage.setItem(STORAGE_KEYS.USER_ROLE, response.data.usuario.tipo);
                
                showAlert('¡Registro exitoso! Redirigiendo...', 'success');
                
                setTimeout(() => {
                    redirectToDashboard(response.data.usuario.tipo);
                }, 1500);
            } else {
                showAlert(response.message || 'Error al registrarse', 'danger');
                setButtonLoading('registerBtn', false);
            }
        } catch (error) {
            console.error('Error en registro:', error);
            showAlert(error.message || 'Error al registrarse. Intenta nuevamente.', 'danger');
            setButtonLoading('registerBtn', false);
        }
    });
}