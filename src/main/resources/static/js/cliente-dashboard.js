/**
 * CLIENTE DASHBOARD
 */

// Verificar autenticación y rol
const userRole = localStorage.getItem('userRole');
if (!localStorage.getItem('token') || userRole !== 'CLIENTE') {
    alert('Acceso denegado');
    window.location.href = '/login.html';
}

// Variables globales
let vistaActual = 'explorar';
let misReservas = [];
let todasHerramientas = [];

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarNombreUsuario();
    cambiarVista('explorar');
});

function cargarNombreUsuario() {
    const userName = localStorage.getItem('userName') || 'Cliente';
    document.getElementById('userName').textContent = userName;
    document.getElementById('userAvatar').textContent = userName.charAt(0).toUpperCase();
}

function cambiarVista(vista) {
    vistaActual = vista;

    // Actualizar sidebar activo
    document.querySelectorAll('.sidebar-link').forEach(link => {
        link.classList.remove('active');
    });
    event?.target?.closest('.sidebar-link')?.classList.add('active');

    // Cargar vista
    switch(vista) {
        case 'explorar':
            cargarExplorar();
            break;
        case 'misReservas':
            cargarMisReservas();
            break;
        case 'favoritos':
            cargarFavoritos();
            break;
        case 'perfil':
            cargarPerfil();
            break;
    }
}

// ==================== EXPLORAR ====================
async function cargarExplorar() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">🔍 Explorar Herramientas</h1>
            <p class="page-subtitle">Encuentra la herramienta perfecta para tu proyecto</p>
        </div>

        <div class="filters-container">
            <div class="filters-grid">
                <input type="text" class="form-control" id="searchExplorar" 
                       placeholder="🔍 Buscar herramientas..." onkeyup="if(event.key==='Enter') buscarExplorar()">
                <select class="form-select" id="filterPrecio">
                    <option value="">Cualquier precio</option>
                    <option value="0-20000">Hasta $20,000/día</option>
                    <option value="20000-50000">$20,000 - $50,000/día</option>
                    <option value="50000-100000">$50,000 - $100,000/día</option>
                    <option value="100000-999999">Más de $100,000/día</option>
                </select>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <input type="checkbox" id="filterEnvio">
                    <label for="filterEnvio" style="margin: 0; cursor: pointer;">Solo con envío incluido</label>
                </div>
            </div>
            <div class="filters-actions">
                <button class="btn btn-primary" onclick="buscarExplorar()">🔍 Buscar</button>
                <button class="btn btn-secondary" onclick="limpiarFiltrosExplorar()">✖️ Limpiar</button>
            </div>
        </div>

        <div class="herramientas-grid" id="explorarGrid">
            <div class="loading" style="grid-column: 1/-1;">
                <div class="spinner"></div>
                <p class="loading-text">Cargando herramientas...</p>
            </div>
        </div>
    `;

    try {
        todasHerramientas = await api.get('/herramientas', false);
        // Filtrar solo activas
        todasHerramientas = todasHerramientas.filter(h => h.estado === 'ACTIVO');
        renderizarGridExplorar(todasHerramientas);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('explorarGrid').innerHTML = `
            <div class="alert alert-danger" style="grid-column: 1/-1;">
                Error al cargar herramientas. Por favor intenta nuevamente.
            </div>
        `;
    }
}

function renderizarGridExplorar(herramientas) {
    const grid = document.getElementById('explorarGrid');
    
    if (herramientas.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-title">No hay herramientas disponibles</div>
                <div class="empty-state-text">Intenta cambiar los filtros de búsqueda</div>
            </div>
        `;
        return;
    }

    grid.innerHTML = herramientas.map(h => {
        const imagen = h.fotos && h.fotos.length > 0 ? h.fotos[0] : 'https://via.placeholder.com/300x200?text=Sin+Imagen';
        
        return `
            <div class="herramienta-card">
                <div style="position: relative;">
                    <img src="${imagen}" alt="${h.nombre}" class="herramienta-image" 
                         onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
                    ${h.envioIncluido ? '<span class="badge badge-success" style="position: absolute; top: 10px; left: 10px;">📦 Envío Incluido</span>' : ''}
                </div>
                <div class="herramienta-body">
                    <div class="herramienta-title">${h.nombre}</div>
                    <div class="herramienta-brand">${h.marca || ''} ${h.modelo || ''}</div>
                    <div class="herramienta-price">
                        ${formatearMoneda(h.precioBaseDia)}
                        <span class="herramienta-price-label">/día</span>
                    </div>
                    <div class="herramienta-rating">
                        <span>⭐</span>
                        <span>${h.calificacionPromedio || 0} (${h.totalCalificaciones || 0})</span>
                    </div>
                </div>
                <div class="herramienta-footer">
                    <button class="btn btn-outline btn-sm" onclick="verDetalleHerramienta('${h.id}')">
                        Ver Detalles
                    </button>
                    <button class="btn btn-primary btn-sm" onclick="iniciarReserva('${h.id}')">
                        Reservar
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function buscarExplorar() {
    const search = document.getElementById('searchExplorar').value.toLowerCase();
    const filterPrecio = document.getElementById('filterPrecio').value;
    const filterEnvio = document.getElementById('filterEnvio').checked;

    let filtered = [...todasHerramientas];

    // Filtrar por búsqueda
    if (search) {
        filtered = filtered.filter(h => 
            h.nombre.toLowerCase().includes(search) ||
            (h.marca && h.marca.toLowerCase().includes(search)) ||
            (h.modelo && h.modelo.toLowerCase().includes(search))
        );
    }

    // Filtrar por precio
    if (filterPrecio) {
        const [min, max] = filterPrecio.split('-').map(Number);
        filtered = filtered.filter(h => h.precioBaseDia >= min && h.precioBaseDia <= max);
    }

    // Filtrar por envío
    if (filterEnvio) {
        filtered = filtered.filter(h => h.envioIncluido);
    }

    renderizarGridExplorar(filtered);
}

function limpiarFiltrosExplorar() {
    document.getElementById('searchExplorar').value = '';
    document.getElementById('filterPrecio').value = '';
    document.getElementById('filterEnvio').checked = false;
    renderizarGridExplorar(todasHerramientas);
}

function verDetalleHerramienta(id) {
    alert('Modal de detalle de herramienta próximamente. ID: ' + id);
}

function iniciarReserva(id) {
    alert('Proceso de reserva próximamente. ID: ' + id);
}

// ==================== MIS RESERVAS ====================
async function cargarMisReservas() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">📋 Mis Reservas</h1>
            <p class="page-subtitle">Gestiona tus reservas activas y pasadas</p>
        </div>

        <div class="tabs">
            <div class="tab active" onclick="filtrarReservasPorTab('activas')">Activas</div>
            <div class="tab" onclick="filtrarReservasPorTab('completadas')">Completadas</div>
            <div class="tab" onclick="filtrarReservasPorTab('canceladas')">Canceladas</div>
        </div>

        <div id="reservasContent">
            <div class="loading">
                <div class="spinner"></div>
                <p class="loading-text">Cargando reservas...</p>
            </div>
        </div>
    `;

    try {
        const userId = localStorage.getItem('userId');
        misReservas = await api.get(`/reservas/cliente/${userId}`);
        filtrarReservasPorTab('activas');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('reservasContent').innerHTML = `
            <div class="alert alert-danger">Error al cargar reservas</div>
        `;
    }
}

function filtrarReservasPorTab(tab) {
    // Actualizar tabs activos
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event?.target?.classList.add('active');

    let filtered = [];
    
    switch(tab) {
        case 'activas':
            filtered = misReservas.filter(r => 
                !['COMPLETADA', 'CANCELADA_CLIENTE', 'CANCELADA_PROVEEDOR', 'CANCELADA_SISTEMA'].includes(r.estado)
            );
            break;
        case 'completadas':
            filtered = misReservas.filter(r => r.estado === 'COMPLETADA');
            break;
        case 'canceladas':
            filtered = misReservas.filter(r => 
                ['CANCELADA_CLIENTE', 'CANCELADA_PROVEEDOR', 'CANCELADA_SISTEMA'].includes(r.estado)
            );
            break;
    }

    renderizarReservas(filtered);
}

function renderizarReservas(reservas) {
    const content = document.getElementById('reservasContent');
    
    if (reservas.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-title">No tienes reservas</div>
                <div class="empty-state-text">Explora herramientas y haz tu primera reserva</div>
                <button class="btn btn-primary" onclick="cambiarVista('explorar')">
                    🔍 Explorar Herramientas
                </button>
            </div>
        `;
        return;
    }

    content.innerHTML = reservas.map(r => `
        <div class="card" style="margin-bottom: 20px;">
            <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                    <div>
                        <h3 style="margin: 0 0 8px 0;">#${r.numeroReserva}</h3>
                        <p style="margin: 0; color: #6c757d;">Herramienta ID: ${r.herramientaId}</p>
                    </div>
                    ${obtenerBadgeEstado(r.estado, 'RESERVA')}
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px;">
                    <div>
                        <strong>Fechas:</strong><br>
                        ${formatearFecha(r.fechaInicio)} - ${formatearFecha(r.fechaFin)}
                    </div>
                    <div>
                        <strong>Días:</strong><br>
                        ${r.diasTotales} días
                    </div>
                    <div>
                        <strong>Estado:</strong><br>
                        ${r.estado}
                    </div>
                </div>

                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <button class="btn btn-outline btn-sm" onclick="verDetalleReserva('${r.id}')">
                        👁️ Ver Detalle
                    </button>
                    ${r.estado === 'PENDIENTE_PAGO' ? `
                        <button class="btn btn-primary btn-sm">
                            💳 Pagar Ahora
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="cancelarReserva('${r.id}')">
                            ✖️ Cancelar
                        </button>
                    ` : ''}
                    ${r.estado === 'COMPLETADA' ? `
                        <button class="btn btn-sm" style="background-color: #ffc107; color: #000;" onclick="calificarReserva('${r.id}')">
                            ⭐ Calificar
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function verDetalleReserva(id) {
    alert('Ver detalle de reserva: ' + id);
}

async function cancelarReserva(id) {
    const motivo = prompt('¿Por qué deseas cancelar esta reserva?');
    if (!motivo) return;

    try {
        const userId = localStorage.getItem('userId');
        await api.post(`/reservas/${id}/cancelar?motivo=${encodeURIComponent(motivo)}&canceladoPor=${userId}`);
        mostrarAlerta('Reserva cancelada exitosamente', 'success');
        cargarMisReservas();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al cancelar reserva', 'danger');
    }
}

function calificarReserva(id) {
    alert('Sistema de calificación próximamente. ID: ' + id);
}

// ==================== FAVORITOS ====================
function cargarFavoritos() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">❤️ Mis Favoritos</h1>
            <p class="page-subtitle">Herramientas guardadas</p>
        </div>

        <div class="empty-state">
            <div class="empty-state-icon">❤️</div>
            <div class="empty-state-title">No tienes favoritos</div>
            <div class="empty-state-text">Explora herramientas y agrégalas a favoritos</div>
            <button class="btn btn-primary" onclick="cambiarVista('explorar')">
                🔍 Explorar Herramientas
            </button>
        </div>
    `;
}

// ==================== PERFIL ====================
async function cargarPerfil() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">👤 Mi Perfil</h1>
            <p class="page-subtitle">Información personal y configuración</p>
        </div>

        <div class="card" style="margin-bottom: 24px;">
            <div class="card-header">Información Personal</div>
            <div class="card-body">
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">Mi Score</div>
            <div class="card-body" id="scoreBody">
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            </div>
        </div>
    `;

    try {
        const userId = localStorage.getItem('userId');
        const usuario = await api.get(`/usuarios/${userId}`);

        // Renderizar información personal
        document.querySelector('.card-body').innerHTML = `
            <form id="perfilForm">
                <div class="form-group">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-control" id="nombre" value="${usuario.nombre}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Apellido</label>
                    <input type="text" class="form-control" id="apellido" value="${usuario.apellido}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" value="${usuario.email}" disabled>
                </div>
                <div class="form-group">
                    <label class="form-label">Teléfono</label>
                    <input type="tel" class="form-control" id="telefono" value="${usuario.telefono || ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Dirección</label>
                    <input type="text" class="form-control" id="direccion" value="${usuario.direccion || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Ciudad</label>
                    <input type="text" class="form-control" id="ciudad" value="${usuario.ciudad || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Departamento</label>
                    <input type="text" class="form-control" id="departamento" value="${usuario.departamento || ''}">
                </div>
                <button type="submit" class="btn btn-primary" id="guardarPerfilBtn">💾 Guardar Cambios</button>
            </form>
        `;

        // Renderizar score
        document.getElementById('scoreBody').innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 48px; font-weight: bold; color: #28a745; margin-bottom: 12px;">
                    ${usuario.score}/100
                </div>
                <p style="color: #6c757d; margin: 0;">
                    Advertencias: ${usuario.advertencias || 0}/5
                </p>
            </div>
        `;

        // Setup form submit
        document.getElementById('perfilForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const datosActualizados = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                telefono: document.getElementById('telefono').value,
                direccion: document.getElementById('direccion').value,
                ciudad: document.getElementById('ciudad').value,
                departamento: document.getElementById('departamento').value
            };

            deshabilitarBoton('guardarPerfilBtn', true);

            try {
                await api.put(`/usuarios/${userId}`, datosActualizados);
                mostrarAlerta('Perfil actualizado exitosamente', 'success');
                
                // Actualizar nombre en localStorage
                localStorage.setItem('userName', `${datosActualizados.nombre} ${datosActualizados.apellido}`);
                cargarNombreUsuario();
                
                deshabilitarBoton('guardarPerfilBtn', false);
            } catch (error) {
                console.error('Error:', error);
                mostrarAlerta('Error al actualizar perfil', 'danger');
                deshabilitarBoton('guardarPerfilBtn', false);
            }
        });

    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al cargar perfil', 'danger');
    }
}