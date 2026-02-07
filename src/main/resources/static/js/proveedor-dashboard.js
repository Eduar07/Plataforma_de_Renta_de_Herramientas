/**
 * PROVEEDOR DASHBOARD
 */

// Verificar autenticación y rol
const userRole = localStorage.getItem('userRole');
if (!localStorage.getItem('token') || userRole !== 'PROVEEDOR') {
    alert('Acceso denegado');
    window.location.href = '/login.html';
}

// Variables globales
let vistaActual = 'miNegocio';
let misHerramientas = [];
let misReservas = [];

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarNombreUsuario();
    cambiarVista('miNegocio');
});

function cargarNombreUsuario() {
    const userName = localStorage.getItem('userName') || 'Proveedor';
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
        case 'miNegocio':
            cargarMiNegocio();
            break;
        case 'misHerramientas':
            cargarMisHerramientas();
            break;
        case 'reservas':
            cargarReservas();
            break;
        case 'billetera':
            cargarBilletera();
            break;
        case 'estadisticas':
            cargarEstadisticas();
            break;
    }
}

// ==================== MI NEGOCIO ====================
async function cargarMiNegocio() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">📊 Mi Negocio</h1>
            <p class="page-subtitle">Vista general de tu actividad</p>
        </div>

        <div class="kpi-grid" id="kpiGrid">
            <div class="loading" style="grid-column: 1/-1;">
                <div class="spinner"></div>
                <p class="loading-text">Cargando estadísticas...</p>
            </div>
        </div>

        <div style="margin-bottom: 40px;">
            <h3 style="margin-bottom: 20px;">⚡ Acceso Rápido</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                <button class="btn btn-primary btn-lg" onclick="cambiarVista('misHerramientas')">
                    + Agregar Herramienta
                </button>
                <button class="btn btn-outline btn-lg" onclick="cambiarVista('reservas')">
                    📋 Ver Reservas
                </button>
                <button class="btn btn-outline btn-lg" onclick="cambiarVista('billetera')">
                    💰 Mi Billetera
                </button>
            </div>
        </div>

        <div class="card">
            <div class="card-header">⚠️ Reservas Pendientes de Acción</div>
            <div class="card-body" id="reservasPendientes">
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            </div>
        </div>
    `;

    try {
        const userId = localStorage.getItem('userId');
        
        const [herramientas, reservas] = await Promise.all([
            api.get(`/herramientas/proveedor/${userId}`),
            api.get(`/reservas/proveedor/${userId}`)
        ]);

        const herramientasActivas = herramientas.filter(h => h.estado === 'ACTIVO').length;
        const reservasEsteMes = reservas.filter(r => {
            const fecha = new Date(r.created_at);
            const ahora = new Date();
            return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
        }).length;

        document.getElementById('kpiGrid').innerHTML = `
            <div class="kpi-card" style="background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);">
                <div class="kpi-label">Saldo Disponible</div>
                <div class="kpi-value">$0</div>
                <div class="kpi-change">En billetera</div>
            </div>
            <div class="kpi-card" style="background: linear-gradient(135deg, #28A745 0%, #1e7e34 100%);">
                <div class="kpi-label">Herramientas Activas</div>
                <div class="kpi-value">${herramientasActivas}</div>
                <div class="kpi-change">Publicadas</div>
            </div>
            <div class="kpi-card" style="background: linear-gradient(135deg, #FFC107 0%, #e0a800 100%);">
                <div class="kpi-label">Reservas del Mes</div>
                <div class="kpi-value">${reservasEsteMes}</div>
                <div class="kpi-change">Este mes</div>
            </div>
            <div class="kpi-card" style="background: linear-gradient(135deg, #FF8C00 0%, #E67E00 100%);">
                <div class="kpi-label">Calificación</div>
                <div class="kpi-value">⭐ 0.0</div>
                <div class="kpi-change">(0 reseñas)</div>
            </div>
        `;

        const pendientes = reservas.filter(r => r.estado === 'PAGADA');
        
        if (pendientes.length === 0) {
            document.getElementById('reservasPendientes').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">✓</div>
                    <div class="empty-state-title">No hay reservas pendientes</div>
                </div>
            `;
        } else {
            document.getElementById('reservasPendientes').innerHTML = pendientes.map(r => `
                <div class="alert alert-warning" style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>#${r.numeroReserva}</strong> - 
                        Cliente ID: ${r.clienteId} - 
                        Fechas: ${formatearFecha(r.fechaInicio)} - ${formatearFecha(r.fechaFin)}
                    </div>
                    <button class="btn btn-sm btn-primary" onclick="confirmarReserva('${r.id}')">
                        ✓ Confirmar
                    </button>
                </div>
            `).join('');
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al cargar datos del negocio', 'danger');
    }
}

async function confirmarReserva(id) {
    if (!confirm('¿Confirmar esta reserva?')) return;

    try {
        await api.patch(`/reservas/${id}/estado?nuevoEstado=CONFIRMADA`);
        mostrarAlerta('Reserva confirmada exitosamente', 'success');
        cargarMiNegocio();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al confirmar reserva', 'danger');
    }
}

// ==================== MIS HERRAMIENTAS ====================
async function cargarMisHerramientas() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">🛠️ Mis Herramientas</h1>
            <p class="page-subtitle">Gestiona tu inventario</p>
        </div>

        <button class="btn btn-primary btn-lg" style="margin-bottom: 24px;" onclick="mostrarFormAgregarHerramienta()">
            + Agregar Nueva Herramienta
        </button>

        <div class="herramientas-grid" id="misHerramientasGrid">
            <div class="loading" style="grid-column: 1/-1;">
                <div class="spinner"></div>
                <p class="loading-text">Cargando herramientas...</p>
            </div>
        </div>
    `;

    try {
        const userId = localStorage.getItem('userId');
        misHerramientas = await api.get(`/herramientas/proveedor/${userId}`);
        renderizarMisHerramientas(misHerramientas);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('misHerramientasGrid').innerHTML = `
            <div class="alert alert-danger" style="grid-column: 1/-1;">Error al cargar herramientas</div>
        `;
    }
}

function renderizarMisHerramientas(herramientas) {
    const grid = document.getElementById('misHerramientasGrid');
    
    if (herramientas.length === 0) {
        grid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <div class="empty-state-icon">🛠️</div>
                <div class="empty-state-title">No tienes herramientas</div>
                <div class="empty-state-text">Agrega tu primera herramienta para empezar</div>
                <button class="btn btn-primary" onclick="mostrarFormAgregarHerramienta()">
                    + Agregar Herramienta
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = herramientas.map(h => {
        const imagen = h.fotos && h.fotos.length > 0 ? h.fotos[0] : 'https://via.placeholder.com/300x200?text=Sin+Imagen';
        const estadoBadge = h.estado === 'ACTIVO' ? 'badge-success' : h.estado === 'PAUSADO' ? 'badge-warning' : 'badge-danger';
        
        return `
            <div class="herramienta-card">
                <img src="${imagen}" alt="${h.nombre}" class="herramienta-image" onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
                <div class="herramienta-body">
                    <div class="herramienta-title">${h.nombre}</div>
                    <div class="herramienta-brand">${h.marca || ''} ${h.modelo || ''}</div>
                    <div class="herramienta-price">
                        ${formatearMoneda(h.precioBaseDia)}
                        <span class="herramienta-price-label">/día</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 14px; margin-top: 12px;">
                        <span>⭐ ${h.calificacionPromedio || 0}</span>
                        <span>👁️ ${h.vistas || 0}</span>
                        <span>📋 ${h.totalAlquileres || 0}</span>
                    </div>
                    <div style="margin-top: 12px;">
                        <span class="badge ${estadoBadge}">${h.estado}</span>
                    </div>
                </div>
                <div class="herramienta-footer">
                    <button class="btn btn-sm btn-outline" onclick="editarHerramienta('${h.id}')">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-sm btn-${h.estado === 'ACTIVO' ? 'warning' : 'success'}" 
                            onclick="toggleEstadoHerramienta('${h.id}', '${h.estado}')">
                        ${h.estado === 'ACTIVO' ? '⏸️ Pausar' : '▶️ Activar'}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ==================== AGREGAR HERRAMIENTA ====================
async function mostrarFormAgregarHerramienta() {
    // Primero cargar las categorías disponibles
    let categoriasOptions = '';
    try {
        const categorias = await api.get('/categorias');
        categoriasOptions = categorias.map(c => 
            `<option value="${c.id}">${c.nombre}</option>`
        ).join('');
    } catch (error) {
        console.error('Error cargando categorías:', error);
        categoriasOptions = `<option value="">Error al cargar categorías</option>`;
    }

    const modalHTML = `
        <div class="modal active" id="modalAgregarHerramienta">
            <div class="modal-content" style="max-width: 700px;">
                <div class="modal-header">
                    <h3 class="modal-title">➕ Agregar Nueva Herramienta</h3>
                    <button class="modal-close" onclick="cerrarModalAgregarHerramienta()">✖</button>
                </div>
                <div class="modal-body">
                    <div id="alertContainerHerramienta"></div>
                    <form id="formAgregarHerramienta">
                        <div class="form-group">
                            <label class="form-label">Nombre de la herramienta *</label>
                            <input type="text" class="form-control" id="nombreHerramienta" required 
                                   placeholder="Ej: Taladro percutor">
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">Categoría *</label>
                                <select class="form-select" id="categoriaHerramienta" required>
                                    <option value="">Selecciona una categoría</option>
                                    ${categoriasOptions}
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Precio por día (COP) *</label>
                                <input type="number" class="form-control" id="precioHerramienta" required 
                                       min="1000" step="1000" placeholder="Ej: 25000">
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">Marca</label>
                                <input type="text" class="form-control" id="marcaHerramienta" 
                                       placeholder="Ej: Bosch">
                            </div>

                            <div class="form-group">
                                <label class="form-label">Modelo</label>
                                <input type="text" class="form-control" id="modeloHerramienta" 
                                       placeholder="Ej: GSB 13 RE">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Descripción *</label>
                            <textarea class="form-control" id="descripcionHerramienta" required 
                                      rows="4" placeholder="Describe las características principales..."></textarea>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="checkbox" id="envioIncluidoHerramienta">
                                    <span>📦 Envío incluido</span>
                                </label>
                            </div>

                            <div class="form-group">
                                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                                    <input type="checkbox" id="garantiaHerramienta">
                                    <span>✅ Con garantía</span>
                                </label>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">URL de la imagen (opcional)</label>
                            <input type="url" class="form-control" id="fotoHerramienta" 
                                   placeholder="https://ejemplo.com/imagen.jpg">
                            <small style="color: #6c757d;">Por ahora solo se acepta una URL de imagen</small>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="cerrarModalAgregarHerramienta()">Cancelar</button>
                    <button class="btn btn-primary" id="btnGuardarHerramienta" onclick="guardarNuevaHerramienta()">
                        💾 Guardar Herramienta
                    </button>
                </div>
            </div>
        </div>
    `;

    // Eliminar modal anterior si existe
    const modalAnterior = document.getElementById('modalAgregarHerramienta');
    if (modalAnterior) {
        modalAnterior.remove();
    }

    // Agregar modal al body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function cerrarModalAgregarHerramienta() {
    const modal = document.getElementById('modalAgregarHerramienta');
    if (modal) {
        modal.remove();
    }
}

// ========== FUNCIÓN ACTUALIZADA CON VALIDACIÓN ==========
async function guardarNuevaHerramienta() {
    const form = document.getElementById('formAgregarHerramienta');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const userId = localStorage.getItem('userId');
    
    // PASO 1: Verificar que el usuario sea PROVEEDOR en la BD
    try {
        const usuario = await api.get(`/usuarios/${userId}`);
        console.log('Usuario verificado:', usuario);
        
        if (usuario.tipo !== 'PROVEEDOR') {
            const alertContainer = document.getElementById('alertContainerHerramienta');
            if (alertContainer) {
                alertContainer.innerHTML = `
                    <div class="alert alert-danger">
                        ❌ Error: Tu cuenta no está registrada como PROVEEDOR en el sistema.<br>
                        <small>Tipo de cuenta actual: ${usuario.tipo}</small><br>
                        <small>Por favor, contacta al administrador para cambiar tu tipo de cuenta.</small>
                    </div>
                `;
            }
            return;
        }
    } catch (error) {
        console.error('Error verificando usuario:', error);
        const alertContainer = document.getElementById('alertContainerHerramienta');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-danger">
                    ❌ Error al verificar tu cuenta: ${error.message}<br>
                    <small>Por favor, intenta nuevamente o contacta al administrador.</small>
                </div>
            `;
        }
        return;
    }
    
    // PASO 2: Construir datos de la herramienta
    const datosHerramienta = {
        nombre: document.getElementById('nombreHerramienta').value.trim(),
        categoriaId: parseInt(document.getElementById('categoriaHerramienta').value), // CONVERTIR A NÚMERO
        precioBaseDia: parseInt(document.getElementById('precioHerramienta').value),
        marca: document.getElementById('marcaHerramienta').value.trim() || null,
        modelo: document.getElementById('modeloHerramienta').value.trim() || null,
        descripcion: document.getElementById('descripcionHerramienta').value.trim(),
        envioIncluido: document.getElementById('envioIncluidoHerramienta').checked,
        garantia: document.getElementById('garantiaHerramienta').checked,
        proveedorId: userId // Se enviará como String, el backend debe convertirlo a Long
    };

    // Agregar foto si se proporcionó
    const fotoURL = document.getElementById('fotoHerramienta').value.trim();
    if (fotoURL) {
        datosHerramienta.fotos = [fotoURL];
    }

    console.log('Datos de herramienta a enviar:', datosHerramienta);

    deshabilitarBoton('btnGuardarHerramienta', true);

    try {
        const resultado = await api.post('/herramientas', datosHerramienta);
        console.log('Herramienta creada exitosamente:', resultado);
        
        const alertContainer = document.getElementById('alertContainerHerramienta');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-success">
                    ✅ Herramienta agregada exitosamente
                </div>
            `;
        }
        
        setTimeout(() => {
            cerrarModalAgregarHerramienta();
            cargarMisHerramientas();
        }, 1500);
        
    } catch (error) {
        console.error('Error completo al crear herramienta:', error);
        const alertContainer = document.getElementById('alertContainerHerramienta');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-danger">
                    ❌ Error al agregar herramienta: ${error.message}<br>
                    <small>Detalles: ${JSON.stringify(error)}</small><br>
                    <small>Verifica que tu cuenta esté correctamente registrada como PROVEEDOR</small>
                </div>
            `;
        }
        deshabilitarBoton('btnGuardarHerramienta', false);
    }
}

function editarHerramienta(id) {
    alert('Funcionalidad de edición próximamente. ID: ' + id);
}

async function toggleEstadoHerramienta(id, estadoActual) {
    const nuevoEstado = estadoActual === 'ACTIVO' ? 'PAUSADO' : 'ACTIVO';
    
    try {
        await api.patch(`/herramientas/${id}/estado?estado=${nuevoEstado}`);
        mostrarAlerta(`Herramienta ${nuevoEstado.toLowerCase()} exitosamente`, 'success');
        cargarMisHerramientas();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al cambiar estado', 'danger');
    }
}

// ==================== RESERVAS ====================
async function cargarReservas() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">📋 Reservas</h1>
            <p class="page-subtitle">Gestiona las reservas de tus herramientas</p>
        </div>

        <div class="tabs">
            <div class="tab active" onclick="filtrarReservasProveedor('nuevas')">Nuevas (PAGADA)</div>
            <div class="tab" onclick="filtrarReservasProveedor('activas')">Activas</div>
            <div class="tab" onclick="filtrarReservasProveedor('completadas')">Completadas</div>
        </div>

        <div id="reservasProveedorContent">
            <div class="loading">
                <div class="spinner"></div>
                <p class="loading-text">Cargando reservas...</p>
            </div>
        </div>
    `;

    try {
        const userId = localStorage.getItem('userId');
        misReservas = await api.get(`/reservas/proveedor/${userId}`);
        filtrarReservasProveedor('nuevas');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('reservasProveedorContent').innerHTML = `
            <div class="alert alert-danger">Error al cargar reservas</div>
        `;
    }
}

function filtrarReservasProveedor(tipo) {
    // Actualizar tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event?.target?.classList.add('active');

    let filtered = [];
    
    switch(tipo) {
        case 'nuevas':
            filtered = misReservas.filter(r => r.estado === 'PAGADA');
            break;
        case 'activas':
            filtered = misReservas.filter(r => 
                ['CONFIRMADA', 'EN_PREPARACION', 'ENVIADA', 'ENTREGADA', 'EN_USO'].includes(r.estado)
            );
            break;
        case 'completadas':
            filtered = misReservas.filter(r => r.estado === 'COMPLETADA');
            break;
    }

    renderizarReservasProveedor(filtered);
}

function renderizarReservasProveedor(reservas) {
    const content = document.getElementById('reservasProveedorContent');
    
    if (reservas.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-title">No hay reservas</div>
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
                        <p style="margin: 0; color: #6c757d;">
                            Cliente ID: ${r.clienteId} | Herramienta ID: ${r.herramientaId}
                        </p>
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
                </div>

                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    ${r.estado === 'PAGADA' ? `
                        <button class="btn btn-primary btn-sm" onclick="confirmarReserva('${r.id}')">
                            ✓ Confirmar Reserva
                        </button>
                    ` : ''}
                    ${r.estado === 'CONFIRMADA' ? `
                        <button class="btn btn-primary btn-sm" onclick="marcarComoEnviada('${r.id}')">
                            📦 Marcar como Enviada
                        </button>
                    ` : ''}
                    <button class="btn btn-outline btn-sm" onclick="verDetalleReservaProveedor('${r.id}')">
                        👁️ Ver Detalle
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function marcarComoEnviada(id) {
    const tracking = prompt('Ingresa el número de tracking (opcional):');
    
    try {
        await api.patch(`/reservas/${id}/estado?nuevoEstado=ENVIADA`);
        
        if (tracking) {
            await api.put(`/reservas/${id}`, { trackingEnvioIda: tracking });
        }
        
        mostrarAlerta('Reserva marcada como enviada', 'success');
        cargarReservas();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al actualizar reserva', 'danger');
    }
}

function verDetalleReservaProveedor(id) {
    alert('Ver detalle de reserva: ' + id);
}

// ==================== BILLETERA ====================
function cargarBilletera() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">💰 Mi Billetera</h1>
            <p class="page-subtitle">Gestiona tus ingresos y retiros</p>
        </div>

        <div class="kpi-grid">
            <div class="kpi-card" style="background: linear-gradient(135deg, #28A745 0%, #1e7e34 100%);">
                <div class="kpi-label">Saldo Disponible</div>
                <div class="kpi-value">$0</div>
                <button class="btn btn-primary btn-sm" style="margin-top: 16px;">
                    💸 Solicitar Retiro
                </button>
            </div>
            <div class="kpi-card" style="background: linear-gradient(135deg, #FFC107 0%, #e0a800 100%);">
                <div class="kpi-label">Saldo Retenido</div>
                <div class="kpi-value">$0</div>
                <div class="kpi-change">Temporal</div>
            </div>
            <div class="kpi-card" style="background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);">
                <div class="kpi-label">Total Acumulado</div>
                <div class="kpi-value">$0</div>
                <div class="kpi-change">Histórico</div>
            </div>
        </div>

        <div class="card">
            <div class="card-header">📊 Historial de Movimientos</div>
            <div class="card-body">
                <div class="empty-state">
                    <div class="empty-state-icon">💰</div>
                    <div class="empty-state-title">No hay movimientos</div>
                </div>
            </div>
        </div>
    `;
}

// ==================== ESTADÍSTICAS ====================
function cargarEstadisticas() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">📈 Estadísticas</h1>
            <p class="page-subtitle">Analiza el rendimiento de tu negocio</p>
        </div>

        <div class="empty-state">
            <div class="empty-state-icon">📈</div>
            <div class="empty-state-title">Estadísticas próximamente</div>
            <div class="empty-state-text">Próximamente podrás ver gráficos detallados de tu negocio</div>
        </div>
    `;
}