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

async function verDetalleUsuario(id) {
    try {
        console.log('Cargando detalle de usuario ID:', id);
        
        const usuario = await api.get(`/usuarios/${id}`);
        console.log('Usuario cargado:', usuario);
        
        // Obtener estadísticas adicionales
        let reservasInfo = '';
        try {
            if (usuario.tipo === 'CLIENTE') {
                const reservas = await api.get(`/reservas/cliente/${id}`);
                const reservasActivas = reservas.filter(r => 
                    !['COMPLETADA', 'CANCELADA_CLIENTE', 'CANCELADA_PROVEEDOR', 'CANCELADA_SISTEMA'].includes(r.estado)
                ).length;
                const reservasCompletadas = reservas.filter(r => r.estado === 'COMPLETADA').length;
                
                reservasInfo = `
                    <div style="background: #e7f3ff; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 12px 0; font-size: 16px;">📋 Estadísticas de Reservas</h4>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #007bff;">${reservas.length}</div>
                                <div style="font-size: 12px; color: #6c757d;">Total</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #28a745;">${reservasActivas}</div>
                                <div style="font-size: 12px; color: #6c757d;">Activas</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #ffc107;">${reservasCompletadas}</div>
                                <div style="font-size: 12px; color: #6c757d;">Completadas</div>
                            </div>
                        </div>
                    </div>
                `;
            } else if (usuario.tipo === 'PROVEEDOR') {
                const herramientas = await api.get('/herramientas');
                const herramientasProveedor = herramientas.filter(h => h.proveedorId === id);
                const herramientasActivas = herramientasProveedor.filter(h => h.estado === 'ACTIVO').length;
                const herramientasPausadas = herramientasProveedor.filter(h => h.estado === 'PAUSADO').length;
                
                reservasInfo = `
                    <div style="background: #e7f3ff; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 12px 0; font-size: 16px;">🛠️ Estadísticas de Herramientas</h4>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #007bff;">${herramientasProveedor.length}</div>
                                <div style="font-size: 12px; color: #6c757d;">Total</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #28a745;">${herramientasActivas}</div>
                                <div style="font-size: 12px; color: #6c757d;">Activas</div>
                            </div>
                            <div style="text-align: center;">
                                <div style="font-size: 24px; font-weight: bold; color: #ffc107;">${herramientasPausadas}</div>
                                <div style="font-size: 12px; color: #6c757d;">Pausadas</div>
                            </div>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
            reservasInfo = `
                <div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                    <h4 style="margin: 0 0 12px 0; font-size: 16px;">📊 Estadísticas</h4>
                    <p style="margin: 0; color: #856404; font-size: 14px;">
                        ⚠️ No se pudieron cargar las estadísticas
                    </p>
                </div>
            `;
        }

        const modalHTML = `
            <div class="modal active" id="modalDetalleUsuarioAdmin">
                <div class="modal-content" style="max-width: 900px;">
                    <div class="modal-header">
                        <h3 class="modal-title">👤 Detalle de Usuario (Admin)</h3>
                        <button class="modal-close" onclick="cerrarModalDetalleUsuarioAdmin()">✖</button>
                    </div>
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 350px 1fr; gap: 30px;">
                            <!-- Columna izquierda: Info básica -->
                            <div>
                                <div style="width: 100%; margin-bottom: 15px;">
                                    <div style="width: 120px; height: 120px; background: #007bff; 
                                                 border-radius: 50%; display: flex; align-items: center; 
                                                 justify-content: center; margin: 0 auto 20px auto;">
                                        <span style="font-size: 48px; color: white; font-weight: bold;">
                                            ${usuario.nombre.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <h2 style="text-align: center; margin: 0 0 10px 0; font-size: 28px;">
                                        ${usuario.nombre} ${usuario.apellido}
                                    </h2>
                                    <div style="text-align: center;">
                                        <span class="badge badge-${usuario.tipo === 'ADMIN' ? 'danger' : usuario.tipo === 'PROVEEDOR' ? 'warning' : 'info'}">
                                            ${usuario.tipo}
                                        </span>
                                        <span class="badge badge-${usuario.estado === 'ACTIVO' ? 'success' : 'danger'}">
                                            ${usuario.estado}
                                        </span>
                                    </div>
                                </div>
                                
                                <div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                                    <div style="font-size: 14px; color: #856404; margin-bottom: 8px;">Score del Usuario</div>
                                    <div style="font-size: 32px; font-weight: bold; color: #ff8c00; text-align: center;">
                                        ${usuario.score}/100
                                    </div>
                                    <div style="font-size: 14px; margin-top: 8px; text-align: center;">
                                        ${usuario.advertencias || 0} advertencia(s) | ${usuario.sanciones || 0} sanción(es)
                                    </div>
                                </div>
                                
                                <div style="margin-top: 20px;">
                                    <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #6c757d;">⚡ Acciones Rápidas</h4>
                                    <div style="display: flex; flex-direction: column; gap: 10px;">
                                        ${usuario.estado === 'ACTIVO' 
                                            ? `<button class="btn btn-danger btn-sm" onclick="bloquearUsuarioModal('${usuario.id}')">
                                                🔒 Bloquear Usuario
                                               </button>`
                                            : `<button class="btn btn-success btn-sm" onclick="desbloquearUsuarioModal('${usuario.id}')">
                                                🔓 Desbloquear Usuario
                                               </button>`
                                        }
                                        <button class="btn btn-outline btn-sm" onclick="enviarNotificacionUsuario('${usuario.id}')">
                                            📨 Enviar Notificación
                                        </button>
                                        <button class="btn btn-outline btn-sm" onclick="verHistorialUsuario('${usuario.id}')">
                                            📊 Ver Historial
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Columna derecha: Información detallada -->
                            <div>
                                ${reservasInfo}
                                
                                <div style="margin-bottom: 20px;">
                                    <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #6c757d;">📋 Información Personal</h4>
                                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                                        <div>
                                            <strong>Email:</strong><br>
                                            <a href="mailto:${usuario.email}" style="color: #007bff;">
                                                ${usuario.email}
                                            </a>
                                        </div>
                                        <div>
                                            <strong>Teléfono:</strong><br>
                                            ${usuario.telefono || 'No registrado'}
                                        </div>
                                        <div>
                                            <strong>Documento:</strong><br>
                                            ${usuario.documentoTipo || 'N/A'}: ${usuario.documentoNumero || 'N/A'}
                                        </div>
                                        <div>
                                            <strong>ID Usuario:</strong><br>
                                            <code style="font-size: 12px;">${usuario.id.substring(0, 8)}...</code>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #6c757d;">📍 Dirección</h4>
                                    <div style="padding: 12px; background: #f8f9fa; border-radius: 6px;">
                                        ${usuario.direccion ? `
                                            <p style="margin: 0 0 8px 0;"><strong>Dirección:</strong> ${usuario.direccion}</p>
                                        ` : ''}
                                        ${usuario.ciudad ? `
                                            <p style="margin: 0 0 8px 0;"><strong>Ciudad:</strong> ${usuario.ciudad}</p>
                                        ` : ''}
                                        ${usuario.departamento ? `
                                            <p style="margin: 0;"><strong>Departamento:</strong> ${usuario.departamento}</p>
                                        ` : ''}
                                        ${!usuario.direccion && !usuario.ciudad && !usuario.departamento ? 
                                            '<p style="margin: 0; color: #6c757d;">No hay información de dirección registrada</p>' : ''
                                        }
                                    </div>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #6c757d;">📅 Información de Cuenta</h4>
                                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                                        <div>
                                            <strong>Fecha de registro:</strong><br>
                                            ${formatearFechaHora(usuario.createdAt)}
                                        </div>
                                        <div>
                                            <strong>Última actualización:</strong><br>
                                            ${formatearFechaHora(usuario.updatedAt) || 'No disponible'}
                                        </div>
                                        <div>
                                            <strong>Verificación email:</strong><br>
                                            ${usuario.emailVerificado ? '✅ Verificado' : '❌ No verificado'}
                                        </div>
                                        <div>
                                            <strong>Teléfono verificado:</strong><br>
                                            ${usuario.telefonoVerificado ? '✅ Verificado' : '❌ No verificado'}
                                        </div>
                                    </div>
                                </div>
                                
                                ${usuario.notas || usuario.observaciones ? `
                                    <div style="margin-bottom: 20px;">
                                        <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #6c757d;">📝 Notas y Observaciones</h4>
                                        <div style="padding: 12px; background: #f8f9fa; border-radius: 6px;">
                                            ${usuario.notas ? `
                                                <p style="margin: 0 0 8px 0;">
                                                    <strong>Notas internas:</strong><br>
                                                    ${usuario.notas}
                                                </p>
                                            ` : ''}
                                            ${usuario.observaciones ? `
                                                <p style="margin: 0;">
                                                    <strong>Observaciones:</strong><br>
                                                    ${usuario.observaciones}
                                                </p>
                                            ` : ''}
                                        </div>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="cerrarModalDetalleUsuarioAdmin()">Cerrar</button>
                        <button class="btn btn-primary" onclick="abrirModalEditarUsuario('${usuario.id}')">
                            ✏️ Editar Usuario
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Eliminar modal anterior si existe
        const modalAnterior = document.getElementById('modalDetalleUsuarioAdmin');
        if (modalAnterior) {
            modalAnterior.remove();
        }

        // Agregar modal al body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

    } catch (error) {
        console.error('Error cargando detalle:', error);
        mostrarAlerta('Error al cargar los detalles del usuario: ' + error.message, 'danger');
    }
}

function cerrarModalDetalleUsuarioAdmin() {
    const modal = document.getElementById('modalDetalleUsuarioAdmin');
    if (modal) {
        modal.remove();
    }
}

// Funciones auxiliares para las acciones en el modal
async function bloquearUsuarioModal(id) {
    const razon = prompt('¿Por qué deseas bloquear este usuario?');
    if (!razon) return;

    try {
        await api.post(`/usuarios/${id}/bloquear?razon=${encodeURIComponent(razon)}`);
        mostrarAlerta('Usuario bloqueado exitosamente', 'success');
        cerrarModalDetalleUsuarioAdmin();
        cargarUsuarios(); // Recargar la lista
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al bloquear usuario', 'danger');
    }
}

async function desbloquearUsuarioModal(id) {
    if (!confirm('¿Estás seguro de desbloquear este usuario?')) return;

    try {
        await api.post(`/usuarios/${id}/desbloquear`);
        mostrarAlerta('Usuario desbloqueado exitosamente', 'success');
        cerrarModalDetalleUsuarioAdmin();
        cargarUsuarios(); // Recargar la lista
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al desbloquear usuario', 'danger');
    }
}

function enviarNotificacionUsuario(id) {
    const mensaje = prompt('Escribe el mensaje de notificación:');
    if (!mensaje) return;

    mostrarAlerta('Función de notificación en desarrollo', 'info');
    // Aquí implementarías la lógica para enviar notificación
}

function verHistorialUsuario(id) {
    mostrarAlerta('Función de historial en desarrollo', 'info');
}

function abrirModalEditarUsuario(id) {
    mostrarAlerta('Función de edición en desarrollo', 'info');
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
        
        // Obtener información del proveedor
        let proveedorInfo = '';
        if (herramienta.proveedorId) {
            try {
                const proveedor = await api.get(`/usuarios/${herramienta.proveedorId}`);
                proveedorInfo = `
                    <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 12px 0; font-size: 16px;">👤 Proveedor</h4>
                        <p style="margin: 0;"><strong>${proveedor.nombre} ${proveedor.apellido}</strong></p>
                        <p style="margin: 4px 0 0 0; color: #6c757d; font-size: 14px;">
                            Email: ${proveedor.email}<br>
                            Score: ${proveedor.score}/100 | Tel: ${proveedor.telefono || 'No disponible'}<br>
                            Estado: <span class="badge badge-${proveedor.estado === 'ACTIVO' ? 'success' : 'danger'}">${proveedor.estado}</span>
                        </p>
                    </div>
                `;
            } catch (error) {
                console.error('Error cargando proveedor:', error);
                proveedorInfo = `
                    <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 12px 0; font-size: 16px;">👤 Proveedor</h4>
                        <p style="margin: 0; color: #6c757d;">ID: ${herramienta.proveedorId}</p>
                    </div>
                `;
            }
        }

        // Estadísticas adicionales para admin
        const estadisticasAdmin = `
            <div style="background: #e7f3ff; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin: 0 0 12px 0; font-size: 16px;">📊 Estadísticas</h4>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #007bff;">${herramienta.totalAlquileres || 0}</div>
                        <div style="font-size: 12px; color: #6c757d;">Total Alquileres</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #28a745;">${herramienta.vistas || 0}</div>
                        <div style="font-size: 12px; color: #6c757d;">Vistas</div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 24px; font-weight: bold; color: #ffc107;">${herramienta.calificacionPromedio || 0}</div>
                        <div style="font-size: 12px; color: #6c757d;">Calificación</div>
                    </div>
                </div>
            </div>
        `;

        const modalHTML = `
            <div class="modal active" id="modalDetalleHerramientaAdmin">
                <div class="modal-content" style="max-width: 900px;">
                    <div class="modal-header">
                        <h3 class="modal-title">🛠️ Detalle de Herramienta (Admin)</h3>
                        <button class="modal-close" onclick="cerrarModalDetalleHerramientaAdmin()">✖</button>
                    </div>
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 350px 1fr; gap: 30px;">
                            <!-- Columna izquierda: Imagen e info básica -->
                            <div>
                                <div style="width: 100%; margin-bottom: 15px;">
                                    ${herramienta.fotos && herramienta.fotos.length > 0 ? 
                                        `<img src="${herramienta.fotos[0]}" alt="${herramienta.nombre}" 
                                              style="width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"
                                              onerror="this.src='https://via.placeholder.com/350x250?text=Sin+Imagen'">` :
                                        `<div style="width: 100%; height: 250px; background: #f8f9fa; 
                                                   border-radius: 8px; display: flex; align-items: center; 
                                                   justify-content: center; color: #6c757d;">
                                            Sin imagen
                                        </div>`
                                    }
                                </div>
                                
                                ${proveedorInfo}
                                
                                <div style="background: #fff3cd; padding: 16px; border-radius: 8px;">
                                    <div style="font-size: 14px; color: #856404; margin-bottom: 8px;">Precio Base</div>
                                    <div style="font-size: 32px; font-weight: bold; color: #ff8c00;">
                                        ${formatearMoneda(herramienta.precioBaseDia)}
                                        <span style="font-size: 16px; font-weight: normal; color: #6c757d;">/día</span>
                                    </div>
                                    <div style="font-size: 14px; margin-top: 8px;">
                                        ${herramienta.envioIncluido ? '📦 Envío incluido' : '🚫 Envío no incluido'} | 
                                        ${herramienta.estado === 'ACTIVO' ? '✅ Activo' : '⏸️ Pausado'}
                                    </div>
                                </div>
                                
                                <div style="margin-top: 20px;">
                                    <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #6c757d;">Acciones Rápidas</h4>
                                    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                        ${herramienta.estado === 'ACTIVO' 
                                            ? `<button class="btn btn-warning btn-sm" onclick="pausarHerramienta('${herramienta.id}')">⏸️ Pausar</button>`
                                            : `<button class="btn btn-success btn-sm" onclick="activarHerramienta('${herramienta.id}')">▶️ Activar</button>`
                                        }
                                        <button class="btn btn-outline btn-sm" onclick="mostrarHistorialHerramienta('${herramienta.id}')">
                                            📊 Historial
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Columna derecha: Información detallada -->
                            <div>
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                                    <h2 style="margin: 0 0 10px 0; font-size: 28px;">${herramienta.nombre}</h2>
                                    <div style="display: flex; gap: 8px;">
                                        <span class="badge badge-${herramienta.estado === 'ACTIVO' ? 'success' : 'warning'}">
                                            ${herramienta.estado}
                                        </span>
                                        <span class="badge badge-info">ID: ${herramienta.id.substring(0, 8)}...</span>
                                    </div>
                                </div>
                                
                                ${estadisticasAdmin}
                                
                                <div style="margin-bottom: 20px;">
                                    <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #6c757d;">📋 Información General</h4>
                                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                                        <div>
                                            <strong>Marca/Modelo:</strong><br>
                                            ${herramienta.marca || 'N/A'} ${herramienta.modelo || ''}
                                        </div>
                                        <div>
                                            <strong>Categoría:</strong><br>
                                            ${herramienta.categoriaNombre || 'Sin categoría'}
                                        </div>
                                        <div>
                                            <strong>Calificación:</strong><br>
                                            ⭐ ${herramienta.calificacionPromedio || 0} 
                                            (${herramienta.totalCalificaciones || 0} reseñas)
                                        </div>
                                        <div>
                                            <strong>Fecha creación:</strong><br>
                                            ${formatearFechaHora(herramienta.createdAt)}
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #6c757d;">📝 Descripción</h4>
                                    <p style="margin: 0; line-height: 1.6; white-space: pre-line; padding: 12px; background: #f8f9fa; border-radius: 6px;">
                                        ${herramienta.descripcion || 'Sin descripción disponible'}
                                    </p>
                                </div>
                                
                                ${herramienta.caracteristicas && herramienta.caracteristicas.length > 0 ? `
                                    <div style="margin-bottom: 20px;">
                                        <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #6c757d;">🔧 Características</h4>
                                        <ul style="margin: 0; padding-left: 20px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                                            ${herramienta.caracteristicas.map(c => `<li>${c}</li>`).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                                
                                ${herramienta.condicionesUso ? `
                                    <div style="margin-bottom: 20px;">
                                        <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #6c757d;">⚠️ Condiciones de Uso</h4>
                                        <p style="margin: 0; line-height: 1.6; white-space: pre-line; padding: 12px; background: #fff3cd; border-radius: 6px;">
                                            ${herramienta.condicionesUso}
                                        </p>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="cerrarModalDetalleHerramientaAdmin()">Cerrar</button>
                        <button class="btn btn-primary" onclick="abrirModalEditarHerramienta('${herramienta.id}')">
                            ✏️ Editar Herramienta
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Eliminar modal anterior si existe
        const modalAnterior = document.getElementById('modalDetalleHerramientaAdmin');
        if (modalAnterior) {
            modalAnterior.remove();
        }

        // Agregar modal al body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

    } catch (error) {
        console.error('Error cargando detalle:', error);
        mostrarAlerta('Error al cargar los detalles: ' + error.message, 'danger');
    }
}

function cerrarModalDetalleHerramientaAdmin() {
    const modal = document.getElementById('modalDetalleHerramientaAdmin');
    if (modal) {
        modal.remove();
    }
}

// Función auxiliar para mostrar historial (placeholder)
function mostrarHistorialHerramienta(herramientaId) {
    mostrarAlerta('Función de historial en desarrollo', 'info');
}

// Función auxiliar para editar herramienta (placeholder)
function abrirModalEditarHerramienta(herramientaId) {
    mostrarAlerta('Función de edición en desarrollo', 'info');
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