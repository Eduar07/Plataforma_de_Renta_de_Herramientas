/**
 * ADMIN DASHBOARD
 */

// Verificar autenticación y rol
const userRole = localStorage.getItem('userRole');
if (!localStorage.getItem('token') || userRole !== 'ADMIN') {
    alert('Acceso denegado');
    window.location.href = '/login.html';
}

// Variables globales
let vistaActual = 'dashboard';
let datosUsuarios = [];
let datosHerramientas = [];
let datosHerramientasActivas = [];
let datosHerramientasPausadas = [];
let datosReservas = [];
let datosPagos = [];

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarNombreUsuario();
    cambiarVista('dashboard');
});

function cargarNombreUsuario() {
    const userName = localStorage.getItem('userName') || 'Administrador';
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
        case 'dashboard':
            cargarDashboard();
            break;
        case 'usuarios':
            cargarUsuarios();
            break;
        case 'herramientas':
            cargarHerramientas();
            break;
        case 'herramientasPausadas':
            cargarHerramientasPausadas();
            break;
        case 'reservas':
            cargarReservas();
            break;
        case 'pagos':
            cargarPagos();
            break;
    }
}

// ==================== DASHBOARD ====================
async function cargarDashboard() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">📊 Dashboard Administrativo</h1>
            <p class="page-subtitle">Vista general del sistema</p>
        </div>

        <div class="kpi-grid" id="kpiGrid">
            <div class="loading" style="grid-column: 1/-1;">
                <div class="spinner"></div>
                <p class="loading-text">Cargando estadísticas...</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">⚠️ Alertas Prioritarias</div>
            <div class="card-body" id="alertasBody">
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            </div>
        </div>
    `;

    try {
        // Cargar datos en paralelo
        const [usuarios, herramientas, reservas, pagos] = await Promise.all([
            api.get('/usuarios'),
            api.get('/herramientas'),
            api.get('/reservas'),
            api.get('/pagos')
        ]);

        // Calcular KPIs
        const totalUsuarios = usuarios.length;
        const clientes = usuarios.filter(u => u.tipo === 'CLIENTE').length;
        const proveedores = usuarios.filter(u => u.tipo === 'PROVEEDOR').length;
        const reservasActivas = reservas.filter(r => 
            ['CONFIRMADA', 'EN_USO', 'ENVIADA', 'ENTREGADA'].includes(r.estado)
        ).length;
        const herramientasActivas = herramientas.filter(h => h.estado === 'ACTIVO').length;
        const herramientasPausadas = herramientas.filter(h => h.estado === 'PAUSADO').length;
        const pagosExitosos = pagos.filter(p => p.estado === 'EXITOSO');
        const ingresosMes = pagosExitosos.reduce((sum, p) => sum + (p.monto * 0.10), 0);

        // Renderizar KPIs
        document.getElementById('kpiGrid').innerHTML = `
            <div class="kpi-card">
                <div class="kpi-label">Total Usuarios</div>
                <div class="kpi-value">${totalUsuarios}</div>
                <div class="kpi-change">Clientes: ${clientes} | Proveedores: ${proveedores}</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">Reservas Activas</div>
                <div class="kpi-value">${reservasActivas}</div>
                <div class="kpi-change">En curso</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">Herramientas</div>
                <div class="kpi-value">${herramientasActivas}</div>
                <div class="kpi-change">${herramientasPausadas} pausadas</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">Ingresos del Mes</div>
                <div class="kpi-value">${formatearMoneda(ingresosMes)}</div>
                <div class="kpi-change">Comisiones</div>
            </div>
        `;

        // Alertas
        const reservasMora = reservas.filter(r => r.estado === 'MORA');
        const usuariosBloqueados = usuarios.filter(u => u.estado === 'BLOQUEADO');

        let alertasHTML = '';
        if (reservasMora.length > 0) {
            alertasHTML += `
                <div class="alert alert-danger">
                    ⚠️ Hay ${reservasMora.length} reserva(s) en MORA
                </div>
            `;
        }
        if (usuariosBloqueados.length > 0) {
            alertasHTML += `
                <div class="alert alert-warning">
                    ⚠️ Hay ${usuariosBloqueados.length} usuario(s) bloqueado(s)
                </div>
            `;
        }
        if (herramientasPausadas > 0) {
            alertasHTML += `
                <div class="alert alert-info">
                    ⏸️ Hay ${herramientasPausadas} herramienta(s) pausadas. 
                    <a href="#" onclick="cambiarVista('herramientasPausadas'); return false;" style="color: #0c5460; text-decoration: underline;">
                        Ver herramientas pausadas
                    </a>
                </div>
            `;
        }
        if (alertasHTML === '') {
            alertasHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">✓</div>
                    <div class="empty-state-title">No hay alertas</div>
                </div>
            `;
        }

        document.getElementById('alertasBody').innerHTML = alertasHTML;

    } catch (error) {
        console.error('Error cargando dashboard:', error);
        mostrarAlerta('Error al cargar dashboard', 'danger');
    }
}

// ==================== USUARIOS ====================
async function cargarUsuarios() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">👥 Gestión de Usuarios</h1>
        </div>

        <div class="filters-container">
            <div class="filters-grid">
                <input type="text" class="form-control" id="searchUsuarios" placeholder="Buscar por email, nombre...">
                <select class="form-select" id="filterTipo">
                    <option value="">Todos los tipos</option>
                    <option value="CLIENTE">Cliente</option>
                    <option value="PROVEEDOR">Proveedor</option>
                    <option value="ADMIN">Admin</option>
                </select>
                <select class="form-select" id="filterEstado">
                    <option value="">Todos los estados</option>
                    <option value="ACTIVO">Activo</option>
                    <option value="BLOQUEADO">Bloqueado</option>
                    <option value="SUSPENDIDO">Suspendido</option>
                </select>
            </div>
            <div class="filters-actions">
                <button class="btn btn-primary" onclick="buscarUsuarios()">🔍 Buscar</button>
                <button class="btn btn-secondary" onclick="limpiarFiltrosUsuarios()">✖️ Limpiar</button>
            </div>
        </div>

        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Estado</th>
                        <th>Score</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="usuariosTableBody">
                    <tr>
                        <td colspan="6" class="text-center">
                            <div class="loading">
                                <div class="spinner"></div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    try {
        datosUsuarios = await api.get('/usuarios');
        renderizarTablaUsuarios(datosUsuarios);
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        document.getElementById('usuariosTableBody').innerHTML = `
            <tr><td colspan="6" class="text-center">
                <div class="alert alert-danger">Error al cargar usuarios</div>
            </td></tr>
        `;
    }
}

function renderizarTablaUsuarios(usuarios) {
    const tbody = document.getElementById('usuariosTableBody');
    
    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay usuarios</td></tr>';
        return;
    }

    tbody.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.email}</td>
            <td>${u.nombre} ${u.apellido}</td>
            <td><span class="badge badge-info">${u.tipo}</span></td>
            <td><span class="badge badge-${u.estado === 'ACTIVO' ? 'success' : 'danger'}">${u.estado}</span></td>
            <td>${u.score}/100</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-outline" onclick="verDetalleUsuario('${u.id}')">👁️</button>
                ${u.estado === 'ACTIVO' 
                    ? `<button class="btn btn-sm btn-danger" onclick="bloquearUsuario('${u.id}')">🔒</button>`
                    : `<button class="btn btn-sm btn-success" onclick="desbloquearUsuario('${u.id}')">🔓</button>`
                }
            </td>
        </tr>
    `).join('');
}

function buscarUsuarios() {
    const search = document.getElementById('searchUsuarios').value.toLowerCase();
    const filterTipo = document.getElementById('filterTipo').value;
    const filterEstado = document.getElementById('filterEstado').value;

    let filtered = [...datosUsuarios];

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

    renderizarTablaUsuarios(filtered);
}

function limpiarFiltrosUsuarios() {
    document.getElementById('searchUsuarios').value = '';
    document.getElementById('filterTipo').value = '';
    document.getElementById('filterEstado').value = '';
    renderizarTablaUsuarios(datosUsuarios);
}

function verDetalleUsuario(id) {
    const usuario = datosUsuarios.find(u => u.id === id);
    if (!usuario) return;

    alert(`Detalle de usuario:\nEmail: ${usuario.email}\nNombre: ${usuario.nombre} ${usuario.apellido}\nTipo: ${usuario.tipo}\nScore: ${usuario.score}/100`);
}

async function bloquearUsuario(id) {
    const razon = prompt('¿Por qué deseas bloquear este usuario?');
    if (!razon) return;

    try {
        await api.post(`/usuarios/${id}/bloquear?razon=${encodeURIComponent(razon)}`);
        mostrarAlerta('Usuario bloqueado exitosamente', 'success');
        cargarUsuarios();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al bloquear usuario', 'danger');
    }
}

async function desbloquearUsuario(id) {
    if (!confirm('¿Estás seguro de desbloquear este usuario?')) return;

    try {
        await api.post(`/usuarios/${id}/desbloquear`);
        mostrarAlerta('Usuario desbloqueado exitosamente', 'success');
        cargarUsuarios();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al desbloquear usuario', 'danger');
    }
}

// ==================== HERRAMIENTAS ACTIVAS ====================
async function cargarHerramientas() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">🛠️ Herramientas Activas</h1>
            <p class="page-subtitle">Herramientas disponibles para reservas</p>
        </div>

        <div class="tabs">
            <div class="tab active" onclick="cambiarVista('herramientas')">Activas</div>
            <div class="tab" onclick="cambiarVista('herramientasPausadas')">Pausadas</div>
        </div>

        <div class="herramientas-grid" id="herramientasGrid">
            <div class="loading" style="grid-column: 1/-1;">
                <div class="spinner"></div>
                <p class="loading-text">Cargando herramientas activas...</p>
            </div>
        </div>
    `;

    try {
        const todasHerramientas = await api.get('/herramientas');
        datosHerramientasActivas = todasHerramientas.filter(h => h.estado === 'ACTIVO');
        datosHerramientasPausadas = todasHerramientas.filter(h => h.estado === 'PAUSADO');
        
        // Actualizar contador en la pestaña
        document.querySelectorAll('.tab')[1].innerHTML = `Pausadas (${datosHerramientasPausadas.length})`;
        
        renderizarGridHerramientas(datosHerramientasActivas);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('herramientasGrid').innerHTML = `
            <div class="alert alert-danger" style="grid-column: 1/-1;">
                Error al cargar herramientas activas: ${error.message}
            </div>
        `;
    }
}

function renderizarGridHerramientas(herramientas) {
    const grid = document.getElementById('herramientasGrid');
    
    if (herramientas.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">🔍</div>
                <div class="empty-state-title">No hay herramientas activas</div>
                <div class="empty-state-text">Todas las herramientas están pausadas o inactivas</div>
            </div>
        `;
        return;
    }

    grid.innerHTML = herramientas.map(h => {
        const imagen = h.fotos && h.fotos.length > 0 ? h.fotos[0] : 'https://via.placeholder.com/300x200?text=Sin+Imagen';
        
        return `
            <div class="herramienta-card">
                <img src="${imagen}" alt="${h.nombre}" class="herramienta-image" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
                <div class="herramienta-body">
                    <div class="herramienta-title">${h.nombre}</div>
                    <div class="herramienta-brand">${h.marca || ''} ${h.modelo || ''}</div>
                    <div class="herramienta-price">
                        ${formatearMoneda(h.precioBaseDia)}
                        <span class="herramienta-price-label">/día</span>
                    </div>
                    <div class="herramienta-stats">
                        <span>⭐ ${h.calificacionPromedio || 0}</span>
                        <span>👁️ ${h.vistas || 0}</span>
                        <span>📋 ${h.totalAlquileres || 0}</span>
                    </div>
                    <div style="margin-top: 12px;">
                        <span class="badge badge-success">ACTIVO</span>
                    </div>
                </div>
                <div class="herramienta-footer">
                    <button class="btn btn-sm btn-outline" onclick="verDetalleHerramienta('${h.id}')">Ver Detalle</button>
                    <button class="btn btn-sm btn-warning" onclick="pausarHerramienta('${h.id}')">⏸️ Pausar</button>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== HERRAMIENTAS PAUSADAS ====================
async function cargarHerramientasPausadas() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">⏸️ Herramientas Pausadas</h1>
            <p class="page-subtitle">Herramientas temporalmente no disponibles</p>
        </div>

        <div class="tabs">
            <div class="tab" onclick="cambiarVista('herramientas')">Activas (${datosHerramientasActivas.length})</div>
            <div class="tab active" onclick="cambiarVista('herramientasPausadas')">Pausadas (${datosHerramientasPausadas.length})</div>
        </div>

        <div class="herramientas-grid" id="herramientasPausadasGrid">
            <div class="loading" style="grid-column: 1/-1;">
                <div class="spinner"></div>
                <p class="loading-text">Cargando herramientas pausadas...</p>
            </div>
        </div>
    `;

    try {
        // Si ya tenemos los datos, usarlos; si no, cargarlos
        if (datosHerramientasPausadas.length === 0 && datosHerramientasActivas.length === 0) {
            const todasHerramientas = await api.get('/herramientas');
            datosHerramientasActivas = todasHerramientas.filter(h => h.estado === 'ACTIVO');
            datosHerramientasPausadas = todasHerramientas.filter(h => h.estado === 'PAUSADO');
        }
        
        renderizarGridHerramientasPausadas(datosHerramientasPausadas);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('herramientasPausadasGrid').innerHTML = `
            <div class="alert alert-danger" style="grid-column: 1/-1;">
                Error al cargar herramientas pausadas: ${error.message}
            </div>
        `;
    }
}

function renderizarGridHerramientasPausadas(herramientas) {
    const grid = document.getElementById('herramientasPausadasGrid');
    
    if (herramientas.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">⏸️</div>
                <div class="empty-state-title">No hay herramientas pausadas</div>
                <div class="empty-state-text">Todas las herramientas están activas</div>
            </div>
        `;
        return;
    }

    grid.innerHTML = herramientas.map(h => {
        const imagen = h.fotos && h.fotos.length > 0 ? h.fotos[0] : 'https://via.placeholder.com/300x200?text=Sin+Imagen';
        
        return `
            <div class="herramienta-card herramienta-pausada">
                <img src="${imagen}" alt="${h.nombre}" class="herramienta-image" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
                <div class="herramienta-body">
                    <div class="herramienta-title">${h.nombre}</div>
                    <div class="herramienta-brand">${h.marca || ''} ${h.modelo || ''}</div>
                    <div class="herramienta-price">
                        ${formatearMoneda(h.precioBaseDia)}
                        <span class="herramienta-price-label">/día</span>
                    </div>
                    <div class="herramienta-stats">
                        <span>⭐ ${h.calificacionPromedio || 0}</span>
                        <span>👁️ ${h.vistas || 0}</span>
                        <span>📋 ${h.totalAlquileres || 0}</span>
                    </div>
                    <div style="margin-top: 12px;">
                        <span class="badge badge-warning">PAUSADO</span>
                    </div>
                    <div style="margin-top: 8px; padding: 8px; background: #fff3cd; border-radius: 4px; font-size: 12px;">
                        ⚠️ No disponible para reservas
                    </div>
                </div>
                <div class="herramienta-footer">
                    <button class="btn btn-sm btn-outline" onclick="verDetalleHerramienta('${h.id}')">Ver Detalle</button>
                    <button class="btn btn-sm btn-success" onclick="activarHerramienta('${h.id}')">▶️ Activar</button>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== FUNCIONES COMUNES PARA HERRAMIENTAS ====================
async function verDetalleHerramienta(id) {
    try {
        console.log('Cargando detalle de herramienta ID:', id);
        
        const herramienta = await api.get(`/herramientas/${id}`);
        console.log('Herramienta cargada:', herramienta);
        
        alert(`Detalle de herramienta:\nNombre: ${herramienta.nombre}\nPrecio: ${formatearMoneda(herramienta.precioBaseDia)}/día\nEstado: ${herramienta.estado}\nProveedor ID: ${herramienta.proveedorId || 'N/A'}`);
        
    } catch (error) {
        console.error('Error cargando detalle:', error);
        mostrarAlerta('Error al cargar los detalles: ' + error.message, 'danger');
    }
}

async function pausarHerramienta(id) {
    if (!confirm('¿Estás seguro de pausar esta herramienta? No estará disponible para reservas.')) return;
    
    try {
        await api.patch(`/herramientas/${id}/estado?estado=PAUSADO`);
        mostrarAlerta('Herramienta pausada exitosamente', 'success');
        
        // Recargar la vista actual
        if (vistaActual === 'herramientas') {
            await cargarHerramientas();
        } else if (vistaActual === 'herramientasPausadas') {
            await cargarHerramientasPausadas();
        }
        
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al pausar herramienta: ' + error.message, 'danger');
    }
}

async function activarHerramienta(id) {
    if (!confirm('¿Estás seguro de activar esta herramienta? Estará disponible para reservas.')) return;
    
    try {
        await api.patch(`/herramientas/${id}/estado?estado=ACTIVO`);
        mostrarAlerta('Herramienta activada exitosamente', 'success');
        
        // Recargar la vista actual
        if (vistaActual === 'herramientas') {
            await cargarHerramientas();
        } else if (vistaActual === 'herramientasPausadas') {
            await cargarHerramientasPausadas();
        }
        
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al activar herramienta: ' + error.message, 'danger');
    }
}

// ==================== RESERVAS ====================
async function cargarReservas() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">📋 Gestión de Reservas</h1>
        </div>

        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>#Reserva</th>
                        <th>Cliente</th>
                        <th>Herramienta</th>
                        <th>Fechas</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody id="reservasTableBody">
                    <tr>
                        <td colspan="6" class="text-center">
                            <div class="loading">
                                <div class="spinner"></div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    try {
        datosReservas = await api.get('/reservas');
        renderizarTablaReservas(datosReservas);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('reservasTableBody').innerHTML = `
            <tr><td colspan="6" class="text-center">
                <div class="alert alert-danger">Error al cargar reservas</div>
            </td></tr>
        `;
    }
}

function renderizarTablaReservas(reservas) {
    const tbody = document.getElementById('reservasTableBody');
    
    if (reservas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay reservas</td></tr>';
        return;
    }

    tbody.innerHTML = reservas.map(r => `
        <tr>
            <td><strong>${r.numeroReserva}</strong></td>
            <td>Cliente ID: ${r.clienteId}</td>
            <td>Herramienta ID: ${r.herramientaId}</td>
            <td>${formatearFecha(r.fechaInicio)} - ${formatearFecha(r.fechaFin)}</td>
            <td>${obtenerBadgeEstado(r.estado, 'RESERVA')}</td>
            <td class="table-actions">
                <button class="btn btn-sm btn-outline" onclick="verDetalleReserva('${r.id}')">👁️</button>
            </td>
        </tr>
    `).join('');
}

// ==================== MODAL DE DETALLE DE RESERVA (ADMIN) ====================
async function verDetalleReserva(id) {
    try {
        const reserva = await api.get(`/reservas/${id}`);
        const herramienta = await api.get(`/herramientas/${reserva.herramientaId}`);
        const cliente = await api.get(`/usuarios/${reserva.clienteId}`);
        
        let detalleReserva = null;
        try {
            detalleReserva = await api.get(`/detalle-reserva/reserva/${id}`);
        } catch (error) {
            console.warn('No se encontró detalle financiero');
        }

        const modalHTML = `
            <div class="modal active" id="modalDetalleReservaAdmin">
                <div class="modal-content" style="max-width: 900px;">
                    <div class="modal-header">
                        <h3 class="modal-title">📋 Detalle de Reserva #${reserva.numeroReserva}</h3>
                        <button class="modal-close" onclick="cerrarModalDetalleReservaAdmin()">✖</button>
                    </div>
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                            <!-- Columna Izquierda -->
                            <div>
                                <h4 style="border-bottom: 2px solid #ff8c00; padding-bottom: 10px; margin-bottom: 15px;">
                                    👤 Cliente
                                </h4>
                                <table class="table-details">
                                    <tr>
                                        <td>Nombre:</td>
                                        <td><strong>${cliente.nombre} ${cliente.apellido}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Email:</td>
                                        <td>${cliente.email}</td>
                                    </tr>
                                    <tr>
                                        <td>Teléfono:</td>
                                        <td>${cliente.telefono || 'No registrado'}</td>
                                    </tr>
                                    <tr>
                                        <td>Score:</td>
                                        <td><strong>${cliente.score}/100</strong></td>
                                    </tr>
                                </table>

                                <h4 style="border-bottom: 2px solid #ff8c00; padding-bottom: 10px; margin: 20px 0 15px 0;">
                                    🛠️ Herramienta
                                </h4>
                                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                                    <img src="${herramienta.fotos && herramienta.fotos[0] || 'https://via.placeholder.com/300x150'}"
                                         style="width: 100%; border-radius: 6px; margin-bottom: 10px;"
                                         onerror="this.src='https://via.placeholder.com/300x150'">
                                    <p style="margin: 0; font-weight: 600; font-size: 16px;">${herramienta.nombre}</p>
                                    <p style="margin: 5px 0 0 0; color: #6c757d; font-size: 14px;">
                                        ${herramienta.marca || ''} ${herramienta.modelo || ''}
                                    </p>
                                </div>

                                <h4 style="border-bottom: 2px solid #ff8c00; padding-bottom: 10px; margin: 20px 0 15px 0;">
                                    📅 Fechas
                                </h4>
                                <table class="table-details">
                                    <tr>
                                        <td>Inicio:</td>
                                        <td><strong>${formatearFecha(reserva.fechaInicio)}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Fin:</td>
                                        <td><strong>${formatearFecha(reserva.fechaFin)}</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Días totales:</td>
                                        <td><strong>${reserva.diasTotales} día(s)</strong></td>
                                    </tr>
                                    <tr>
                                        <td>Creada:</td>
                                        <td>${formatearFechaHora(reserva.createdAt)}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Columna Derecha -->
                            <div>
                                <h4 style="border-bottom: 2px solid #ff8c00; padding-bottom: 10px; margin-bottom: 15px;">
                                    ℹ️ Estado
                                </h4>
                                <div style="margin-bottom: 20px;">
                                    ${obtenerBadgeEstado(reserva.estado, 'RESERVA')}
                                </div>

                                <h4 style="border-bottom: 2px solid #ff8c00; padding-bottom: 10px; margin: 20px 0 15px 0;">
                                    📍 Entrega
                                </h4>
                                <table class="table-details">
                                    <tr>
                                        <td>Dirección:</td>
                                        <td>${reserva.direccionEntrega || 'No especificada'}</td>
                                    </tr>
                                    <tr>
                                        <td>Ciudad:</td>
                                        <td>${reserva.ciudadEntrega || 'No especificada'}</td>
                                    </tr>
                                    ${reserva.trackingEnvioIda ? `
                                        <tr>
                                            <td>Tracking:</td>
                                            <td><code style="background: #f8f9fa; padding: 4px 8px; border-radius: 4px;">
                                                ${reserva.trackingEnvioIda}
                                            </code></td>
                                        </tr>
                                    ` : ''}
                                </table>

                                ${detalleReserva ? `
                                    <h4 style="border-bottom: 2px solid #ff8c00; padding-bottom: 10px; margin: 20px 0 15px 0;">
                                        💰 Detalle Financiero
                                    </h4>
                                    <table class="table-details">
                                        <tr>
                                            <td>Precio/día:</td>
                                            <td>${formatearMoneda(detalleReserva.precioDiaSnapshot)}</td>
                                        </tr>
                                        <tr>
                                            <td>Subtotal alquiler:</td>
                                            <td>${formatearMoneda(detalleReserva.subtotalAlquiler)}</td>
                                        </tr>
                                        <tr>
                                            <td>Seguro:</td>
                                            <td>${formatearMoneda(detalleReserva.costoSeguro)}</td>
                                        </tr>
                                        ${detalleReserva.descuento > 0 ? `
                                            <tr>
                                                <td>Descuento:</td>
                                                <td style="color: #28a745;">
                                                    -${formatearMoneda(detalleReserva.descuento)}
                                                    ${detalleReserva.codigoCupon ? `<br><small>(${detalleReserva.codigoCupon})</small>` : ''}
                                                </td>
                                            </tr>
                                        ` : ''}
                                        <tr style="border-top: 2px solid #dee2e6; background: #fff3cd;">
                                            <td><strong>Total pagado:</strong></td>
                                            <td><strong style="color: #ff8c00; font-size: 18px;">
                                                ${formatearMoneda(detalleReserva.totalPagado)}
                                            </strong></td>
                                        </tr>
                                        <tr style="background: #d4edda;">
                                            <td><strong>Comisión admin:</strong></td>
                                            <td><strong style="color: #28a745;">
                                                ${formatearMoneda(detalleReserva.comisionAdmin)} 
                                                (${detalleReserva.porcentajeComision}%)
                                            </strong></td>
                                        </tr>
                                    </table>
                                ` : ''}

                                ${reserva.notasCliente || reserva.notasProveedor ? `
                                    <h4 style="border-bottom: 2px solid #ff8c00; padding-bottom: 10px; margin: 20px 0 15px 0;">
                                        📝 Notas
                                    </h4>
                                    ${reserva.notasCliente ? `
                                        <div style="background: #e7f3ff; padding: 12px; border-radius: 6px; margin-bottom: 10px;">
                                            <strong style="color: #0056b3;">Cliente:</strong>
                                            <p style="margin: 5px 0 0 0; font-size: 14px;">${reserva.notasCliente}</p>
                                        </div>
                                    ` : ''}
                                    ${reserva.notasProveedor ? `
                                        <div style="background: #fff3cd; padding: 12px; border-radius: 6px;">
                                            <strong style="color: #856404;">Proveedor:</strong>
                                            <p style="margin: 5px 0 0 0; font-size: 14px;">${reserva.notasProveedor}</p>
                                        </div>
                                    ` : ''}
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="cerrarModalDetalleReservaAdmin()">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al cargar detalle de reserva: ' + error.message, 'danger');
    }
}

function cerrarModalDetalleReservaAdmin() {
    const modal = document.getElementById('modalDetalleReservaAdmin');
    if (modal) modal.remove();
}

// ==================== PAGOS ====================
async function cargarPagos() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">💰 Gestión de Pagos</h1>
        </div>

        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>#Transacción</th>
                        <th>Cliente</th>
                        <th>Monto</th>
                        <th>Método</th>
                        <th>Estado</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody id="pagosTableBody">
                    <tr>
                        <td colspan="6" class="text-center">
                            <div class="loading">
                                <div class="spinner"></div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    try {
        datosPagos = await api.get('/pagos');
        renderizarTablaPagos(datosPagos);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('pagosTableBody').innerHTML = `
            <tr><td colspan="6" class="text-center">
                <div class="alert alert-danger">Error al cargar pagos</div>
            </td></tr>
        `;
    }
}

function renderizarTablaPagos(pagos) {
    const tbody = document.getElementById('pagosTableBody');
    tbody.innerHTML = `
        <tr><td colspan="6" class="text-center">No hay pagos registrados</td></tr>
    `;
}