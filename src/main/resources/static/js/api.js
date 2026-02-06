/**
 * API - Gestión de peticiones HTTP al backend
 */

const API_BASE_URL = 'http://localhost:8080/api';

const api = {
    // Método GET
    async get(endpoint, requiresAuth = true) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };

            if (requiresAuth) {
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: headers
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.clear();
                    window.location.href = '/login.html';
                }
                throw new Error(data.error || data.message || 'Error en la petición');
            }

            return data.data || data;
        } catch (error) {
            console.error('Error en GET:', error);
            throw error;
        }
    },

    // Método POST
    async post(endpoint, body, requiresAuth = true) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };

            if (requiresAuth) {
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.clear();
                    window.location.href = '/login.html';
                }
                throw new Error(data.error || data.message || 'Error en la petición');
            }

            return data.data || data;
        } catch (error) {
            console.error('Error en POST:', error);
            throw error;
        }
    },

    // Método PUT
    async put(endpoint, body, requiresAuth = true) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };

            if (requiresAuth) {
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.clear();
                    window.location.href = '/login.html';
                }
                throw new Error(data.error || data.message || 'Error en la petición');
            }

            return data.data || data;
        } catch (error) {
            console.error('Error en PUT:', error);
            throw error;
        }
    },

    // Método PATCH
    async patch(endpoint, body = null, requiresAuth = true) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };

            if (requiresAuth) {
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            const options = {
                method: 'PATCH',
                headers: headers
            };

            if (body) {
                options.body = JSON.stringify(body);
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.clear();
                    window.location.href = '/login.html';
                }
                throw new Error(data.error || data.message || 'Error en la petición');
            }

            return data.data || data;
        } catch (error) {
            console.error('Error en PATCH:', error);
            throw error;
        }
    },

    // Método DELETE
    async delete(endpoint, requiresAuth = true) {
        try {
            const headers = {
                'Content-Type': 'application/json'
            };

            if (requiresAuth) {
                const token = localStorage.getItem('token');
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: headers
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.clear();
                    window.location.href = '/login.html';
                }
                throw new Error(data.error || data.message || 'Error en la petición');
            }

            return data.data || data;
        } catch (error) {
            console.error('Error en DELETE:', error);
            throw error;
        }
    }
};

// Utilidades
function mostrarAlerta(mensaje, tipo = 'info') {
    const container = document.getElementById('alertContainer');
    if (!container) return;

    const alertClass = {
        'success': 'alert-success',
        'danger': 'alert-danger',
        'warning': 'alert-warning',
        'info': 'alert-info'
    }[tipo] || 'alert-info';

    container.innerHTML = `
        <div class="alert ${alertClass}">
            <span>${mensaje}</span>
        </div>
    `;

    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

function formatearMoneda(monto) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(monto);
}

function formatearFecha(fecha) {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatearFechaHora(fecha) {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function obtenerBadgeEstado(estado, tipo = 'RESERVA') {
    const configs = {
        'RESERVA': {
            'PENDIENTE_PAGO': { class: 'badge-warning', label: 'Pendiente Pago' },
            'PAGADA': { class: 'badge-info', label: 'Pagada' },
            'CONFIRMADA': { class: 'badge-success', label: 'Confirmada' },
            'EN_PREPARACION': { class: 'badge-info', label: 'En Preparación' },
            'ENVIADA': { class: 'badge-info', label: 'Enviada' },
            'ENTREGADA': { class: 'badge-success', label: 'Entregada' },
            'EN_USO': { class: 'badge-success', label: 'En Uso' },
            'DEVUELTA': { class: 'badge-info', label: 'Devuelta' },
            'COMPLETADA': { class: 'badge-success', label: 'Completada' },
            'CANCELADA_CLIENTE': { class: 'badge-secondary', label: 'Cancelada' },
            'CANCELADA_PROVEEDOR': { class: 'badge-secondary', label: 'Cancelada' },
            'CANCELADA_SISTEMA': { class: 'badge-secondary', label: 'Cancelada' },
            'MORA': { class: 'badge-danger', label: 'Mora' },
            'PERDIDA': { class: 'badge-danger', label: 'Perdida' },
            'ROBADA': { class: 'badge-danger', label: 'Robada' }
        },
        'PAGO': {
            'PENDIENTE': { class: 'badge-warning', label: 'Pendiente' },
            'PROCESANDO': { class: 'badge-info', label: 'Procesando' },
            'EXITOSO': { class: 'badge-success', label: 'Exitoso' },
            'FALLIDO': { class: 'badge-danger', label: 'Fallido' },
            'REEMBOLSADO': { class: 'badge-secondary', label: 'Reembolsado' },
            'CANCELADO': { class: 'badge-secondary', label: 'Cancelado' }
        }
    };

    const config = configs[tipo]?.[estado] || { class: 'badge-secondary', label: estado };
    return `<span class="badge ${config.class}">${config.label}</span>`;
}

function deshabilitarBoton(btnId, deshabilitar = true) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    if (deshabilitar) {
        btn.disabled = true;
        btn.dataset.originalText = btn.innerHTML;
        btn.innerHTML = '<div class="spinner" style="width: 20px; height: 20px; border-width: 2px;"></div> Cargando...';
    } else {
        btn.disabled = false;
        btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
    }
}

function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

function cerrarSesion() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        localStorage.clear();
        window.location.href = '/login.html';
    }
}