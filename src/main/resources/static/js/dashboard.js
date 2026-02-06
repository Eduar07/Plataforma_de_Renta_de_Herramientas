/**
 * Dashboard Cliente y Proveedor
 */

requireAuth();

// Obtener rol del usuario
const userData = getUserData();
const userRole = userData ? userData.tipo : null;

// Verificar rol válido
if (!userRole || !['CLIENTE', 'PROVEEDOR'].includes(userRole)) {
    showAlert('Sesión inválida', 'danger');
    setTimeout(() => logout(), 2000);
}

// Variables globales
let currentView = userRole === 'CLIENTE' ? 'explorar' : 'miNegocio';
let misHerramientas = [];
let misReservas = [];

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    setupUI();
    setupMenuToggle();
    setupSidebarNavigation();
    setupUserDropdown();
    loadInitialView();
});

function setupUI() {
    // Actualizar información del usuario en header
    document.getElementById('userName').textContent = `${userData.nombre} ${userData.apellido}`;
    document.getElementById('userRole').textContent = userData.tipo;
    document.getElementById('userAvatar').textContent = getInitials(`${userData.nombre} ${userData.apellido}`);
    
    // Aplicar color según rol
    const sidebar = document.getElementById('sidebar');
    if (userRole === 'PROVEEDOR') {
        sidebar.classList.add('proveedor');
        document.getElementById('userAvatar').style.backgroundColor = 'var(--color-proveedor)';
    } else {
        sidebar.classList.add('cliente');
        document.getElementById('userAvatar').style.backgroundColor = 'var(--color-cliente)';
    }
    
    // Generar menú según rol
    generateSidebarMenu();
}

function generateSidebarMenu() {
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (!sidebarMenu) return;
    
    let menuHTML = '';
    
    if (userRole === 'CLIENTE') {
        menuHTML = `
            <a href="#explorar" class="sidebar-menu-item active" data-view="explorar">
                <span class="sidebar-menu-icon">🔍</span>
                <span>Explorar</span>
            </a>
            <a href="#misReservas" class="sidebar-menu-item" data-view="misReservas">
                <span class="sidebar-menu-icon">📋</span>
                <span>Mis Reservas</span>
            </a>
            <a href="#favoritos" class="sidebar-menu-item" data-view="favoritos">
                <span class="sidebar-menu-icon">❤️</span>
                <span>Favoritos</span>
            </a>
            <a href="#perfil" class="sidebar-menu-item" data-view="perfil">
                <span class="sidebar-menu-icon">👤</span>
                <span>Mi Perfil</span>
            </a>
        `;
    } else if (userRole === 'PROVEEDOR') {
        menuHTML = `
            <a href="#miNegocio" class="sidebar-menu-item active" data-view="miNegocio">
                <span class="sidebar-menu-icon">📊</span>
                <span>Mi Negocio</span>
            </a>
            <a href="#misHerramientas" class="sidebar-menu-item" data-view="misHerramientas">
                <span class="sidebar-menu-icon">🛠️</span>
                <span>Mis Herramientas</span>
            </a>
            <a href="#reservas" class="sidebar-menu-item" data-view="reservas">
                <span class="sidebar-menu-icon">📋</span>
                <span>Reservas</span>
            </a>
            <a href="#billetera" class="sidebar-menu-item" data-view="billetera">
                <span class="sidebar-menu-icon">💰</span>
                <span>Billetera</span>
            </a>
            <a href="#estadisticas" class="sidebar-menu-item" data-view="estadisticas">
                <span class="sidebar-menu-icon">📈</span>
                <span>Estadísticas</span>
            </a>
        `;
    }
    
    menuHTML += `
        <a href="#" class="sidebar-menu-item" onclick="logout()">
            <span class="sidebar-menu-icon">🚪</span>
            <span>Salir</span>
        </a>
    `;
    
    sidebarMenu.innerHTML = menuHTML;
}

function setupMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
}

function setupSidebarNavigation() {
    document.addEventListener('click', (e) => {
        const menuItem = e.target.closest('.sidebar-menu-item[data-view]');
        if (!menuItem) return;
        
        e.preventDefault();
        const view = menuItem.dataset.view;
        
        // Actualizar activo
        document.querySelectorAll('.sidebar-menu-item').forEach(item => {
            item.classList.remove('active');
        });
        menuItem.classList.add('active');
        
        // Cambiar vista
        changeView(view);
    });
}

function setupUserDropdown() {
    const toggle = document.getElementById('userDropdownToggle');
    const dropdown = document.getElementById('userDropdown');
    
    if (toggle && dropdown) {
        toggle.addEventListener('click', () => {
            dropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
}

function goToProfile() {
    changeView('perfil');
}

function loadInitialView() {
    changeView(currentView);
}

function changeView(view) {
    currentView = view;
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;
    
    // Renderizar vista según rol y selección
    if (userRole === 'CLIENTE') {
        switch(view) {
            case 'explorar':
                renderExplorarView();
                break;
            case 'misReservas':
                renderMisReservasView();
                break;
            case 'favoritos':
                renderFavoritosView();
                break;
            case 'perfil':
                renderPerfilView();
                break;
        }
    } else if (userRole === 'PROVEEDOR') {
        switch(view) {
            case 'miNegocio':
                renderMiNegocioView();
                break;
            case 'misHerramientas':
                renderMisHerramientasView();
                break;
            case 'reservas':
                renderReservasProveedorView();
                break;
            case 'billetera':
                renderBilleteraView();
                break;
            case 'estadisticas':
                renderEstadisticasView();
                break;
        }
    }
}

// ========================================
// VISTAS CLIENTE
// ========================================

async function renderExplorarView() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="dashboard-header">
            <h1 class="dashboard-title">🔍 Explorar Herramientas</h1>
            <p class="dashboard-subtitle">Encuentra la herramienta perfecta para tu proyecto</p>
        </div>
        
        <!-- Búsqueda -->
        <div class="filters-container">
            <div class="filters-row">
                <div class="form-group" style="grid-column: 1/-1;">
                    <input type="text" class="form-control" id="searchExplorar" placeholder="🔍 Buscar herramientas...">
                </div>
                <div class="form-group">
                    <select class="form-control" id="filterCategoria">
                        <option value="">Todas las categorías</option>
                        <option value="1">Construcción</option>
                        <option value="2">Carpintería</option>
                        <option value="3">Jardinería</option>
                        <option value="4">Electricidad</option>
                        <option value="5">Pintura</option>
                    </select>
                </div>
                <div class="form-group">
                    <select class="form-control" id="filterPrecio">
                        <option value="">Cualquier precio</option>
                        <option value="0-20000">Hasta $20,000/día</option>
                        <option value="20000-50000">$20,000 - $50,000/día</option>
                        <option value="50000-100000">$50,000 - $100,000/día</option>
                        <option value="100000-999999">Más de $100,000/día</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-check">
                        <input type="checkbox" class="form-check-input" id="filterEnvio">
                        <span class="form-check-label">Solo con envío incluido</span>
                    </label>
                </div>
            </div>
            <div class="filters-actions">
                <button class="btn btn-primary" onclick="buscarExplorar()">🔍 Buscar</button>
                <button class="btn btn-secondary" onclick="limpiarFiltrosExplorar()">✖️ Limpiar</button>
            </div>
        </div>
        
        <!-- Grid de Herramientas -->
        <div class="herramientas-grid" id="explorarGrid">
            <div style="grid-column: 1/-1; text-align: center; padding: var(--spacing-2xl);">
                <div class="spinner spinner-primary" style="width: 40px; height: 40px; margin: 0 auto;"></div>
                <p style="margin-top: var(--spacing-md);">Cargando herramientas...</p>
            </div>
        </div>
    `;
    
    // Cargar herramientas
    await cargarHerramientasExplorar();
}

async function cargarHerramientasExplorar() {
    try {
        const response = await fetchAPI(API_ENDPOINTS.HERRAMIENTAS);
        
        const grid = document.getElementById('explorarGrid');
        if (!grid) return;
        
        if (response.success && response.data) {
            const herramientas = response.data.filter(h => h.estado === 'ACTIVO');
            
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
            
            grid.innerHTML = herramientas.map(h => crearCardHerramientaCliente(h)).join('');
        }
    } catch (error) {
        console.error('Error cargando herramientas:', error);
        document.getElementById('explorarGrid').innerHTML = `
            <div class="alert alert-danger" style="grid-column: 1/-1;">
                Error al cargar herramientas. Por favor intenta nuevamente.
            </div>
        `;
    }
}

function crearCardHerramientaCliente(herramienta) {
    const imagen = herramienta.fotos && herramienta.fotos.length > 0 
        ? herramienta.fotos[0] 
        : 'https://via.placeholder.com/300x200?text=Sin+Imagen';
    
    return `
        <div class="herramienta-card">
            <div style="position: relative;">
                <img src="${imagen}" alt="${herramienta.nombre}" class="herramienta-image" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
                ${herramienta.envioIncluido ? '<span class="badge badge-success" style="position: absolute; top: 10px; left: 10px;">📦 Envío Incluido</span>' : ''}
                <button class="herramienta-favorite" onclick="toggleFavorito('${herramienta.id}')" title="Agregar a favoritos">
                    ❤️
                </button>
            </div>
            <div class="herramienta-body">
                <div class="herramienta-name">${herramienta.nombre}</div>
                <div class="herramienta-brand">${herramienta.marca || ''} ${herramienta.modelo || ''}</div>
                <div class="herramienta-price">
                    ${formatCurrency(herramienta.precioBaseDia)}
                    <span class="herramienta-price-label">/día</span>
                </div>
                <div class="herramienta-rating">
                    <span class="herramienta-rating-stars">⭐</span>
                    <span>${herramienta.calificacionPromedio || 0} (${herramienta.totalCalificaciones || 0})</span>
                </div>
            </div>
            <div class="herramienta-footer">
                <button class="btn btn-outline-primary btn-sm" onclick="verDetalleHerramientaCliente('${herramienta.id}')">
                    Ver Detalles
                </button>
                <button class="btn btn-primary btn-sm" onclick="iniciarReserva('${herramienta.id}')">
                    Reservar
                </button>
            </div>
        </div>
    `;
}

function buscarExplorar() {
    // Implementar búsqueda con filtros
    cargarHerramientasExplorar();
}

function limpiarFiltrosExplorar() {
    document.getElementById('searchExplorar').value = '';
    document.getElementById('filterCategoria').value = '';
    document.getElementById('filterPrecio').value = '';
    document.getElementById('filterEnvio').checked = false;
    cargarHerramientasExplorar();
}

function toggleFavorito(id) {
    showAlert('Funcionalidad de favoritos próximamente', 'info');
}

function verDetalleHerramientaCliente(id) {
    showAlert('Modal de detalle próximamente', 'info');
}

function iniciarReserva(id) {
    showAlert('Proceso de reserva próximamente', 'info');
}

async function renderMisReservasView() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="dashboard-header">
            <h1 class="dashboard-title">📋 Mis Reservas</h1>
            <p class="dashboard-subtitle">Gestiona tus reservas activas y pasadas</p>
        </div>
        
        <!-- Tabs -->
        <div class="tabs">
            <div class="tab active" data-tab="activas">Activas</div>
            <div class="tab" data-tab="completadas">Completadas</div>
            <div class="tab" data-tab="canceladas">Canceladas</div>
        </div>
        
        <!-- Contenido -->
        <div id="reservasClienteContent">
            <div style="text-align: center; padding: var(--spacing-2xl);">
                <div class="spinner spinner-primary" style="width: 40px; height: 40px; margin: 0 auto;"></div>
                <p style="margin-top: var(--spacing-md);">Cargando reservas...</p>
            </div>
        </div>
    `;
    
    // Cargar reservas
    await cargarMisReservas();
    
    // Setup tabs
    setupReservasClienteTabs();
}

async function cargarMisReservas() {
    try {
        const response = await fetchAPI(API_ENDPOINTS.RESERVAS_BY_CLIENTE(userData.id));
        
        if (response.success && response.data) {
            misReservas = response.data;
            renderReservasCliente(misReservas.filter(r => 
                !['COMPLETADA', 'CANCELADA_CLIENTE', 'CANCELADA_PROVEEDOR', 'CANCELADA_SISTEMA'].includes(r.estado)
            ));
        }
    } catch (error) {
        console.error('Error cargando reservas:', error);
        document.getElementById('reservasClienteContent').innerHTML = `
            <div class="alert alert-danger">
                Error al cargar reservas. Por favor intenta nuevamente.
            </div>
        `;
    }
}

function setupReservasClienteTabs() {
    const tabs = document.querySelectorAll('.tabs .tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filtro = tab.dataset.tab;
            filtrarReservasCliente(filtro);
        });
    });
}

function filtrarReservasCliente(filtro) {
    let filtered = [];
    
    switch(filtro) {
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
    
    renderReservasCliente(filtered);
}

function renderReservasCliente(reservas) {
    const content = document.getElementById('reservasClienteContent');
    if (!content) return;
    
    if (reservas.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-title">No tienes reservas</div>
                <div class="empty-state-text">Explora herramientas y haz tu primera reserva</div>
                <button class="btn btn-primary" onclick="changeView('explorar')">
                    🔍 Explorar Herramientas
                </button>
            </div>
        `;
        return;
    }
    
    content.innerHTML = reservas.map(r => `
        <div class="card" style="margin-bottom: var(--spacing-lg);">
            <div class="card-body">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h4>#${r.numeroReserva}</h4>
                        <p style="color: var(--color-gray-600);">Herramienta ID: ${r.herramientaId}</p>
                    </div>
                    ${getEstadoBadge(r.estado, 'RESERVA')}
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md); margin-top: var(--spacing-lg);">
                    <div>
                        <strong>Fechas:</strong><br>
                        ${formatDate(r.fechaInicio)} - ${formatDate(r.fechaFin)}
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
                
                <!-- Timeline -->
                <div class="timeline" style="margin-top: var(--spacing-lg);">
                    ${crearTimelineReserva(r)}
                </div>
                
                <!-- Acciones -->
                <div style="display: flex; gap: var(--spacing-sm); margin-top: var(--spacing-lg);">
                    <button class="btn btn-outline-primary btn-sm" onclick="verDetalleReservaCliente('${r.id}')">
                        👁️ Ver Detalle
                    </button>
                    ${r.estado === 'PENDIENTE_PAGO' ? `
                        <button class="btn btn-primary btn-sm">
                            💳 Pagar Ahora
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="cancelarReservaCliente('${r.id}')">
                            ✖️ Cancelar
                        </button>
                    ` : ''}
                    ${r.estado === 'COMPLETADA' ? `
                        <button class="btn btn-warning btn-sm">
                            ⭐ Calificar
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function crearTimelineReserva(reserva) {
    const estados = ['PAGADA', 'CONFIRMADA', 'ENVIADA', 'ENTREGADA', 'EN_USO', 'DEVUELTA', 'COMPLETADA'];
    const estadoActualIndex = estados.indexOf(reserva.estado);
    
    return estados.map((estado, index) => {
        const completado = index <= estadoActualIndex;
        const etiqueta = ESTADOS_RESERVA[estado]?.label || estado;
        
        return `
            <div class="timeline-item">
                <div class="timeline-marker ${completado ? 'completed' : 'pending'}"></div>
                <div class="timeline-content">
                    <div class="timeline-title">${etiqueta}</div>
                </div>
            </div>
        `;
    }).join('');
}

function verDetalleReservaCliente(id) {
    showAlert('Modal de detalle próximamente', 'info');
}

async function cancelarReservaCliente(id) {
    const motivo = prompt('¿Por qué deseas cancelar esta reserva?');
    if (!motivo) return;
    
    try {
        const response = await fetchAPI(
            API_ENDPOINTS.RESERVA_CANCELAR(id) + `?motivo=${encodeURIComponent(motivo)}&canceladoPor=${userData.id}`,
            { method: 'POST' }
        );
        
        if (response.success) {
            showAlert('Reserva cancelada exitosamente', 'success');
            cargarMisReservas();
        }
    } catch (error) {
        console.error('Error cancelando reserva:', error);
        showAlert('Error al cancelar reserva', 'danger');
    }
}

function renderFavoritosView() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="dashboard-header">
            <h1 class="dashboard-title">❤️ Mis Favoritos</h1>
            <p class="dashboard-subtitle">Herramientas guardadas</p>
        </div>
        
        <div class="empty-state">
            <div class="empty-state-icon">❤️</div>
            <div class="empty-state-title">No tienes favoritos</div>
            <div class="empty-state-text">Explora herramientas y agrégalas a favoritos</div>
            <button class="btn btn-primary" onclick="changeView('explorar')">
                🔍 Explorar Herramientas
            </button>
        </div>
    `;
}

function renderPerfilView() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="dashboard-header">
            <h1 class="dashboard-title">👤 Mi Perfil</h1>
            <p class="dashboard-subtitle">Información personal y configuración</p>
        </div>
        
        <!-- Información Personal -->
        <div class="card" style="margin-bottom: var(--spacing-lg);">
            <div class="card-header">
                <h3>Información Personal</h3>
            </div>
            <div class="card-body">
                <form id="perfilForm">
                    <div class="form-group">
                        <label class="form-label">Nombre</label>
                        <input type="text" class="form-control" value="${userData.nombre}" id="perfilNombre">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Apellido</label>
                        <input type="text" class="form-control" value="${userData.apellido}" id="perfilApellido">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" value="${userData.email}" disabled>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Teléfono</label>
                        <input type="tel" class="form-control" value="${userData.telefono || ''}" id="perfilTelefono">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Dirección</label>
                        <input type="text" class="form-control" value="${userData.direccion || ''}" id="perfilDireccion">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Ciudad</label>
                        <input type="text" class="form-control" value="${userData.ciudad || ''}" id="perfilCiudad">
                    </div>
                    <button type="submit" class="btn btn-primary">💾 Guardar Cambios</button>
                </form>
            </div>
        </div>
        
        <!-- Score -->
        <div class="card">
            <div class="card-header">
                <h3>Mi Score</h3>
            </div>
            <div class="card-body">
                <div style="text-align: center;">
                    <div style="font-size: var(--font-size-4xl); font-weight: var(--font-weight-bold); color: var(--color-success);">
                        ${userData.score}/100
                    </div>
                    <p style="color: var(--color-gray-600); margin-top: var(--spacing-sm);">
                        Advertencias: ${userData.advertencias || 0}/5
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // Setup form
    document.getElementById('perfilForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const datosActualizados = {
            nombre: document.getElementById('perfilNombre').value,
            apellido: document.getElementById('perfilApellido').value,
            telefono: document.getElementById('perfilTelefono').value,
            direccion: document.getElementById('perfilDireccion').value,
            ciudad: document.getElementById('perfilCiudad').value
        };
        
        try {
            const response = await fetchAPI(API_ENDPOINTS.USUARIOS_BY_ID(userData.id), {
                method: 'PUT',
                body: JSON.stringify(datosActualizados)
            });
            
            if (response.success) {
                showAlert('Perfil actualizado exitosamente', 'success');
                
                // Actualizar datos en localStorage
                const updatedUser = { ...userData, ...datosActualizados };
                localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
                
                // Recargar UI
                setupUI();
            }
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            showAlert('Error al actualizar perfil', 'danger');
        }
    });
}

// ========================================
// VISTAS PROVEEDOR
// ========================================

async function renderMiNegocioView() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="dashboard-header">
            <h1 class="dashboard-title">📊 Mi Negocio</h1>
            <p class="dashboard-subtitle">Vista general de tu actividad</p>
        </div>
        
        <!-- KPIs -->
        <div class="kpi-grid">
            <div class="card card-kpi">
                <div class="card-kpi-label">Saldo Disponible</div>
                <div class="card-kpi-value" style="color: var(--color-proveedor);">$0</div>
                <div class="card-kpi-change">En billetera</div>
            </div>
            
            <div class="card card-kpi">
                <div class="card-kpi-label">Herramientas Activas</div>
                <div class="card-kpi-value" id="kpiHerramientasProveedor">0</div>
                <div class="card-kpi-change">Publicadas</div>
            </div>
            
            <div class="card card-kpi">
                <div class="card-kpi-label">Reservas del Mes</div>
                <div class="card-kpi-value" id="kpiReservasMes">0</div>
                <div class="card-kpi-change">Este mes</div>
            </div>
            
            <div class="card card-kpi">
                <div class="card-kpi-label">Calificación</div>
                <div class="card-kpi-value">⭐ 0.0</div>
                <div class="card-kpi-change">(0 reseñas)</div>
            </div>
        </div>
        
        <!-- Acceso Rápido -->
        <div class="dashboard-section">
            <div class="section-header">
                <h3>⚡ Acceso Rápido</h3>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-md);">
                <button class="btn btn-primary btn-lg" onclick="changeView('misHerramientas')">
                    + Agregar Herramienta
                </button>
                <button class="btn btn-outline-primary btn-lg" onclick="changeView('reservas')">
                    📋 Ver Reservas
                </button>
                <button class="btn btn-outline-primary btn-lg" onclick="changeView('billetera')">
                    💰 Mi Billetera
                </button>
            </div>
        </div>
        
        <!-- Reservas Pendientes -->
        <div class="dashboard-section">
            <div class="section-header">
                <h3>⚠️ Reservas Pendientes de Acción</h3>
            </div>
            <div id="reservasPendientesContainer">
                <div class="empty-state">
                    <div class="empty-state-icon">✓</div>
                    <div class="empty-state-title">No hay reservas pendientes</div>
                </div>
            </div>
        </div>
    `;
    
    // Cargar datos
    await cargarDatosNegocio();
}

async function cargarDatosNegocio() {
    try {
        // Cargar herramientas y reservas del proveedor
        const [herramientas, reservas] = await Promise.all([
            fetchAPI(API_ENDPOINTS.HERRAMIENTAS_BY_PROVEEDOR(userData.id)),
            fetchAPI(API_ENDPOINTS.RESERVAS_BY_PROVEEDOR(userData.id))
        ]);
        
        if (herramientas.success) {
            const activas = herramientas.data.filter(h => h.estado === 'ACTIVO').length;
            document.getElementById('kpiHerramientasProveedor').textContent = activas;
        }
        
        if (reservas.success) {
            const esteMes = reservas.data.filter(r => {
                const fecha = new Date(r.created_at);
                const ahora = new Date();
                return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
            }).length;
            document.getElementById('kpiReservasMes').textContent = esteMes;
        }
    } catch (error) {
        console.error('Error cargando datos del negocio:', error);
    }
}

async function renderMisHerramientasView() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="dashboard-header">
            <h1 class="dashboard-title">🛠️ Mis Herramientas</h1>
            <p class="dashboard-subtitle">Gestiona tu inventario</p>
        </div>
        
        <button class="btn btn-primary btn-lg" style="margin-bottom: var(--spacing-lg);" onclick="mostrarModalAgregarHerramienta()">
            + Agregar Nueva Herramienta
        </button>
        
        <div class="herramientas-grid" id="misHerramientasGrid">
            <div style="grid-column: 1/-1; text-align: center; padding: var(--spacing-2xl);">
                <div class="spinner spinner-primary" style="width: 40px; height: 40px; margin: 0 auto;"></div>
                <p style="margin-top: var(--spacing-md);">Cargando herramientas...</p>
            </div>
        </div>
    `;
    
    await cargarMisHerramientas();
}

async function cargarMisHerramientas() {
    try {
        const response = await fetchAPI(API_ENDPOINTS.HERRAMIENTAS_BY_PROVEEDOR(userData.id));
        
        const grid = document.getElementById('misHerramientasGrid');
        if (!grid) return;
        
        if (response.success && response.data) {
            misHerramientas = response.data;
            
            if (misHerramientas.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1/-1;">
                        <div class="empty-state-icon">🛠️</div>
                        <div class="empty-state-title">No tienes herramientas</div>
                        <div class="empty-state-text">Agrega tu primera herramienta para empezar</div>
                        <button class="btn btn-primary" onclick="mostrarModalAgregarHerramienta()">
                            + Agregar Herramienta
                        </button>
                    </div>
                `;
                return;
            }
            
            grid.innerHTML = misHerramientas.map(h => crearCardHerramientaProveedor(h)).join('');
        }
    } catch (error) {
        console.error('Error cargando herramientas:', error);
        document.getElementById('misHerramientasGrid').innerHTML = `
            <div class="alert alert-danger" style="grid-column: 1/-1;">
                Error al cargar herramientas
            </div>
        `;
    }
}

function crearCardHerramientaProveedor(herramienta) {
    const imagen = herramienta.fotos && herramienta.fotos.length > 0 
        ? herramienta.fotos[0] 
        : 'https://via.placeholder.com/300x200?text=Sin+Imagen';
    
    const estadoBadgeClass = {
        'ACTIVO': 'success',
        'PAUSADO': 'warning',
        'ELIMINADO': 'danger'
    }[herramienta.estado] || 'secondary';
    
    return `
        <div class="herramienta-card">
            <div style="position: relative;">
                <img src="${imagen}" alt="${herramienta.nombre}" class="herramienta-image" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
                <span class="badge badge-${estadoBadgeClass}" style="position: absolute; top: 10px; right: 10px;">
                    ${herramienta.estado}
                </span>
            </div>
            <div class="herramienta-body">
                <div class="herramienta-name">${herramienta.nombre}</div>
                <div class="herramienta-brand">${herramienta.marca || ''} ${herramienta.modelo || ''}</div>
                <div class="herramienta-price">
                    ${formatCurrency(herramienta.precioBaseDia)}
                    <span class="herramienta-price-label">/día</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: var(--font-size-sm); margin-top: var(--spacing-sm);">
                    <span>⭐ ${herramienta.calificacionPromedio || 0}</span>
                    <span>👁️ ${herramienta.vistas || 0}</span>
                    <span>📋 ${herramienta.totalAlquileres || 0}</span>
                </div>
            </div>
            <div class="herramienta-footer">
                <button class="btn btn-outline-primary btn-sm" onclick="editarHerramienta('${herramienta.id}')">
                    ✏️ Editar
                </button>
                <button class="btn btn-${herramienta.estado === 'ACTIVO' ? 'warning' : 'success'} btn-sm" 
                        onclick="toggleEstadoHerramienta('${herramienta.id}', '${herramienta.estado}')">
                    ${herramienta.estado === 'ACTIVO' ? '⏸️ Pausar' : '▶️ Activar'}
                </button>
            </div>
        </div>
    `;
}

function mostrarModalAgregarHerramienta() {
    showAlert('Modal para agregar herramienta próximamente', 'info');
}

function editarHerramienta(id) {
    showAlert('Modal para editar herramienta próximamente', 'info');
}

async function toggleEstadoHerramienta(id, estadoActual) {
    const nuevoEstado = estadoActual === 'ACTIVO' ? 'PAUSADO' : 'ACTIVO';
    
    try {
        const response = await fetchAPI(
            API_ENDPOINTS.HERRAMIENTA_CAMBIAR_ESTADO(id) + `?estado=${nuevoEstado}`,
            { method: 'PATCH' }
        );
        
        if (response.success) {
            showAlert(`Herramienta ${nuevoEstado.toLowerCase()} exitosamente`, 'success');
            cargarMisHerramientas();
        }
    } catch (error) {
        console.error('Error cambiando estado:', error);
        showAlert('Error al cambiar estado', 'danger');
    }
}

function renderReservasProveedorView() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="dashboard-header">
            <h1 class="dashboard-title">📋 Reservas</h1>
            <p class="dashboard-subtitle">Gestiona las reservas de tus herramientas</p>
        </div>
        
        <div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <div class="empty-state-title">Vista de reservas próximamente</div>
        </div>
    `;
}

function renderBilleteraView() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="dashboard-header">
            <h1 class="dashboard-title">💰 Mi Billetera</h1>
            <p class="dashboard-subtitle">Gestiona tus ingresos y retiros</p>
        </div>
        
        <div class="kpi-grid">
            <div class="card card-kpi">
                <div class="card-kpi-label">Saldo Disponible</div>
                <div class="card-kpi-value" style="color: var(--color-success);">$0</div>
                <button class="btn btn-primary btn-sm" style="margin-top: var(--spacing-md);">
                    💸 Solicitar Retiro
                </button>
            </div>
            
            <div class="card card-kpi">
                <div class="card-kpi-label">Saldo Retenido</div>
                <div class="card-kpi-value" style="color: var(--color-warning);">$0</div>
                <div class="card-kpi-change">Temporal</div>
            </div>
            
            <div class="card card-kpi">
                <div class="card-kpi-label">Total Acumulado</div>
                <div class="card-kpi-value">$0</div>
                <div class="card-kpi-change">Histórico</div>
            </div>
        </div>
        
        <div class="dashboard-section">
            <div class="section-header">
                <h3>📊 Historial de Movimientos</h3>
            </div>
            <div class="empty-state">
                <div class="empty-state-icon">💰</div>
                <div class="empty-state-title">No hay movimientos</div>
            </div>
        </div>
    `;
}

function renderEstadisticasView() {
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = `
        <div class="dashboard-header">
            <h1 class="dashboard-title">📈 Estadísticas</h1>
            <p class="dashboard-subtitle">Analiza el rendimiento de tu negocio</p>
        </div>
        
        <div class="empty-state">
            <div class="empty-state-icon">📈</div>
            <div class="empty-state-title">Estadísticas próximamente</div>
        </div>
    `;
}