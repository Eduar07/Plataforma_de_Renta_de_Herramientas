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
                    <a href="#" onclick="cambiarVista('herramientasPausadas')" style="color: #0c5460; text-decoration: underline;">
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

    document.getElementById('usuarioModalBody').innerHTML = `
        <div style="display: grid; gap: 16px;">
            <div><strong>Email:</strong> ${usuario.email}</div>
            <div><strong>Nombre:</strong> ${usuario.nombre} ${usuario.apellido}</div>
            <div><strong>Tipo:</strong> <span class="badge badge-info">${usuario.tipo}</span></div>
            <div><strong>Estado:</strong> <span class="badge badge-${usuario.estado === 'ACTIVO' ? 'success' : 'danger'}">${usuario.estado}</span></div>
            <div><strong>Teléfono:</strong> ${usuario.telefono || '-'}</div>
            <div><strong>Documento:</strong> ${usuario.documentoTipo} ${usuario.documentoNumero}</div>
            <div><strong>Dirección:</strong> ${usuario.direccion || '-'}</div>
            <div><strong>Ciudad:</strong> ${usuario.ciudad || '-'}</div>
            <div><strong>Score:</strong> ${usuario.score}/100</div>
            <div><strong>Advertencias:</strong> ${usuario.advertencias || 0}/5</div>
            ${usuario.razonBloqueo ? `
                <div class="alert alert-danger">
                    <strong>Razón de Bloqueo:</strong> ${usuario.razonBloqueo}
                </div>
            ` : ''}
        </div>
    `;

    abrirModal('usuarioModal');
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
            <div class="tab active" onclick="cambiarVista('herramientas')">Activas (${datosHerramientasActivas.length})</div>
            <div class="tab" onclick="cambiarVista('herramientasPausadas')">Pausadas (${datosHerramientasPausadas.length})</div>
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
        if (datosHerramientasPausadas.length === 0) {
            const todasHerramientas = await api.get('/herramientas');
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
        
        let proveedorInfo = '';
        if (herramienta.proveedorId) {
            try {
                const proveedor = await api.get(`/usuarios/${herramienta.proveedorId}`);
                proveedorInfo = `
                    <div style="margin-bottom: 20px;">
                        <h4>Proveedor</h4>
                        <table class="table-details">
                            <tr>
                                <td><strong>Nombre:</strong></td>
                                <td>${proveedor.nombre} ${proveedor.apellido}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>${proveedor.email}</td>
                            </tr>
                            <tr>
                                <td><strong>Teléfono:</strong></td>
                                <td>${proveedor.telefono || '-'}</td>
                            </tr>
                            <tr>
                                <td><strong>Score:</strong></td>
                                <td>${proveedor.score || 0}/100</td>
                            </tr>
                        </table>
                    </div>
                `;
            } catch (error) {
                console.error('Error cargando proveedor:', error);
                proveedorInfo = `
                    <div style="margin-bottom: 20px;">
                        <h4>Proveedor</h4>
                        <p>Error al cargar información del proveedor</p>
                    </div>
                `;
            }
        }

        const modalBody = `
            <div class="herramienta-detalle-admin">
                <div style="display: grid; grid-template-columns: 300px 1fr; gap: 30px;">
                    <!-- Columna izquierda: Imágenes -->
                    <div>
                        <div class="herramienta-imagen-principal">
                            ${herramienta.fotos && herramienta.fotos.length > 0 ? 
                                `<img src="${herramienta.fotos[0]}" alt="${herramienta.nombre}" 
                                      style="width: 100%; border-radius: 8px;">` :
                                `<div style="width: 100%; height: 200px; background: #f8f9fa; 
                                           border-radius: 8px; display: flex; align-items: center; 
                                           justify-content: center; color: #6c757d;">
                                    Sin imagen
                                </div>`
                            }
                        </div>
                        
                        ${herramienta.fotos && herramienta.fotos.length > 1 ? `
                            <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                                ${herramienta.fotos.slice(1).map(foto => `
                                    <img src="${foto}" alt="Miniatura" 
                                         style="width: 60px; height: 60px; object-fit: cover; 
                                                border-radius: 4px; cursor: pointer;"
                                         onclick="cambiarImagenPrincipal('${foto}')">
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- Columna derecha: Información -->
                    <div>
                        <h3 style="margin: 0 0 10px 0;">${herramienta.nombre}</h3>
                        <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                            <span class="badge badge-${herramienta.estado === 'ACTIVO' ? 'success' : 
                                                      herramienta.estado === 'PAUSADO' ? 'warning' : 'danger'}">
                                ${herramienta.estado}
                            </span>
                            <span style="color: #6c757d;">ID: ${herramienta.id}</span>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <h4>Información Básica</h4>
                            <table class="table-details">
                                <tr>
                                    <td><strong>Precio por día:</strong></td>
                                    <td>${formatearMoneda(herramienta.precioBaseDia)}</td>
                                </tr>
                                <tr>
                                    <td><strong>Categoría:</strong></td>
                                    <td>${herramienta.categoriaNombre || 'Sin categoría'}</td>
                                </tr>
                                <tr>
                                    <td><strong>Marca/Modelo:</strong></td>
                                    <td>${herramienta.marca || '-'} ${herramienta.modelo || ''}</td>
                                </tr>
                                <tr>
                                    <td><strong>Envío incluido:</strong></td>
                                    <td>${herramienta.envioIncluido ? '✅ Sí' : '❌ No'}</td>
                                </tr>
                                <tr>
                                    <td><strong>Garantía:</strong></td>
                                    <td>${herramienta.garantia ? '✅ Sí' : '❌ No'}</td>
                                </tr>
                            </table>
                        </div>
                        
                        ${proveedorInfo}
                        
                        <div style="margin-bottom: 20px;">
                            <h4>Estadísticas</h4>
                            <table class="table-details">
                                <tr>
                                    <td><strong>Total reservas:</strong></td>
                                    <td>${herramienta.totalAlquileres || 0}</td>
                                </tr>
                                <tr>
                                    <td><strong>Calificación:</strong></td>
                                    <td>⭐ ${herramienta.calificacionPromedio || 0} (${herramienta.totalCalificaciones || 0} reseñas)</td>
                                </tr>
                                <tr>
                                    <td><strong>Vistas:</strong></td>
                                    <td>${herramienta.vistas || 0}</td>
                                </tr>
                                <tr>
                                    <td><strong>Fecha de creación:</strong></td>
                                    <td>${formatearFecha(herramienta.created_at)}</td>
                                </tr>
                            </table>
                        </div>
                        
                        <div>
                            <h4>Descripción</h4>
                            <p style="white-space: pre-line;">${herramienta.descripcion || 'Sin descripción'}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Características -->
                ${herramienta.caracteristicas && herramienta.caracteristicas.length > 0 ? `
                    <div style="margin-top: 30px;">
                        <h4>Características</h4>
                        <ul>
                            ${herramienta.caracteristicas.map(c => `<li>${c}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                <!-- Acciones -->
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                    <div style="display: flex; gap: 15px;">
                        <button class="btn btn-outline" onclick="verReservasHerramienta('${herramienta.id}')">
                            📋 Ver Reservas
                        </button>
                        <button class="btn btn-outline" onclick="verCalificacionesHerramienta('${herramienta.id}')">
                            ⭐ Ver Calificaciones
                        </button>
                        ${herramienta.estado === 'ACTIVO' ? 
                            `<button class="btn btn-warning" onclick="pausarHerramienta('${herramienta.id}')">
                                ⏸️ Pausar
                            </button>` : 
                            `<button class="btn btn-success" onclick="activarHerramienta('${herramienta.id}')">
                                ▶️ Activar
                            </button>`
                        }
                    </div>
                </div>
            </div>
        `;
        
        // Crear modal si no existe
        if (!document.getElementById('modalDetalleHerramienta')) {
            const modal = document.createElement('div');
            modal.id = 'modalDetalleHerramienta';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Detalle de Herramienta</h3>
                        <button class="modal-close" onclick="cerrarModal('modalDetalleHerramienta')">✖</button>
                    </div>
                    <div class="modal-body" id="modalDetalleHerramientaBody"></div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="cerrarModal('modalDetalleHerramienta')">Cerrar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        document.getElementById('modalDetalleHerramientaBody').innerHTML = modalBody;
        abrirModal('modalDetalleHerramienta');
        
    } catch (error) {
        console.error('Error cargando detalle:', error);
        mostrarAlerta('Error al cargar los detalles: ' + error.message, 'danger');
    }
}

function cambiarImagenPrincipal(url) {
    const imgPrincipal = document.querySelector('.herramienta-imagen-principal img');
    if (imgPrincipal) {
        imgPrincipal.src = url;
    }
}

function verReservasHerramienta(herramientaId) {
    alert('Funcionalidad de ver reservas próximamente para herramienta: ' + herramientaId);
}

function verCalificacionesHerramienta(herramientaId) {
    alert('Funcionalidad de ver calificaciones próximamente para herramienta: ' + herramientaId);
}

async function pausarHerramienta(id) {
    if (!confirm('¿Estás seguro de pausar esta herramienta? No estará disponible para reservas.')) return;
    
    try {
        await api.patch(`/herramientas/${id}/estado?estado=PAUSADO`);
        mostrarAlerta('Herramienta pausada exitosamente', 'success');
        
        // Actualizar vistas
        if (vistaActual === 'herramientas') {
            await cargarHerramientas();
        } else if (vistaActual === 'herramientasPausadas') {
            await cargarHerramientasPausadas();
        }
        
        // Cerrar modal si está abierto
        cerrarModal('modalDetalleHerramienta');
        
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
        
        // Actualizar vistas
        if (vistaActual === 'herramientas') {
            await cargarHerramientas();
        } else if (vistaActual === 'herramientasPausadas') {
            await cargarHerramientasPausadas();
        }
        
        // Cerrar modal si está abierto
        cerrarModal('modalDetalleHerramienta');
        
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

function verDetalleReserva(id) {
    alert('Ver detalle de reserva: ' + id);
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
    
    if (pagos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay pagos</td></tr>';
        return;
    }

    tbody.innerHTML = pagos.map(p => `
        <tr>
            <td><strong>${p.numeroTransaccion}</strong></td>
            <td>Cliente ID: ${p.clienteId}</td>
            <td>${formatearMoneda(p.monto)}</td>
            <td>${p.metodo}</td>
            <td>${obtenerBadgeEstado(p.estado, 'PAGO')}</td>
            <td>${formatearFechaHora(p.created_at)}</td>
        </tr>
    `).join('');
}