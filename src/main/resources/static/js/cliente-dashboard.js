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

// ==================== DETALLE DE HERRAMIENTA ====================
async function verDetalleHerramienta(id) {
    try {
        const herramienta = await api.get(`/herramientas/${id}`, false);
        
        const modalBody = `
            <div class="herramienta-detalle">
                <div class="herramienta-detalle-imagenes">
                    ${herramienta.fotos && herramienta.fotos.length > 0 ? 
                        herramienta.fotos.map(foto => `<img src="${foto}" alt="${herramienta.nombre}">`).join('') :
                        '<img src="https://via.placeholder.com/400x300?text=Sin+Imagen" alt="Sin imagen">'
                    }
                </div>
                <div class="herramienta-detalle-info">
                    <h3>${herramienta.nombre}</h3>
                    <p class="herramienta-detalle-marca">${herramienta.marca || ''} ${herramienta.modelo || ''}</p>
                    <p class="herramienta-detalle-precio">${formatearMoneda(herramienta.precioBaseDia)} / día</p>
                    
                    <div class="herramienta-detalle-caracteristicas">
                        <h4>Características:</h4>
                        <ul>
                            ${herramienta.caracteristicas ? `
                                ${herramienta.caracteristicas.map(c => `<li>${c}</li>`).join('')}
                            ` : '<li>No hay características especificadas</li>'}
                        </ul>
                    </div>
                    
                    <div class="herramienta-detalle-descripcion">
                        <h4>Descripción:</h4>
                        <p>${herramienta.descripcion || 'No hay descripción disponible'}</p>
                    </div>
                    
                    <div class="herramienta-detalle-proveedor">
                        <h4>Proveedor:</h4>
                        <p>Score: ${herramienta.scoreProveedor || 0}/100</p>
                        <p>Calificación: ⭐ ${herramienta.calificacionPromedioProveedor || 0}</p>
                    </div>
                    
                    <div class="herramienta-detalle-acciones">
                        <button class="btn btn-primary" onclick="iniciarReserva('${herramienta.id}')">
                            Reservar Ahora
                        </button>
                        <button class="btn btn-outline" onclick="agregarAFavoritos('${herramienta.id}')">
                            ❤️ Agregar a Favoritos
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Crear o usar modal existente
        let modal = document.getElementById('modalDetalleHerramienta');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalDetalleHerramienta';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3 class="modal-title">Detalle de Herramienta</h3>
                        <button class="modal-close" onclick="cerrarModal('modalDetalleHerramienta')">✖</button>
                    </div>
                    <div class="modal-body" id="modalDetalleHerramientaBody"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        document.getElementById('modalDetalleHerramientaBody').innerHTML = modalBody;
        abrirModal('modalDetalleHerramienta');
        
    } catch (error) {
        console.error('Error al cargar detalle:', error);
        mostrarAlerta('Error al cargar los detalles de la herramienta', 'danger');
    }
}

// ==================== RESERVA DE HERRAMIENTA ====================
function iniciarReserva(herramientaId) {
    // Cerrar modal de detalle si está abierto
    cerrarModal('modalDetalleHerramienta');
    
    // Crear modal de reserva
    const modalBody = `
        <form id="formReserva">
            <input type="hidden" id="herramientaId" value="${herramientaId}">
            
            <div class="form-group">
                <label class="form-label">Fecha de Inicio</label>
                <input type="date" id="fechaInicio" class="form-control" required 
                       min="${new Date().toISOString().split('T')[0]}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Fecha de Fin</label>
                <input type="date" id="fechaFin" class="form-control" required 
                       min="${new Date().toISOString().split('T')[0]}">
            </div>
            
            <div class="form-group">
                <label class="form-label">Cantidad de Días</label>
                <input type="number" id="dias" class="form-control" min="1" value="1" readonly>
            </div>
            
            <div class="form-group">
                <label class="form-label">Dirección de Entrega</label>
                <input type="text" id="direccionEntrega" class="form-control" 
                       placeholder="Opcional - Si no se especifica, se usará la de tu perfil">
            </div>
            
            <div class="form-group">
                <label class="form-label">Notas Especiales</label>
                <textarea id="notas" class="form-control" rows="3" 
                          placeholder="Instrucciones especiales para la entrega..."></textarea>
            </div>
            
            <div id="resumenReserva" style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <h4>Resumen de Reserva</h4>
                <p><strong>Precio por día:</strong> <span id="precioDia">$0</span></p>
                <p><strong>Total estimado:</strong> <span id="totalReserva">$0</span></p>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" id="btnConfirmarReserva">
                Confirmar Reserva
            </button>
        </form>
    `;
    
    // Crear o usar modal existente
    let modal = document.getElementById('modalReserva');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalReserva';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3 class="modal-title">Nueva Reserva</h3>
                    <button class="modal-close" onclick="cerrarModal('modalReserva')">✖</button>
                </div>
                <div class="modal-body" id="modalReservaBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('modalReservaBody').innerHTML = modalBody;
    abrirModal('modalReserva');
    
    // Configurar eventos para calcular total
    setTimeout(() => {
        const fechaInicioInput = document.getElementById('fechaInicio');
        const fechaFinInput = document.getElementById('fechaFin');
        
        if (fechaInicioInput) {
            fechaInicioInput.addEventListener('change', calcularTotalReserva);
        }
        if (fechaFinInput) {
            fechaFinInput.addEventListener('change', calcularTotalReserva);
        }
        
        // Configurar submit del formulario
        const formReserva = document.getElementById('formReserva');
        if (formReserva) {
            formReserva.addEventListener('submit', async (e) => {
                e.preventDefault();
                await confirmarReserva(herramientaId);
            });
        }
    }, 100);
    
    // Cargar precio inicial
    cargarPrecioHerramienta(herramientaId);
}

async function cargarPrecioHerramienta(herramientaId) {
    try {
        const herramienta = await api.get(`/herramientas/${herramientaId}`, false);
        const precioDiaElement = document.getElementById('precioDia');
        if (precioDiaElement) {
            precioDiaElement.textContent = formatearMoneda(herramienta.precioBaseDia);
            calcularTotalReserva();
        }
    } catch (error) {
        console.error('Error cargando precio:', error);
    }
}

function calcularTotalReserva() {
    const fechaInicioInput = document.getElementById('fechaInicio');
    const fechaFinInput = document.getElementById('fechaFin');
    const precioDiaElement = document.getElementById('precioDia');
    const diasInput = document.getElementById('dias');
    const totalReservaElement = document.getElementById('totalReserva');
    
    if (!fechaInicioInput || !fechaFinInput || !precioDiaElement || !diasInput || !totalReservaElement) {
        return;
    }
    
    const fechaInicio = fechaInicioInput.value;
    const fechaFin = fechaFinInput.value;
    const precioDiaText = precioDiaElement.textContent;
    
    if (fechaInicio && fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        
        if (fin > inicio) {
            const dias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
            diasInput.value = dias;
            
            // Extraer número del precio
            const precioMatch = precioDiaText.match(/[\d,]+/);
            if (precioMatch) {
                const precio = parseFloat(precioMatch[0].replace(/,/g, ''));
                const total = precio * dias;
                totalReservaElement.textContent = formatearMoneda(total);
            }
        }
    }
}

async function confirmarReserva(herramientaId) {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const direccionEntrega = document.getElementById('direccionEntrega').value;
    const notas = document.getElementById('notas').value;
    
    if (!fechaInicio || !fechaFin) {
        mostrarAlerta('Por favor selecciona las fechas', 'warning');
        return;
    }
    
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
        mostrarAlerta('La fecha de fin debe ser posterior a la de inicio', 'warning');
        return;
    }
    
    deshabilitarBoton('btnConfirmarReserva', true);
    
    try {
        const reservaData = {
            herramientaId: herramientaId,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            direccionEntrega: direccionEntrega || null,
            notas: notas || null
        };
        
        const response = await api.post('/reservas', reservaData);
        
        mostrarAlerta('¡Reserva creada exitosamente!', 'success');
        cerrarModal('modalReserva');
        
        // Redirigir a mis reservas
        setTimeout(() => {
            cambiarVista('misReservas');
        }, 1500);
        
    } catch (error) {
        console.error('Error creando reserva:', error);
        mostrarAlerta('Error al crear la reserva: ' + (error.message || 'Intenta nuevamente'), 'danger');
        deshabilitarBoton('btnConfirmarReserva', false);
    }
}

function agregarAFavoritos(herramientaId) {
    // Implementar lógica de favoritos
    mostrarAlerta('Funcionalidad de favoritos próximamente', 'info');
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
                        <button class="btn btn-primary btn-sm" onclick="pagarReserva('${r.id}')">
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

async function verDetalleReserva(id) {
    try {
        const reserva = await api.get(`/reservas/${id}`);
        const herramienta = await api.get(`/herramientas/${reserva.herramientaId}`, false);
        
        const modalBody = `
            <div class="reserva-detalle">
                <h3>Reserva #${reserva.numeroReserva}</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                    <div>
                        <h4>Información de la Reserva</h4>
                        <table class="table-details">
                            <tr>
                                <td><strong>Estado:</strong></td>
                                <td>${obtenerBadgeEstado(reserva.estado, 'RESERVA')}</td>
                            </tr>
                            <tr>
                                <td><strong>Fecha de inicio:</strong></td>
                                <td>${formatearFecha(reserva.fechaInicio)}</td>
                            </tr>
                            <tr>
                                <td><strong>Fecha de fin:</strong></td>
                                <td>${formatearFecha(reserva.fechaFin)}</td>
                            </tr>
                            <tr>
                                <td><strong>Días totales:</strong></td>
                                <td>${reserva.diasTotales} días</td>
                            </tr>
                            <tr>
                                <td><strong>Dirección de entrega:</strong></td>
                                <td>${reserva.direccionEntrega || 'Usar dirección del perfil'}</td>
                            </tr>
                            <tr>
                                <td><strong>Notas:</strong></td>
                                <td>${reserva.notas || 'Sin notas'}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div>
                        <h4>Información de la Herramienta</h4>
                        <table class="table-details">
                            <tr>
                                <td><strong>Nombre:</strong></td>
                                <td>${herramienta.nombre}</td>
                            </tr>
                            <tr>
                                <td><strong>Marca/Modelo:</strong></td>
                                <td>${herramienta.marca || ''} ${herramienta.modelo || ''}</td>
                            </tr>
                            <tr>
                                <td><strong>Precio por día:</strong></td>
                                <td>${formatearMoneda(herramienta.precioBaseDia)}</td>
                            </tr>
                            <tr>
                                <td><strong>Total estimado:</strong></td>
                                <td>${formatearMoneda(reserva.total || herramienta.precioBaseDia * reserva.diasTotales)}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                ${reserva.trackingEnvioIda ? `
                    <div class="alert alert-info">
                        <strong>📦 Información de envío:</strong>
                        <p>Tracking ID: ${reserva.trackingEnvioIda}</p>
                        ${reserva.trackingEnvioRegreso ? `<p>Tracking de retorno: ${reserva.trackingEnvioRegreso}</p>` : ''}
                    </div>
                ` : ''}
                
                <div class="acciones-reserva" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                    ${reserva.estado === 'PENDIENTE_PAGO' ? `
                        <button class="btn btn-primary" onclick="pagarReserva('${reserva.id}')">
                            💳 Pagar Ahora
                        </button>
                        <button class="btn btn-danger" onclick="cancelarReserva('${reserva.id}')">
                            ✖️ Cancelar Reserva
                        </button>
                    ` : ''}
                    
                    ${reserva.estado === 'ENTREGADA' || reserva.estado === 'EN_USO' ? `
                        <button class="btn btn-success" onclick="marcarComoDevuelta('${reserva.id}')">
                            ✅ Marcar como Devuelta
                        </button>
                    ` : ''}
                    
                    ${reserva.estado === 'COMPLETADA' ? `
                        <button class="btn btn-warning" onclick="calificarReserva('${reserva.id}')">
                            ⭐ Calificar Experiencia
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        let modal = document.getElementById('modalDetalleReserva');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalDetalleReserva';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3 class="modal-title">Detalle de Reserva</h3>
                        <button class="modal-close" onclick="cerrarModal('modalDetalleReserva')">✖</button>
                    </div>
                    <div class="modal-body" id="modalDetalleReservaBody"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        document.getElementById('modalDetalleReservaBody').innerHTML = modalBody;
        abrirModal('modalDetalleReserva');
        
    } catch (error) {
        console.error('Error cargando detalle de reserva:', error);
        mostrarAlerta('Error al cargar los detalles de la reserva', 'danger');
    }
}

async function pagarReserva(id) {
    try {
        mostrarAlerta('Redirigiendo al pago...', 'info');
        // Aquí iría la integración con pasarela de pago
        // Por ahora simulamos éxito
        await api.post(`/reservas/${id}/pagar`);
        mostrarAlerta('¡Pago procesado exitosamente!', 'success');
        cargarMisReservas();
        cerrarModal('modalDetalleReserva');
    } catch (error) {
        console.error('Error procesando pago:', error);
        mostrarAlerta('Error al procesar el pago', 'danger');
    }
}

async function cancelarReserva(id) {
    const motivo = prompt('¿Por qué deseas cancelar esta reserva?');
    if (!motivo) return;

    try {
        const userId = localStorage.getItem('userId');
        await api.post(`/reservas/${id}/cancelar?motivo=${encodeURIComponent(motivo)}&canceladoPor=${userId}`);
        mostrarAlerta('Reserva cancelada exitosamente', 'success');
        cargarMisReservas();
        cerrarModal('modalDetalleReserva');
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al cancelar reserva', 'danger');
    }
}

async function marcarComoDevuelta(id) {
    if (!confirm('¿Confirmas que has devuelto la herramienta?')) return;
    
    try {
        await api.post(`/reservas/${id}/devolver`);
        mostrarAlerta('¡Herramienta marcada como devuelta!', 'success');
        cargarMisReservas();
        cerrarModal('modalDetalleReserva');
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al marcar como devuelta', 'danger');
    }
}

function calificarReserva(id) {
    const modalBody = `
        <form id="formCalificacion">
            <input type="hidden" id="reservaId" value="${id}">
            
            <div class="form-group">
                <label class="form-label">Calificación (1-5 estrellas)</label>
                <div class="rating-stars" style="font-size: 30px; margin: 10px 0;">
                    <span onclick="seleccionarEstrella(1)" style="cursor: pointer;">☆</span>
                    <span onclick="seleccionarEstrella(2)" style="cursor: pointer;">☆</span>
                    <span onclick="seleccionarEstrella(3)" style="cursor: pointer;">☆</span>
                    <span onclick="seleccionarEstrella(4)" style="cursor: pointer;">☆</span>
                    <span onclick="seleccionarEstrella(5)" style="cursor: pointer;">☆</span>
                </div>
                <input type="hidden" id="calificacion" value="0">
            </div>
            
            <div class="form-group">
                <label class="form-label">Comentario (opcional)</label>
                <textarea id="comentario" class="form-control" rows="3" 
                          placeholder="¿Cómo fue tu experiencia?"></textarea>
            </div>
            
            <button type="submit" class="btn btn-primary btn-block" id="btnEnviarCalificacion">
                Enviar Calificación
            </button>
        </form>
    `;
    
    let modal = document.getElementById('modalCalificar');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalCalificar';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3 class="modal-title">Calificar Experiencia</h3>
                    <button class="modal-close" onclick="cerrarModal('modalCalificar')">✖</button>
                </div>
                <div class="modal-body" id="modalCalificarBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('modalCalificarBody').innerHTML = modalBody;
    abrirModal('modalCalificar');
    
    // Configurar submit
    document.getElementById('formCalificacion').addEventListener('submit', async (e) => {
        e.preventDefault();
        await enviarCalificacion(id);
    });
}

function seleccionarEstrella(puntuacion) {
    const stars = document.querySelectorAll('.rating-stars span');
    stars.forEach((star, index) => {
        if (index < puntuacion) {
            star.textContent = '★';
            star.style.color = '#ffc107';
        } else {
            star.textContent = '☆';
            star.style.color = '#6c757d';
        }
    });
    document.getElementById('calificacion').value = puntuacion;
}

async function enviarCalificacion(reservaId) {
    const calificacion = document.getElementById('calificacion').value;
    const comentario = document.getElementById('comentario').value;
    
    if (calificacion == 0) {
        mostrarAlerta('Por favor selecciona una calificación', 'warning');
        return;
    }
    
    deshabilitarBoton('btnEnviarCalificacion', true);
    
    try {
        await api.post(`/reservas/${reservaId}/calificar`, {
            calificacion: parseInt(calificacion),
            comentario: comentario || null
        });
        
        mostrarAlerta('¡Gracias por tu calificación!', 'success');
        cerrarModal('modalCalificar');
        cargarMisReservas();
        
    } catch (error) {
        console.error('Error enviando calificación:', error);
        mostrarAlerta('Error al enviar calificación', 'danger');
        deshabilitarBoton('btnEnviarCalificacion', false);
    }
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

// ==================== FUNCIONES AUXILIARES ====================
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