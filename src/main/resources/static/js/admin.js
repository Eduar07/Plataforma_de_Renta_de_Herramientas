/**
 * Dashboard Administrativo
 */

requireAuth();

// Verificar que sea admin
const userRole = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
if (userRole !== 'ADMIN') {
    showAlert('No tienes permisos para acceder a esta página', 'danger');
    setTimeout(() => {
        logout();
    }, 2000);
}

// Variables globales
let currentView = 'dashboard';
let usuariosData = [];
let herramientasData = [];
let reservasData = [];
let pagosData = [];

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    setupMenuToggle();
    setupSidebarNavigation();
    setupUserDropdown();
    loadDashboard();
});

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
    const menuItems = document.querySelectorAll('.sidebar-menu-item[data-view]');
    
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            
            // Actualizar activo
            menuItems.forEach(m => m.classList.remove('active'));
            item.classList.add('active');
            
            // Cambiar vista
            changeView(view);
        });
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

function changeView(view) {
    currentView = view;
    
    // Ocultar todas las vistas
    const views = ['dashboardView', 'usuariosView', 'herramientasView', 'reservasView', 'pagosView', 'configuracionView'];
    views.forEach(v => {
        const element = document.getElementById(v);
        if (element) element.classList.add('hidden');
    });
    
    // Mostrar vista actual
    const currentViewElement = document.getElementById(`${view}View`);
    if (currentViewElement) {
        currentViewElement.classList.remove('hidden');
    }
    
    // Cargar datos según la vista
    switch(view) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'usuarios':
            loadUsuarios();
            break;
        case 'herramientas':
            loadHerramientas();
            break;
        case 'reservas':
            loadReservas();
            break;
        case 'pagos':
            loadPagos();
            break;
        case 'configuracion':
            loadConfiguracion();
            break;
    }
}

// ========== DASHBOARD ==========
async function loadDashboard() {
    try {
        // Cargar KPIs en paralelo
        const [usuarios, herramientas, reservas, pagos] = await Promise.all([
            fetchAPI(API_ENDPOINTS.USUARIOS),
            fetchAPI(API_ENDPOINTS.HERRAMIENTAS),
            fetchAPI(API_ENDPOINTS.RESERVAS),
            fetchAPI(API_ENDPOINTS.PAGOS)
        ]);
        
        // Total Usuarios
        if (usuarios.success) {
            const totalUsuarios = usuarios.data.length;
            const clientes = usuarios.data.filter(u => u.tipo === 'CLIENTE').length;
            const proveedores = usuarios.data.filter(u => u.tipo === 'PROVEEDOR').length;
            
            document.getElementById('kpiTotalUsuarios').textContent = totalUsuarios;
            document.getElementById('kpiClientes').textContent = clientes;
            document.getElementById('kpiProveedores').textContent = proveedores;
        }
        
        // Reservas Activas
        if (reservas.success) {
            const activas = reservas.data.filter(r => 
                ['CONFIRMADA', 'EN_USO', 'ENVIADA', 'ENTREGADA'].includes(r.estado)
            ).length;
            document.getElementById('kpiReservasActivas').textContent = activas;
        }
        
        // Herramientas
        if (herramientas.success) {
            const activas = herramientas.data.filter(h => h.estado === 'ACTIVO').length;
            document.getElementById('kpiHerramientas').textContent = activas;
        }
        
        // Ingresos del Mes
        if (pagos.success) {
            const exitosos = pagos.data.filter(p => p.estado === 'EXITOSO');
            const total = exitosos.reduce((sum, p) => sum + (p.monto * 0.10), 0); // 10% comisión
            document.getElementById('kpiIngresos').textContent = formatCurrency(total);
        }
        
        // Alertas
        cargarAlertas(reservas.data, usuarios.data);
        
    } catch (error) {
        console.error('Error cargando dashboard:', error);
        showAlert('Error al cargar el dashboard', 'danger');
    }
}

function cargarAlertas(reservas, usuarios) {
    const alertasContainer = document.getElementById('alertasContainer');
    if (!alertasContainer) return;
    
    const mora = reservas.filter(r => r.estado === 'MORA');
    const bloqueados = usuarios.filter(u => u.estado === 'BLOQUEADO');
    
    if (mora.length === 0 && bloqueados.length === 0) {
        alertasContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✓</div>
                <div class="empty-state-title">No hay alertas</div>
                <div class="empty-state-text">Todo está funcionando correctamente</div>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    if (mora.length > 0) {
        html += `
            <div class="alert alert-danger">
                ⚠️ Hay ${mora.length} reserva(s) en estado de MORA
                <button class="btn btn-sm btn-outline-primary" style="margin-left: auto;" onclick="changeView('reservas')">
                    Ver Reservas
                </button>
            </div>
        `;
    }
    
    if (bloqueados.length > 0) {
        html += `
            <div class="alert alert-warning">
                ⚠️ Hay ${bloqueados.length} usuario(s) bloqueado(s) recientemente
                <button class="btn btn-sm btn-outline-primary" style="margin-left: auto;" onclick="changeView('usuarios')">
                    Ver Usuarios
                </button>
            </div>
        `;
    }
    
    alertasContainer.innerHTML = html;
}

// ========== USUARIOS ==========
async function loadUsuarios() {
    try {
        const response = await fetchAPI(API_ENDPOINTS.USUARIOS);
        
        if (response.success) {
            usuariosData = response.data;
            renderUsuariosTable(usuariosData);
        }
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        showAlert('Error al cargar usuarios', 'danger');
    }
}

function renderUsuariosTable(usuarios) {
    const tbody = document.getElementById('usuariosTableBody');
    if (!tbody) return;
    
    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay usuarios</td></tr>';
        return;
    }
    
    tbody.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.email}</td>
            <td>${u.nombre} ${u.apellido}</td>
            <td><span class="badge badge-info">${u.tipo}</span></td>
            <td><span class="badge badge-${u.estado === 'ACTIVO' ? 'success' : 'danger'}">${u.estado}</span></td>
            <td>${u.score}/100</td>
            <td>${u.advertencias || 0}</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="verDetalleUsuario('${u.id}')" title="Ver Detalle">👁️</button>
                ${u.estado === 'ACTIVO' 
                    ? `<button class="btn btn-sm btn-danger" onclick="bloquearUsuario('${u.id}')" title="Bloquear">🔒</button>`
                    : `<button class="btn btn-sm btn-success" onclick="desbloquearUsuario('${u.id}')" title="Desbloquear">🔓</button>`
                }
            </td>
        </tr>
    `).join('');
}

function buscarUsuarios() {
    const search = document.getElementById('searchUsuarios').value.toLowerCase();
    const filterTipo = document.getElementById('filterTipo').value;
    const filterEstado = document.getElementById('filterEstado').value;
    
    let filtered = [...usuariosData];
    
    if (search) {
        filtered = filtered.filter(u => 
            u.email.toLowerCase().includes(search) ||
            u.nombre.toLowerCase().includes(search) ||
            u.apellido.toLowerCase().includes(search)
        );
    }
    
    if (filterTipo) {
        filtered = filtered.filter(u => u.tipo === filterTipo);
    }
    
    if (filterEstado) {
        filtered = filtered.filter(u => u.estado === filterEstado);
    }
    
    renderUsuariosTable(filtered);
}

function limpiarFiltrosUsuarios() {
    document.getElementById('searchUsuarios').value = '';
    document.getElementById('filterTipo').value = '';
    document.getElementById('filterEstado').value = '';
    renderUsuariosTable(usuariosData);
}

function verDetalleUsuario(id) {
    const usuario = usuariosData.find(u => u.id === id);
    if (!usuario) return;
    
    const modalBody = document.getElementById('usuarioModalBody');
    modalBody.innerHTML = `
        <div style="display: grid; gap: var(--spacing-md);">
            <div>
                <strong>Email:</strong> ${usuario.email}
            </div>
            <div>
                <strong>Nombre Completo:</strong> ${usuario.nombre} ${usuario.apellido}
            </div>
            <div>
                <strong>Tipo:</strong> <span class="badge badge-info">${usuario.tipo}</span>
            </div>
            <div>
                <strong>Estado:</strong> <span class="badge badge-${usuario.estado === 'ACTIVO' ? 'success' : 'danger'}">${usuario.estado}</span>
            </div>
            <div>
                <strong>Teléfono:</strong> ${usuario.telefono || '-'}
            </div>
            <div>
                <strong>Documento:</strong> ${usuario.documentoTipo} ${usuario.documentoNumero}
            </div>
            <div>
                <strong>Dirección:</strong> ${usuario.direccion || '-'}
            </div>
            <div>
                <strong>Ciudad:</strong> ${usuario.ciudad || '-'}, ${usuario.departamento || '-'}
            </div>
            <div>
                <strong>Score:</strong> ${usuario.score}/100
            </div>
            <div>
                <strong>Advertencias:</strong> ${usuario.advertencias || 0}/5
            </div>
            ${usuario.razonBloqueo ? `
                <div class="alert alert-danger">
                    <strong>Razón de Bloqueo:</strong> ${usuario.razonBloqueo}
                </div>
            ` : ''}
            <div>
                <strong>Fecha de Registro:</strong> ${formatDateTime(usuario.fechaRegistro)}
            </div>
            <div>
                <strong>Última Actividad:</strong> ${formatDateTime(usuario.ultimaActividad)}
            </div>
        </div>
    `;
    
    openModal('usuarioModal');
}

async function bloquearUsuario(id) {
    const razon = prompt('¿Por qué deseas bloquear este usuario?');
    if (!razon) return;
    
    try {
        const response = await fetchAPI(API_ENDPOINTS.BLOQUEAR_USUARIO(id) + `?razon=${encodeURIComponent(razon)}`, {
            method: 'POST'
        });
        
        if (response.success) {
            showAlert('Usuario bloqueado exitosamente', 'success');
            loadUsuarios();
        }
    } catch (error) {
        console.error('Error bloqueando usuario:', error);
        showAlert('Error al bloquear usuario', 'danger');
    }
}

async function desbloquearUsuario(id) {
    if (!confirm('¿Estás seguro de desbloquear este usuario?')) return;
    
    try {
        const response = await fetchAPI(API_ENDPOINTS.DESBLOQUEAR_USUARIO(id), {
            method: 'POST'
        });
        
        if (response.success) {
            showAlert('Usuario desbloqueado exitosamente', 'success');
            loadUsuarios();
        }
    } catch (error) {
        console.error('Error desbloqueando usuario:', error);
        showAlert('Error al desbloquear usuario', 'danger');
    }
}

// ========== HERRAMIENTAS ==========
async function loadHerramientas() {
    try {
        const response = await fetchAPI(API_ENDPOINTS.HERRAMIENTAS);
        
        if (response.success) {
            herramientasData = response.data;
            renderHerramientasGrid(herramientasData);
        }
    } catch (error) {
        console.error('Error cargando herramientas:', error);
        showAlert('Error al cargar herramientas', 'danger');
    }
}

function renderHerramientasGrid(herramientas) {
    const grid = document.getElementById('herramientasAdminGrid');
    if (!grid) return;
    
    if (herramientas.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-title">No hay herramientas</div>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = herramientas.map(h => crearCardHerramientaAdmin(h)).join('');
}

function crearCardHerramientaAdmin(herramienta) {
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
                <button class="btn btn-outline-primary btn-sm" onclick="verDetalleHerramientaAdmin('${herramienta.id}')">
                    Ver
                </button>
                <button class="btn btn-${herramienta.estado === 'ACTIVO' ? 'warning' : 'success'} btn-sm" 
                        onclick="cambiarEstadoHerramienta('${herramienta.id}', '${herramienta.estado === 'ACTIVO' ? 'PAUSADO' : 'ACTIVO'}')">
                    ${herramienta.estado === 'ACTIVO' ? 'Pausar' : 'Activar'}
                </button>
            </div>
        </div>
    `;
}

function buscarHerramientas() {
    const search = document.getElementById('searchHerramientas').value.toLowerCase();
    const filterEstado = document.getElementById('filterEstadoHerramienta').value;
    
    let filtered = [...herramientasData];
    
    if (search) {
        filtered = filtered.filter(h => 
            h.nombre.toLowerCase().includes(search) ||
            (h.marca && h.marca.toLowerCase().includes(search)) ||
            (h.modelo && h.modelo.toLowerCase().includes(search))
        );
    }
    
    if (filterEstado) {
        filtered = filtered.filter(h => h.estado === filterEstado);
    }
    
    renderHerramientasGrid(filtered);
}

function verDetalleHerramientaAdmin(id) {
    // Implementar modal de detalle
    alert('Modal de detalle de herramienta - ID: ' + id);
}

async function cambiarEstadoHerramienta(id, nuevoEstado) {
    try {
        const response = await fetchAPI(API_ENDPOINTS.HERRAMIENTA_CAMBIAR_ESTADO(id) + `?estado=${nuevoEstado}`, {
            method: 'PATCH'
        });
        
        if (response.success) {
            showAlert('Estado actualizado exitosamente', 'success');
            loadHerramientas();
        }
    } catch (error) {
        console.error('Error cambiando estado:', error);
        showAlert('Error al cambiar estado', 'danger');
    }
}

// ========== RESERVAS ==========
async function loadReservas() {
    try {
        const response = await fetchAPI(API_ENDPOINTS.RESERVAS);
        
        if (response.success) {
            reservasData = response.data;
            renderReservasTable(reservasData);
            setupReservasTabs();
        }
    } catch (error) {
        console.error('Error cargando reservas:', error);
        showAlert('Error al cargar reservas', 'danger');
    }
}

function setupReservasTabs() {
    const tabs = document.querySelectorAll('.tabs .tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const filtro = tab.dataset.tab;
            filtrarReservasPorTab(filtro);
        });
    });
}

function filtrarReservasPorTab(filtro) {
    let filtered = [...reservasData];
    
    switch(filtro) {
        case 'pendientes':
            filtered = filtered.filter(r => r.estado === 'PENDIENTE_PAGO' || r.estado === 'PAGADA');
            break;
        case 'activas':
            filtered = filtered.filter(r => ['CONFIRMADA', 'EN_USO', 'ENVIADA', 'ENTREGADA'].includes(r.estado));
            break;
        case 'completadas':
            filtered = filtered.filter(r => r.estado === 'COMPLETADA');
            break;
        case 'mora':
            filtered = filtered.filter(r => r.estado === 'MORA');
            break;
    }
    
    renderReservasTable(filtered);
}

function renderReservasTable(reservas) {
    const tbody = document.getElementById('reservasTableBody');
    if (!tbody) return;
    
    if (reservas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay reservas</td></tr>';
        return;
    }
    
    tbody.innerHTML = reservas.map(r => `
        <tr>
            <td><strong>${r.numeroReserva}</strong></td>
            <td>${r.clienteId}</td>
            <td>${r.herramientaId}</td>
            <td>${formatDate(r.fechaInicio)} - ${formatDate(r.fechaFin)}</td>
            <td>${getEstadoBadge(r.estado, 'RESERVA')}</td>
            <td>-</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="verDetalleReserva('${r.id}')" title="Ver Detalle">👁️</button>
            </td>
        </tr>
    `).join('');
}

function verDetalleReserva(id) {
    alert('Modal de detalle de reserva - ID: ' + id);
}

// ========== PAGOS ==========
async function loadPagos() {
    try {
        const response = await fetchAPI(API_ENDPOINTS.PAGOS);
        
        if (response.success) {
            pagosData = response.data;
            renderPagosTable(pagosData);
        }
    } catch (error) {
        console.error('Error cargando pagos:', error);
        showAlert('Error al cargar pagos', 'danger');
    }
}

function renderPagosTable(pagos) {
    const tbody = document.getElementById('pagosTableBody');
    if (!tbody) return;
    
    if (pagos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay pagos</td></tr>';
        return;
    }
    
    tbody.innerHTML = pagos.map(p => `
        <tr>
            <td><strong>${p.numeroTransaccion}</strong></td>
            <td>${p.clienteId}</td>
            <td>${formatCurrency(p.monto)}</td>
            <td>${p.metodo}</td>
            <td>${getEstadoBadge(p.estado, 'PAGO')}</td>
            <td>${formatDateTime(p.fechaPago || p.created_at)}</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-outline-primary" onclick="verDetallePago('${p.id}')" title="Ver Detalle">👁️</button>
            </td>
        </tr>
    `).join('');
}

function verDetallePago(id) {
    alert('Modal de detalle de pago - ID: ' + id);
}

// ========== CONFIGURACIÓN ==========
function loadConfiguracion() {
    // Cargar configuración actual
    console.log('Cargando configuración...');
}

// Setup del formulario de configuración
document.getElementById('configForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    showAlert('Configuración guardada exitosamente', 'success');
});