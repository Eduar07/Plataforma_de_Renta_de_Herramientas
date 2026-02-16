/**
 * PROVEEDOR DASHBOARD
 * Integración completa con Perfil de Proveedor
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
let miPerfilProveedor = null; // ✅ NUEVO: Almacenar perfil

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    cargarNombreUsuario();
    verificarYCargarPerfil(); // ✅ NUEVO: Verificar perfil primero
});

function cargarNombreUsuario() {
    const userName = localStorage.getItem('userName') || 'Proveedor';
    document.getElementById('userName').textContent = userName;
    document.getElementById('userAvatar').textContent = userName.charAt(0).toUpperCase();
}

// ========== ✅ NUEVO: VERIFICAR Y CARGAR PERFIL ==========
async function verificarYCargarPerfil() {
    const userId = localStorage.getItem('userId');
    
    try {
        console.log('=== VERIFICANDO PERFIL DE PROVEEDOR ===');
        console.log('Usuario ID:', userId);
        
        // Intentar obtener el perfil
        const response = await api.get(`/perfiles-proveedor/usuario/${userId}`);
        
        if (response && response.id) {
            miPerfilProveedor = response;
            console.log('✅ Perfil encontrado:', miPerfilProveedor);
            
            // Actualizar nombre en header con nombre comercial
            if (miPerfilProveedor.nombreComercial) {
                document.getElementById('userName').textContent = miPerfilProveedor.nombreComercial;
            }
            
            // Cargar vista inicial
            cambiarVista('miNegocio');
        }
        
    } catch (error) {
        console.error('❌ Error al verificar perfil:', error);
        
        // Si no existe perfil, mostrar advertencia
        mostrarAdvertenciaSinPerfil();
    }
}

function mostrarAdvertenciaSinPerfil() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="alert alert-warning" style="max-width: 600px; margin: 40px auto;">
            <h3 style="margin: 0 0 16px 0;">⚠️ Perfil Incompleto</h3>
            <p>No se encontró tu perfil de proveedor. Esto puede deberse a que tu cuenta fue creada antes de que se implementara esta funcionalidad.</p>
            <p>Por favor, ve a <strong>"Mi Perfil"</strong> en el menú lateral para crear tu perfil de proveedor.</p>
            <button class="btn btn-primary" onclick="cambiarVista('miPerfil')">
                ✅ Ir a Mi Perfil
            </button>
        </div>
    `;
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
        case 'miPerfil':
            cargarMiPerfil();
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

    // ✅ VERIFICAR QUE EXISTA PERFIL
    if (!miPerfilProveedor) {
        document.getElementById('kpiGrid').innerHTML = `
            <div class="alert alert-warning" style="grid-column: 1/-1;">
                ⚠️ Debes completar tu perfil de proveedor antes de continuar.<br>
                <button class="btn btn-primary" onclick="cambiarVista('miPerfil')">Ir a Mi Perfil</button>
            </div>
        `;
        return;
    }

    try {
        const userId = localStorage.getItem('userId');
        
        const [herramientas, reservas] = await Promise.all([
            api.get(`/herramientas/proveedor/${miPerfilProveedor.id}`), // ✅ USA perfil.id
            api.get(`/reservas/proveedor/${miPerfilProveedor.id}`) // Reservas por perfil_proveedor_id
        ]);

        const herramientasActivas = herramientas.filter(h => h.estado === 'ACTIVO').length;
        const reservasEsteMes = reservas.filter(r => {
            const fecha = new Date(r.createdAt);
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
                <div class="kpi-value">⭐ ${miPerfilProveedor.calificacionPromedio || 0}</div>
                <div class="kpi-change">(${miPerfilProveedor.totalCalificaciones || 0} reseñas)</div>
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

    // ✅ VERIFICAR QUE EXISTA PERFIL
    if (!miPerfilProveedor) {
        document.getElementById('misHerramientasGrid').innerHTML = `
            <div class="alert alert-danger" style="grid-column: 1/-1;">
                ❌ Debes completar tu perfil de proveedor antes de agregar herramientas.<br>
                <button class="btn btn-primary" onclick="cambiarVista('miPerfil')">Ir a Mi Perfil</button>
            </div>
        `;
        return;
    }

    try {
        console.log('Cargando herramientas para perfil_proveedor_id:', miPerfilProveedor.id);
        misHerramientas = await api.get(`/herramientas/proveedor/${miPerfilProveedor.id}`);
        renderizarMisHerramientas(misHerramientas);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('misHerramientasGrid').innerHTML = `
            <div class="alert alert-danger" style="grid-column: 1/-1;">
                Error al cargar herramientas: ${error.message}
            </div>
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
    // ✅ VERIFICAR PERFIL PRIMERO
    if (!miPerfilProveedor) {
        alert('❌ Debes completar tu perfil de proveedor antes de agregar herramientas.');
        cambiarVista('miPerfil');
        return;
    }

    // Cargar categorías
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

    const modalAnterior = document.getElementById('modalAgregarHerramienta');
    if (modalAnterior) {
        modalAnterior.remove();
    }

    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function cerrarModalAgregarHerramienta() {
    const modal = document.getElementById('modalAgregarHerramienta');
    if (modal) {
        modal.remove();
    }
}

async function guardarNuevaHerramienta() {
    const form = document.getElementById('formAgregarHerramienta');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // ✅ VERIFICAR PERFIL
    if (!miPerfilProveedor) {
        alert('❌ Error: No se encontró tu perfil de proveedor.');
        return;
    }

    const datosHerramienta = {
        nombre: document.getElementById('nombreHerramienta').value.trim(),
        categoriaId: document.getElementById('categoriaHerramienta').value,
        precioBaseDia: parseFloat(document.getElementById('precioHerramienta').value),
        marca: document.getElementById('marcaHerramienta').value.trim() || null,
        modelo: document.getElementById('modeloHerramienta').value.trim() || null,
        descripcion: document.getElementById('descripcionHerramienta').value.trim(),
        envioIncluido: document.getElementById('envioIncluidoHerramienta').checked,
        proveedorId: miPerfilProveedor.id // ✅ USA perfil.id (NO usuario.id)
    };

    const fotoURL = document.getElementById('fotoHerramienta').value.trim();
    if (fotoURL) {
        datosHerramienta.fotos = [fotoURL];
    }

    console.log('=== GUARDAR HERRAMIENTA ===');
    console.log('Datos:', datosHerramienta);
    console.log('Perfil Proveedor ID:', miPerfilProveedor.id);

    deshabilitarBoton('btnGuardarHerramienta', true);

    try {
        const resultado = await api.post('/herramientas', datosHerramienta);
        console.log('✅ Herramienta creada:', resultado);
        
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
        console.error('❌ Error:', error);
        const alertContainer = document.getElementById('alertContainerHerramienta');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-danger">
                    ❌ Error: ${error.message}
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
            <div class="tab active" onclick="filtrarReservasProveedor('pagadas')">Pagadas</div>
            <div class="tab" onclick="filtrarReservasProveedor('activas')">Activas</div>
            <div class="tab" onclick="filtrarReservasProveedor('devoluciones')">Devoluciones</div>
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
        if (!miPerfilProveedor || !miPerfilProveedor.id) {
            document.getElementById('reservasProveedorContent').innerHTML = `
                <div class="alert alert-warning">Debes completar tu perfil de proveedor para ver reservas.</div>
            `;
            return;
        }

        misReservas = await api.get(`/reservas/proveedor/${miPerfilProveedor.id}`);
        filtrarReservasProveedor('pagadas');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('reservasProveedorContent').innerHTML = `
            <div class="alert alert-danger">Error al cargar reservas</div>
        `;
    }
}

function filtrarReservasProveedor(tipo) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event?.target?.classList.add('active');

    let filtered = [];
    
    switch(tipo) {
        case 'pagadas':
            filtered = misReservas.filter(r => r.estado === 'PAGADA');
            break;
        case 'activas':
            filtered = misReservas.filter(r => 
                ['CONFIRMADA', 'EN_PREPARACION', 'ENVIADA', 'ENTREGADA', 'EN_USO'].includes(r.estado)
            );
            break;
        case 'devoluciones':
            filtered = misReservas.filter(r => ['DEVUELTA', 'COMPLETADA'].includes(r.estado));
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

                ${r.estado === 'DEVUELTA' ? `
                    <div class="alert alert-info" style="margin-bottom: 16px;">
                        El cliente marcó esta reserva como devuelta. Revisa reporte de daños si aplica y completa la devolución.
                    </div>
                ` : ''}

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
                    ${r.estado === 'ENVIADA' ? `
                        <button class="btn btn-primary btn-sm" onclick="marcarComoEntregada('${r.id}')">
                            📬 Marcar como Entregada
                        </button>
                    ` : ''}
                    ${['ENTREGADA', 'EN_USO', 'DEVUELTA'].includes(r.estado) ? `
                        <button class="btn btn-success btn-sm" onclick="abrirFlujoDevolucion('${r.id}')">
                            ↩️ Completar Devolución
                        </button>
                    ` : ''}
                    ${['DEVUELTA', 'COMPLETADA'].includes(r.estado) ? `
                        <button class="btn btn-warning btn-sm" onclick="verReporteDevolucionProveedor('${r.id}')">
                            🧾 Ver Reporte Daños
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

async function marcarComoEntregada(id) {
    if (!confirm('¿Confirmar que la herramienta fue entregada al cliente?')) return;

    try {
        await api.patch(`/reservas/${id}/estado?nuevoEstado=ENTREGADA`);
        mostrarAlerta('Reserva marcada como entregada', 'success');
        cargarReservas();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al marcar como entregada', 'danger');
    }
}

async function abrirFlujoDevolucion(reservaId) {
    const reportarDanos = confirm('¿Deseas registrar reporte de daños en esta devolución?\nAceptar = Sí, Cancelar = No');

    const payload = {
        reportarDanos: reportarDanos
    };

    if (reportarDanos) {
        const estadoHerramienta = prompt(
            'Estado de la herramienta (DANADO, PERDIDO, ROBADO):',
            'DANADO'
        );

        if (!estadoHerramienta) {
            mostrarAlerta('Debes indicar el estado de la herramienta para reportar daños', 'warning');
            return;
        }

        const descripcion = prompt('Descripción de daños (opcional):', '') || null;
        const costo = prompt('Costo estimado de reparación (opcional, número):', '0');
        const costoNumerico = costo && !isNaN(parseFloat(costo)) ? parseFloat(costo) : 0;

        payload.estadoHerramienta = estadoHerramienta.toUpperCase().trim();
        payload.descripcion = descripcion;
        payload.costoReparacionEstimado = costoNumerico;
    }

    try {
        await api.post(`/reservas/${reservaId}/devolucion`, payload);
        mostrarAlerta('Devolución completada exitosamente', 'success');
        cargarReservas();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta(`Error al completar devolución: ${error.message}`, 'danger');
    }
}

async function verReporteDevolucionProveedor(reservaId) {
    try {
        const reporte = await api.get(`/reservas/${reservaId}/devolucion-reporte`);

        const fotosHtml = reporte.fotos && reporte.fotos.length > 0
            ? reporte.fotos.map(url => `
                <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>
            `).join('<br>')
            : 'Sin fotos';

        const modalHTML = `
            <div class="modal active" id="modalReporteDevolucion">
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h3 class="modal-title">🧾 Reporte de Devolución</h3>
                        <button class="modal-close" onclick="cerrarModalReporteDevolucion()">✖</button>
                    </div>
                    <div class="modal-body">
                        <table class="table-details" style="width: 100%;">
                            <tr><td><strong>Reserva:</strong></td><td>${reporte.reservaId}</td></tr>
                            <tr><td><strong>Tipo:</strong></td><td>${reporte.tipo || '-'}</td></tr>
                            <tr><td><strong>Estado herramienta:</strong></td><td>${reporte.estadoHerramienta || '-'}</td></tr>
                            <tr><td><strong>Descripción:</strong></td><td>${reporte.descripcion || 'Sin descripción'}</td></tr>
                            <tr><td><strong>Costo estimado:</strong></td><td>${formatearMoneda(reporte.costoReparacionEstimado || 0)}</td></tr>
                            <tr><td><strong>Fecha:</strong></td><td>${reporte.fechaVerificacion ? formatearFechaHora(reporte.fechaVerificacion) : '-'}</td></tr>
                            <tr><td><strong>Fotos:</strong></td><td>${fotosHtml}</td></tr>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="cerrarModalReporteDevolucion()">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        const modalAnterior = document.getElementById('modalReporteDevolucion');
        if (modalAnterior) modalAnterior.remove();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta(`No hay reporte de daños/devolución: ${error.message}`, 'warning');
    }
}

function cerrarModalReporteDevolucion() {
    const modal = document.getElementById('modalReporteDevolucion');
    if (modal) modal.remove();
}

async function verDetalleReservaProveedor(id) {
    try {
        const reserva = await api.get(`/reservas/${id}`);
        const herramienta = await api.get(`/herramientas/${reserva.herramientaId}`);

        let detalleReserva = null;
        try {
            detalleReserva = await api.get(`/detalle-reserva/reserva/${id}`);
        } catch (error) {
            console.warn('No se encontró detalle financiero de la reserva');
        }

        let reporteDevolucion = null;
        try {
            reporteDevolucion = await api.get(`/reservas/${id}/devolucion-reporte`);
        } catch (error) {
            // Es normal que no exista en reservas sin devolución reportada
        }

        const imagen = herramienta.fotos && herramienta.fotos.length > 0
            ? herramienta.fotos[0]
            : 'https://via.placeholder.com/320x200?text=Sin+Imagen';

        const modalHTML = `
            <div class="modal active" id="modalDetalleReservaProveedor">
                <div class="modal-content" style="max-width: 900px;">
                    <div class="modal-header">
                        <h3 class="modal-title">📋 Detalle Reserva #${reserva.numeroReserva}</h3>
                        <button class="modal-close" onclick="cerrarModalDetalleReservaProveedor()">✖</button>
                    </div>
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px;">
                            <div>
                                <h4 style="margin: 0 0 12px 0; padding-bottom: 10px; border-bottom: 2px solid #dee2e6;">
                                    🛠️ Herramienta
                                </h4>
                                <img src="${imagen}" alt="${herramienta.nombre}" style="width: 100%; max-height: 220px; object-fit: cover; border-radius: 8px; margin-bottom: 10px;"
                                     onerror="this.src='https://via.placeholder.com/320x200?text=Sin+Imagen'">
                                <p style="margin: 0; font-weight: 600;">${herramienta.nombre}</p>
                                <p style="margin: 6px 0 0 0; color: #6c757d;">${herramienta.marca || ''} ${herramienta.modelo || ''}</p>

                                <h4 style="margin: 18px 0 12px 0; padding-bottom: 10px; border-bottom: 2px solid #dee2e6;">
                                    📦 Logística
                                </h4>
                                <table class="table-details" style="width: 100%;">
                                    <tr><td><strong>Estado:</strong></td><td>${obtenerBadgeEstado(reserva.estado, 'RESERVA')}</td></tr>
                                    <tr><td><strong>Inicio:</strong></td><td>${formatearFecha(reserva.fechaInicio)}</td></tr>
                                    <tr><td><strong>Fin:</strong></td><td>${formatearFecha(reserva.fechaFin)}</td></tr>
                                    <tr><td><strong>Días:</strong></td><td>${reserva.diasTotales || '-'}</td></tr>
                                    <tr><td><strong>Tracking ida:</strong></td><td>${reserva.trackingEnvioIda || '-'}</td></tr>
                                    <tr><td><strong>Tracking vuelta:</strong></td><td>${reserva.trackingEnvioVuelta || '-'}</td></tr>
                                    <tr><td><strong>Fecha devolución:</strong></td><td>${reserva.fechaDevolucionReal ? formatearFechaHora(reserva.fechaDevolucionReal) : '-'}</td></tr>
                                </table>
                            </div>

                            <div>
                                <h4 style="margin: 0 0 12px 0; padding-bottom: 10px; border-bottom: 2px solid #dee2e6;">
                                    👤 Reserva
                                </h4>
                                <table class="table-details" style="width: 100%;">
                                    <tr><td><strong>Reserva ID:</strong></td><td>${reserva.id}</td></tr>
                                    <tr><td><strong>Cliente ID:</strong></td><td>${reserva.clienteId}</td></tr>
                                    <tr><td><strong>Proveedor ID:</strong></td><td>${reserva.proveedorId}</td></tr>
                                    <tr><td><strong>Creada:</strong></td><td>${reserva.createdAt ? formatearFechaHora(reserva.createdAt) : '-'}</td></tr>
                                    <tr><td><strong>Última actualización:</strong></td><td>${reserva.updatedAt ? formatearFechaHora(reserva.updatedAt) : '-'}</td></tr>
                                </table>

                                <h4 style="margin: 18px 0 12px 0; padding-bottom: 10px; border-bottom: 2px solid #dee2e6;">
                                    💰 Resumen financiero
                                </h4>
                                <table class="table-details" style="width: 100%;">
                                    <tr><td><strong>Subtotal:</strong></td><td>${formatearMoneda(detalleReserva?.subtotalAlquiler || 0)}</td></tr>
                                    <tr><td><strong>Seguro:</strong></td><td>${formatearMoneda(detalleReserva?.costoSeguro || 0)}</td></tr>
                                    <tr><td><strong>Descuento:</strong></td><td>${formatearMoneda(detalleReserva?.descuento || 0)}</td></tr>
                                    <tr><td><strong>Total pagado:</strong></td><td><strong>${formatearMoneda(detalleReserva?.totalPagado || 0)}</strong></td></tr>
                                    <tr><td><strong>Comisión admin:</strong></td><td>${formatearMoneda(detalleReserva?.comisionAdmin || 0)}</td></tr>
                                </table>

                                ${reporteDevolucion ? `
                                    <h4 style="margin: 18px 0 12px 0; padding-bottom: 10px; border-bottom: 2px solid #dee2e6;">
                                        🧾 Reporte devolución/daños
                                    </h4>
                                    <table class="table-details" style="width: 100%;">
                                        <tr><td><strong>Tipo:</strong></td><td>${reporteDevolucion.tipo || '-'}</td></tr>
                                        <tr><td><strong>Estado herramienta:</strong></td><td>${reporteDevolucion.estadoHerramienta || '-'}</td></tr>
                                        <tr><td><strong>Descripción:</strong></td><td>${reporteDevolucion.descripcion || 'Sin descripción'}</td></tr>
                                        <tr><td><strong>Costo estimado:</strong></td><td>${formatearMoneda(reporteDevolucion.costoReparacionEstimado || 0)}</td></tr>
                                        <tr><td><strong>Fecha reporte:</strong></td><td>${reporteDevolucion.fechaVerificacion ? formatearFechaHora(reporteDevolucion.fechaVerificacion) : '-'}</td></tr>
                                    </table>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="cerrarModalDetalleReservaProveedor()">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        const modalAnterior = document.getElementById('modalDetalleReservaProveedor');
        if (modalAnterior) modalAnterior.remove();
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta(`Error al cargar detalle de reserva: ${error.message}`, 'danger');
    }
}

function cerrarModalDetalleReservaProveedor() {
    const modal = document.getElementById('modalDetalleReservaProveedor');
    if (modal) modal.remove();
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

// ==================== MI PERFIL DE PROVEEDOR ====================
async function cargarMiPerfil() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">👤 Mi Perfil de Proveedor</h1>
            <p class="page-subtitle">Configura la información de tu negocio</p>
        </div>

        <div class="card" id="perfilProveedorCard">
            <div class="card-header">Información del Negocio</div>
            <div class="card-body">
                <div class="loading">
                    <div class="spinner"></div>
                    <p class="loading-text">Cargando perfil...</p>
                </div>
            </div>
        </div>
    `;

    try {
        const userId = localStorage.getItem('userId');
        
        // Intentar obtener perfil
        try {
            const perfil = await api.get(`/perfiles-proveedor/usuario/${userId}`);
            miPerfilProveedor = perfil; // ✅ Actualizar variable global
            mostrarFormularioPerfil(perfil);
        } catch (error) {
            // Si no existe, mostrar opción para crearlo
            mostrarFormularioCrearPerfil();
        }

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('perfilProveedorCard').innerHTML = `
            <div class="card-body">
                <div class="alert alert-danger">
                    ❌ Error al cargar perfil: ${error.message}
                </div>
            </div>
        `;
    }
}

function mostrarFormularioPerfil(perfil) {
    document.getElementById('perfilProveedorCard').innerHTML = `
        <div class="card-header">Información del Negocio</div>
        <div class="card-body">
            <div id="alertContainerPerfil"></div>
            
            <form id="formEditarPerfil">
                <div class="form-group">
                    <label class="form-label">Nombre Comercial *</label>
                    <input type="text" class="form-control" id="nombreComercial" 
                           value="${perfil.nombreComercial}" required>
                    <small style="color: #6c757d;">El nombre con el que aparecerás en la plataforma</small>
                </div>

                <div class="form-group">
                    <label class="form-label">Misión</label>
                    <textarea class="form-control" id="mision" rows="3" 
                              placeholder="¿Cuál es el propósito de tu negocio?">${perfil.mision || ''}</textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">Visión</label>
                    <textarea class="form-control" id="vision" rows="3" 
                              placeholder="¿A dónde quieres llegar con tu negocio?">${perfil.vision || ''}</textarea>
                </div>

                <div class="form-group">
                    <label class="form-label">URL del Logo (opcional)</label>
                    <input type="url" class="form-control" id="logoUrl" 
                           value="${perfil.logoUrl || ''}" 
                           placeholder="https://ejemplo.com/logo.png">
                </div>

                <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-top: 20px;">
                    <h5 style="margin: 0 0 12px 0;">📊 Estadísticas</h5>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                        <div>
                            <strong>Calificación:</strong><br>
                            ⭐ ${perfil.calificacionPromedio || 0} / 5
                        </div>
                        <div>
                            <strong>Reseñas:</strong><br>
                            ${perfil.totalCalificaciones || 0} reseñas
                        </div>
                        <div>
                            <strong>Estado KYC:</strong><br>
                            <span class="badge badge-${perfil.estadoKyc === 'APROBADO' ? 'success' : 'warning'}">
                                ${perfil.estadoKyc}
                            </span>
                        </div>
                        <div>
                            <strong>Verificado:</strong><br>
                            ${perfil.verificado ? '✅ Sí' : '❌ No'}
                        </div>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" id="btnGuardarPerfil" style="margin-top: 20px;">
                    💾 Guardar Cambios
                </button>
            </form>
        </div>
    `;

    document.getElementById('formEditarPerfil').addEventListener('submit', async (e) => {
        e.preventDefault();
        await guardarPerfilProveedor(perfil.id);
    });
}

function mostrarFormularioCrearPerfil() {
    document.getElementById('perfilProveedorCard').innerHTML = `
        <div class="card-header">⚠️ Perfil Incompleto</div>
        <div class="card-body">
            <div class="alert alert-warning">
                <p>No se encontró tu perfil de proveedor. Esto puede deberse a que tu cuenta fue creada antes de que se implementara esta funcionalidad.</p>
                <button class="btn btn-primary" onclick="crearPerfilManual()">
                    ✅ Crear Mi Perfil Ahora
                </button>
            </div>
        </div>
    `;
}

async function crearPerfilManual() {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    try {
        const nuevoPerfil = {
            nombreComercial: userName || 'Mi Negocio',
            mision: 'Proveedor de herramientas de calidad',
            vision: 'Ser un proveedor confiable en la plataforma'
        };

        const resultado = await api.post(`/perfiles-proveedor?usuarioId=${userId}`, nuevoPerfil);
        miPerfilProveedor = resultado; // ✅ Actualizar variable global
        
        mostrarAlerta('✅ Perfil creado exitosamente', 'success');
        
        setTimeout(() => {
            cargarMiPerfil();
        }, 1500);

    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al crear perfil: ' + error.message, 'danger');
    }
}

async function guardarPerfilProveedor(perfilId) {
    const datosActualizados = {
        nombreComercial: document.getElementById('nombreComercial').value.trim(),
        mision: document.getElementById('mision').value.trim() || null,
        vision: document.getElementById('vision').value.trim() || null,
        logoUrl: document.getElementById('logoUrl').value.trim() || null
    };

    if (!datosActualizados.nombreComercial) {
        mostrarAlerta('El nombre comercial es obligatorio', 'warning');
        return;
    }

    deshabilitarBoton('btnGuardarPerfil', true);

    try {
        await api.put(`/perfiles-proveedor/${perfilId}`, datosActualizados);
        
        // ✅ Recargar perfil actualizado
        const perfilActualizado = await api.get(`/perfiles-proveedor/${perfilId}`);
        miPerfilProveedor = perfilActualizado;
        
        const alertContainer = document.getElementById('alertContainerPerfil');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-success">
                    ✅ Perfil actualizado exitosamente
                </div>
            `;
        }

        // Actualizar nombre en header
        document.getElementById('userName').textContent = datosActualizados.nombreComercial;

        deshabilitarBoton('btnGuardarPerfil', false);

        setTimeout(() => {
            if (alertContainer) {
                alertContainer.innerHTML = '';
            }
        }, 3000);

    } catch (error) {
        console.error('Error:', error);
        const alertContainer = document.getElementById('alertContainerPerfil');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-danger">
                    ❌ Error al actualizar perfil: ${error.message}
                </div>
            `;
        }
        deshabilitarBoton('btnGuardarPerfil', false);
    }
}

// ========== UTILIDADES ==========

function formatearFecha(fecha) {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatearFechaHora(fecha) {
    if (!fecha) return '-';
    const date = new Date(fecha);
    return date.toLocaleString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatearMoneda(valor) {
    if (!valor) return '$0';
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(valor);
}

function obtenerBadgeEstado(estado, tipo) {
    const badges = {
        'PENDIENTE_PAGO': 'badge-warning',
        'PAGADA': 'badge-info',
        'CONFIRMADA': 'badge-primary',
        'EN_PREPARACION': 'badge-primary',
        'ENVIADA': 'badge-info',
        'ENTREGADA': 'badge-success',
        'EN_USO': 'badge-warning',
        'DEVUELTA': 'badge-warning',
        'COMPLETADA': 'badge-success',
        'CANCELADA_CLIENTE': 'badge-danger',
        'CANCELADA_PROVEEDOR': 'badge-danger',
        'ACTIVO': 'badge-success',
        'PAUSADO': 'badge-warning',
        'ELIMINADO': 'badge-danger'
    };
    
    const badgeClass = badges[estado] || 'badge-secondary';
    return `<span class="badge ${badgeClass}">${estado.replace('_', ' ')}</span>`;
}

function mostrarAlerta(mensaje, tipo) {
    const alertClass = tipo === 'success' ? 'alert-success' : 
                      tipo === 'warning' ? 'alert-warning' : 
                      tipo === 'danger' ? 'alert-danger' : 'alert-info';
    
    const alertHTML = `
        <div class="alert ${alertClass}" style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            ${mensaje}
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = alertHTML;
    document.body.appendChild(tempDiv.firstElementChild);
    
    setTimeout(() => {
        tempDiv.firstElementChild.remove();
    }, 3000);
}

function deshabilitarBoton(btnId, disabled) {
    const btn = document.getElementById(btnId);
    if (btn) {
        btn.disabled = disabled;
        btn.style.opacity = disabled ? '0.6' : '1';
        btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
    }
}

function cerrarSesion() {
    if (confirm('¿Seguro que deseas cerrar sesión?')) {
        localStorage.clear();
        window.location.href = '/login.html';
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}
