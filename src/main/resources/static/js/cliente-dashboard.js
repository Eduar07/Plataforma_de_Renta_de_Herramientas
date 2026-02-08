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
let herramientasData = [];
let misReservas = [];

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
                <input type="text" class="form-control" id="searchExplorar" placeholder="🔍 Buscar herramientas...">
                <select class="form-select" id="filterPrecio">
                    <option value="">Cualquier precio</option>
                    <option value="0-20000">Hasta $20,000/día</option>
                    <option value="20000-50000">$20,000 - $50,000/día</option>
                    <option value="50000-100000">$50,000 - $100,000/día</option>
                    <option value="100000-999999">Más de $100,000/día</option>
                </select>
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
        herramientasData = await api.get('/herramientas');
        herramientasData = herramientasData.filter(h => h.estado === 'ACTIVO');
        renderizarGridExplorar(herramientasData);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('explorarGrid').innerHTML = `
            <div class="alert alert-danger" style="grid-column: 1/-1;">Error al cargar herramientas</div>
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
                    <img src="${imagen}" alt="${h.nombre}" class="herramienta-image" onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
                    ${h.envioIncluido ? '<span class="badge badge-success" style="position: absolute; top: 10px; left: 10px;">📦 Envío Incluido</span>' : ''}
                </div>
                <div class="herramienta-body">
                    <div class="herramienta-title">${h.nombre}</div>
                    <div class="herramienta-brand">${h.marca || ''} ${h.modelo || ''}</div>
                    <div class="herramienta-price">
                        ${formatearMoneda(h.precioBaseDia)}
                        <span class="herramienta-price-label">/día</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px; font-size: 14px; margin-top: 12px;">
                        <span>⭐</span>
                        <span>${h.calificacionPromedio || 0} (${h.totalCalificaciones || 0})</span>
                    </div>
                </div>
                <div class="herramienta-footer">
                    <button class="btn btn-outline btn-sm" onclick="agregarAFavoritos('${h.id}')">
                        ❤️
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="verDetalleHerramientaCliente('${h.id}')">
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

    let filtered = [...herramientasData];

    if (search) {
        filtered = filtered.filter(h => 
            h.nombre.toLowerCase().includes(search) ||
            (h.marca && h.marca.toLowerCase().includes(search)) ||
            (h.modelo && h.modelo.toLowerCase().includes(search))
        );
    }

    if (filterPrecio) {
        const [min, max] = filterPrecio.split('-').map(Number);
        filtered = filtered.filter(h => h.precioBaseDia >= min && h.precioBaseDia <= max);
    }

    renderizarGridExplorar(filtered);
}

function limpiarFiltrosExplorar() {
    document.getElementById('searchExplorar').value = '';
    document.getElementById('filterPrecio').value = '';
    renderizarGridExplorar(herramientasData);
}

// ========== MODAL DE DETALLE DE HERRAMIENTA ==========
async function verDetalleHerramientaCliente(id) {
    try {
        const herramienta = await api.get(`/herramientas/${id}`);
        
        let proveedorInfo = '';
        if (herramienta.proveedorId) {
            try {
                const proveedor = await api.get(`/usuarios/${herramienta.proveedorId}`);
                proveedorInfo = `
                    <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 12px 0; font-size: 16px;">👤 Proveedor</h4>
                        <p style="margin: 0;"><strong>${proveedor.nombre} ${proveedor.apellido}</strong></p>
                        <p style="margin: 4px 0 0 0; color: #6c757d; font-size: 14px;">
                            Score: ${proveedor.score}/100 | Tel: ${proveedor.telefono || 'No disponible'}
                        </p>
                    </div>
                `;
            } catch (error) {
                console.error('Error cargando proveedor:', error);
            }
        }

        const modalHTML = `
            <div class="modal active" id="modalDetalleHerramientaCliente">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3 class="modal-title">🛠️ Detalle de Herramienta</h3>
                        <button class="modal-close" onclick="cerrarModalDetalleHerramientaCliente()">✖</button>
                    </div>
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 350px 1fr; gap: 30px;">
                            <!-- Columna izquierda: Imagen -->
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
                                    <div style="font-size: 14px; color: #856404; margin-bottom: 8px;">Precio</div>
                                    <div style="font-size: 32px; font-weight: bold; color: #ff8c00;">
                                        ${formatearMoneda(herramienta.precioBaseDia)}
                                        <span style="font-size: 16px; font-weight: normal; color: #6c757d;">/día</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Columna derecha: Información -->
                            <div>
                                <h2 style="margin: 0 0 10px 0; font-size: 28px;">${herramienta.nombre}</h2>
                                <div style="display: flex; gap: 12px; margin-bottom: 20px; align-items: center;">
                                    <span class="badge badge-${herramienta.estado === 'ACTIVO' ? 'success' : 'warning'}">
                                        ${herramienta.estado}
                                    </span>
                                    ${herramienta.envioIncluido ? '<span class="badge badge-info">📦 Envío incluido</span>' : ''}
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #6c757d;">Información</h4>
                                    <div style="display: grid; gap: 8px;">
                                        ${herramienta.marca || herramienta.modelo ? `
                                            <div style="display: flex; gap: 8px;">
                                                <span style="font-weight: 500;">Marca/Modelo:</span>
                                                <span>${herramienta.marca || ''} ${herramienta.modelo || ''}</span>
                                            </div>
                                        ` : ''}
                                        <div style="display: flex; gap: 8px;">
                                            <span style="font-weight: 500;">Categoría:</span>
                                            <span>${herramienta.categoriaNombre || 'Sin categoría'}</span>
                                        </div>
                                        <div style="display: flex; gap: 8px;">
                                            <span style="font-weight: 500;">Calificación:</span>
                                            <span>⭐ ${herramienta.calificacionPromedio || 0} (${herramienta.totalCalificaciones || 0} reseñas)</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="margin-bottom: 20px;">
                                    <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #6c757d;">Descripción</h4>
                                    <p style="margin: 0; line-height: 1.6; white-space: pre-line;">
                                        ${herramienta.descripcion || 'Sin descripción disponible'}
                                    </p>
                                </div>
                                
                                ${herramienta.caracteristicas && herramienta.caracteristicas.length > 0 ? `
                                    <div style="margin-bottom: 20px;">
                                        <h4 style="margin: 0 0 12px 0; font-size: 16px; color: #6c757d;">Características</h4>
                                        <ul style="margin: 0; padding-left: 20px;">
                                            ${herramienta.caracteristicas.map(c => `<li>${c}</li>`).join('')}
                                        </ul>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="cerrarModalDetalleHerramientaCliente()">Cerrar</button>
                        <button class="btn btn-primary btn-lg" onclick="cerrarModalDetalleHerramientaCliente(); iniciarReserva('${herramienta.id}')">
                            📋 Reservar Ahora
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Eliminar modal anterior si existe
        const modalAnterior = document.getElementById('modalDetalleHerramientaCliente');
        if (modalAnterior) {
            modalAnterior.remove();
        }

        // Agregar modal al body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al cargar los detalles de la herramienta', 'danger');
    }
}

function cerrarModalDetalleHerramientaCliente() {
    const modal = document.getElementById('modalDetalleHerramientaCliente');
    if (modal) {
        modal.remove();
    }
}

// ==================== CREAR RESERVA ====================
async function iniciarReserva(herramientaId) {
    try {
        // Cargar detalles de la herramienta
        const herramienta = await api.get(`/herramientas/${herramientaId}`);
        
        const modalHTML = `
            <div class="modal active" id="modalCrearReserva">
                <div class="modal-content" style="max-width: 600px;">
                    <div class="modal-header">
                        <h3 class="modal-title">📋 Nueva Reserva</h3>
                        <button class="modal-close" onclick="cerrarModalReserva()">✖</button>
                    </div>
                    <div class="modal-body">
                        <!-- Info de la herramienta -->
                        <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                            <h4 style="margin: 0 0 12px 0;">${herramienta.nombre}</h4>
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <span style="color: #6c757d;">${herramienta.marca || ''} ${herramienta.modelo || ''}</span>
                                <span style="font-size: 20px; font-weight: bold; color: #ff8c00;">
                                    ${formatearMoneda(herramienta.precioBaseDia)}/día
                                </span>
                            </div>
                        </div>

                        <div id="alertContainerReserva"></div>

                        <form id="formCrearReserva">
                            <input type="hidden" id="herramientaIdReserva" value="${herramientaId}">
                            <input type="hidden" id="precioBaseDiaReserva" value="${herramienta.precioBaseDia}">
                            
                            <div class="form-group">
                                <label class="form-label">Fecha de Inicio *</label>
                                <input type="date" class="form-control" id="fechaInicio" required 
                                       min="${new Date().toISOString().split('T')[0]}">
                            </div>

                            <div class="form-group">
                                <label class="form-label">Fecha de Fin *</label>
                                <input type="date" class="form-control" id="fechaFin" required 
                                       min="${new Date().toISOString().split('T')[0]}">
                            </div>

                            <div class="form-group">
                                <label class="form-label">Dirección de Entrega *</label>
                                <input type="text" class="form-control" id="direccionEntrega" required 
                                       placeholder="Calle 123 #45-67">
                            </div>

                            <div class="form-group">
                                <label class="form-label">Ciudad *</label>
                                <input type="text" class="form-control" id="ciudadEntrega" required 
                                       placeholder="Ej: Bogotá">
                            </div>

                            <div class="form-group">
                                <label class="form-label">Notas adicionales (opcional)</label>
                                <textarea class="form-control" id="notasReserva" rows="3" 
                                          placeholder="Ej: Entregar después de las 2pm"></textarea>
                            </div>

                            <!-- Resumen de costos -->
                            <div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin-top: 20px;">
                                <h5 style="margin: 0 0 12px 0;">💰 Resumen de Costos</h5>
                                <div id="resumenCostos">
                                    <p style="margin: 0; color: #6c757d;">Selecciona las fechas para ver el costo total</p>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="cerrarModalReserva()">Cancelar</button>
                        <button class="btn btn-primary" id="btnConfirmarReserva" onclick="confirmarReserva()" disabled>
                            ✅ Confirmar Reserva
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Eliminar modal anterior si existe
        const modalAnterior = document.getElementById('modalCrearReserva');
        if (modalAnterior) {
            modalAnterior.remove();
        }

        // Agregar modal al body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Agregar event listeners para calcular costo
        document.getElementById('fechaInicio').addEventListener('change', calcularCostoReserva);
        document.getElementById('fechaFin').addEventListener('change', calcularCostoReserva);

    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al cargar la herramienta', 'danger');
    }
}

function cerrarModalReserva() {
    const modal = document.getElementById('modalCrearReserva');
    if (modal) {
        modal.remove();
    }
}

async function calcularCostoReserva() {
    const fechaInicio = document.getElementById('fechaInicio').value;
    const fechaFin = document.getElementById('fechaFin').value;
    const herramientaId = document.getElementById('herramientaIdReserva').value;
    const precioBaseDia = parseFloat(document.getElementById('precioBaseDiaReserva').value);

    if (!fechaInicio || !fechaFin) return;

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (fin <= inicio) {
        document.getElementById('resumenCostos').innerHTML = `
            <p style="margin: 0; color: #dc3545;">❌ La fecha de fin debe ser posterior a la fecha de inicio</p>
        `;
        document.getElementById('btnConfirmarReserva').disabled = true;
        return;
    }

    try {
        // Llamar al endpoint de verificación de disponibilidad
        const disponibilidad = await api.post('/reservas/verificar-disponibilidad', {
            herramientaId: herramientaId,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin
        });

        if (!disponibilidad.disponible) {
            document.getElementById('resumenCostos').innerHTML = `
                <p style="margin: 0; color: #dc3545;">❌ No disponible en estas fechas</p>
                <small>${disponibilidad.mensaje || 'La herramienta ya está reservada en este período'}</small>
            `;
            document.getElementById('btnConfirmarReserva').disabled = true;
            return;
        }

        document.getElementById('btnConfirmarReserva').disabled = false;

        const diasDiferencia = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
        const subtotal = precioBaseDia * diasDiferencia;
        const seguro = subtotal * 0.05; // 5% de seguro
        const total = subtotal + seguro;

        document.getElementById('resumenCostos').innerHTML = `
            <div style="display: grid; gap: 8px;">
                <div style="display: flex; justify-content: space-between;">
                    <span>Días de alquiler:</span>
                    <strong>${diasDiferencia} día(s)</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Precio por día:</span>
                    <span>${formatearMoneda(precioBaseDia)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Subtotal:</span>
                    <span>${formatearMoneda(subtotal)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Seguro (5%):</span>
                    <span>${formatearMoneda(seguro)}</span>
                </div>
                <hr style="margin: 8px 0; border: none; border-top: 2px solid #856404;">
                <div style="display: flex; justify-content: space-between; font-size: 18px;">
                    <strong>Total:</strong>
                    <strong style="color: #ff8c00;">${formatearMoneda(total)}</strong>
                </div>
                <small style="color: #856404; margin-top: 8px;">
                    ✓ Herramienta disponible en estas fechas
                </small>
            </div>
        `;

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('resumenCostos').innerHTML = `
            <p style="margin: 0; color: #dc3545;">❌ Error al verificar disponibilidad: ${error.message}</p>
        `;
        document.getElementById('btnConfirmarReserva').disabled = true;
    }
}

async function confirmarReserva() {
    const form = document.getElementById('formCrearReserva');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const userId = localStorage.getItem('userId');
    const herramientaId = document.getElementById('herramientaIdReserva').value;
    
    try {
        // PASO 1: Obtener la herramienta para sacar el proveedorId
        const herramienta = await api.get(`/herramientas/${herramientaId}`);
        
        if (!herramienta.proveedorId) {
            const alertContainer = document.getElementById('alertContainerReserva');
            if (alertContainer) {
                alertContainer.innerHTML = `
                    <div class="alert alert-danger">
                        ❌ Error: La herramienta no tiene un proveedor asignado
                    </div>
                `;
            }
            return;
        }
        
        // PASO 2: Construir datos de la reserva CON proveedorId
        const datosReserva = {
            herramientaId: herramientaId,
            clienteId: userId,
            proveedorId: herramienta.proveedorId,
            fechaInicio: document.getElementById('fechaInicio').value,
            fechaFin: document.getElementById('fechaFin').value,
            direccionEntrega: document.getElementById('direccionEntrega').value.trim(),
            ciudadEntrega: document.getElementById('ciudadEntrega').value.trim(),
            notasCliente: document.getElementById('notasReserva').value.trim() || null
        };

        console.log('Datos de reserva a enviar:', datosReserva);

        deshabilitarBoton('btnConfirmarReserva', true);

        // PASO 3: Crear la reserva
        const response = await api.post('/reservas', datosReserva);
        
        // Mostrar mensaje de éxito
        const alertContainer = document.getElementById('alertContainerReserva');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-success">
                    ✅ ¡Reserva creada exitosamente!<br>
                    <strong>Número de reserva:</strong> ${response.numeroReserva}<br>
                    <small>Redirigiendo a tus reservas en 2 segundos...</small>
                </div>
            `;
        }

        // Esperar 2 segundos y redirigir
        setTimeout(() => {
            cerrarModalReserva();
            cambiarVista('misReservas');
        }, 2000);

    } catch (error) {
        console.error('Error completo:', error);
        const alertContainer = document.getElementById('alertContainerReserva');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-danger">
                    ❌ Error al crear la reserva: ${error.message}<br>
                    <small>Por favor, intenta nuevamente o contacta al administrador</small>
                </div>
            `;
        }
        deshabilitarBoton('btnConfirmarReserva', false);
    }
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
            <div class="tab active" onclick="filtrarReservasCliente('activas')">Activas</div>
            <div class="tab" onclick="filtrarReservasCliente('completadas')">Completadas</div>
            <div class="tab" onclick="filtrarReservasCliente('canceladas')">Canceladas</div>
        </div>

        <div id="reservasClienteContent">
            <div class="loading">
                <div class="spinner"></div>
                <p class="loading-text">Cargando reservas...</p>
            </div>
        </div>
    `;

    try {
        const userId = localStorage.getItem('userId');
        misReservas = await api.get(`/reservas/cliente/${userId}`);
        filtrarReservasCliente('activas');
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('reservasClienteContent').innerHTML = `
            <div class="alert alert-danger">Error al cargar reservas</div>
        `;
    }
}

function filtrarReservasCliente(tipo) {
    // Actualizar tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event?.target?.classList.add('active');

    let filtered = [];
    
    switch(tipo) {
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

    renderizarReservasCliente(filtered);
}

function renderizarReservasCliente(reservas) {
    const content = document.getElementById('reservasClienteContent');
    
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
                        <strong>Dirección:</strong><br>
                        ${r.direccionEntrega || '-'}
                    </div>
                </div>

                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <button class="btn btn-outline btn-sm" onclick="verDetalleReservaCliente('${r.id}')">
                        👁️ Ver Detalle
                    </button>
                    ${r.estado === 'PENDIENTE_PAGO' ? `
                        <button class="btn btn-primary btn-sm" onclick="pagarReserva('${r.id}')">💳 Pagar Ahora</button>
                        <button class="btn btn-danger btn-sm" onclick="cancelarReservaCliente('${r.id}')">✖️ Cancelar</button>
                    ` : ''}
                    ${r.estado === 'COMPLETADA' ? `
                        <button class="btn btn-sm" style="background-color: #ffc107; color: #000;">⭐ Calificar</button>
                    ` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// ==================== DETALLE DE RESERVA (MODAL) ====================
async function verDetalleReservaCliente(id) {
    try {
        const reserva = await api.get(`/reservas/${id}`);
        const herramienta = await api.get(`/herramientas/${reserva.herramientaId}`);
        
        let detalleReserva = null;
        try {
            detalleReserva = await api.get(`/detalle-reserva/reserva/${id}`);
        } catch (error) {
            console.warn('No se encontró detalle de reserva');
        }

        const modalHTML = `
            <div class="modal active" id="modalDetalleReserva">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3 class="modal-title">📋 Detalle de Reserva #${reserva.numeroReserva}</h3>
                        <button class="modal-close" onclick="cerrarModalDetalleReserva()">✖</button>
                    </div>
                    <div class="modal-body">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
                            <!-- Columna izquierda -->
                            <div>
                                <h4 style="margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #dee2e6;">
                                    🛠️ Herramienta
                                </h4>
                                <div style="margin-bottom: 20px;">
                                    <img src="${herramienta.fotos && herramienta.fotos[0] || 'https://via.placeholder.com/300x200'}" 
                                         style="width: 100%; border-radius: 8px; margin-bottom: 10px;"
                                         onerror="this.src='https://via.placeholder.com/300x200'">
                                    <p style="margin: 0; font-weight: 600; font-size: 18px;">${herramienta.nombre}</p>
                                    <p style="margin: 5px 0 0 0; color: #6c757d;">${herramienta.marca || ''} ${herramienta.modelo || ''}</p>
                                </div>

                                <h4 style="margin: 20px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #dee2e6;">
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
                                </table>
                            </div>

                            <!-- Columna derecha -->
                            <div>
                                <h4 style="margin: 0 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #dee2e6;">
                                    ℹ️ Estado
                                </h4>
                                <div style="margin-bottom: 20px;">
                                    ${obtenerBadgeEstado(reserva.estado, 'RESERVA')}
                                </div>

                                <h4 style="margin: 20px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #dee2e6;">
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
                                            <td>Tracking envío:</td>
                                            <td><code>${reserva.trackingEnvioIda}</code></td>
                                        </tr>
                                    ` : ''}
                                </table>

                                ${detalleReserva ? `
                                    <h4 style="margin: 20px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #dee2e6;">
                                        💰 Costos
                                    </h4>
                                    <table class="table-details">
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
                                                <td style="color: #28a745;">-${formatearMoneda(detalleReserva.descuento)}</td>
                                            </tr>
                                        ` : ''}
                                        <tr style="border-top: 2px solid #dee2e6;">
                                            <td><strong>TOTAL PAGADO:</strong></td>
                                            <td><strong style="color: #ff8c00; font-size: 18px;">${formatearMoneda(detalleReserva.totalPagado)}</strong></td>
                                        </tr>
                                    </table>
                                ` : ''}

                                ${reserva.notasCliente ? `
                                    <h4 style="margin: 20px 0 10px 0;">📝 Notas</h4>
                                    <p style="background: #f8f9fa; padding: 12px; border-radius: 6px; font-size: 14px;">
                                        ${reserva.notasCliente}
                                    </p>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="cerrarModalDetalleReserva()">Cerrar</button>
                        ${reserva.estado === 'PENDIENTE_PAGO' ? `
                            <button class="btn btn-primary" onclick="cerrarModalDetalleReserva(); pagarReserva('${reserva.id}')">
                                💳 Proceder al Pago
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al cargar detalle de reserva', 'danger');
    }
}

function cerrarModalDetalleReserva() {
    const modal = document.getElementById('modalDetalleReserva');
    if (modal) modal.remove();
}

async function cancelarReservaCliente(id) {
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

// ==================== SISTEMA DE FAVORITOS ====================
async function agregarAFavoritos(herramientaId) {
    try {
        const userId = localStorage.getItem('userId');
        await api.post('/usuarios-favoritos', {
            usuarioId: userId,
            herramientaId: herramientaId
        });
        mostrarAlerta('✅ Agregado a favoritos', 'success');
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al agregar a favoritos', 'danger');
    }
}

async function quitarDeFavoritos(favoritoId) {
    try {
        await api.delete(`/usuarios-favoritos/${favoritoId}`);
        mostrarAlerta('❌ Eliminado de favoritos', 'success');
        cargarFavoritos();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al quitar de favoritos', 'danger');
    }
}

async function cargarFavoritos() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">❤️ Mis Favoritos</h1>
            <p class="page-subtitle">Herramientas guardadas</p>
        </div>

        <div class="herramientas-grid" id="favoritosGrid">
            <div class="loading" style="grid-column: 1/-1;">
                <div class="spinner"></div>
                <p class="loading-text">Cargando favoritos...</p>
            </div>
        </div>
    `;

    try {
        const userId = localStorage.getItem('userId');
        const favoritos = await api.get(`/usuarios-favoritos/usuario/${userId}`);
        
        if (favoritos.length === 0) {
            document.getElementById('favoritosGrid').innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <div class="empty-state-icon">❤️</div>
                    <div class="empty-state-title">No tienes favoritos</div>
                    <div class="empty-state-text">Explora herramientas y agrégalas a favoritos</div>
                    <button class="btn btn-primary" onclick="cambiarVista('explorar')">
                        🔍 Explorar Herramientas
                    </button>
                </div>
            `;
            return;
        }

        const herramientasPromises = favoritos.map(f => api.get(`/herramientas/${f.herramientaId}`));
        const herramientas = await Promise.all(herramientasPromises);

        document.getElementById('favoritosGrid').innerHTML = herramientas.map((h, index) => {
            const favorito = favoritos[index];
            const imagen = h.fotos && h.fotos[0] || 'https://via.placeholder.com/300x200';
            
            return `
                <div class="herramienta-card">
                    <img src="${imagen}" alt="${h.nombre}" class="herramienta-image" 
                         onerror="this.src='https://via.placeholder.com/300x200'">
                    <div class="herramienta-body">
                        <div class="herramienta-title">${h.nombre}</div>
                        <div class="herramienta-brand">${h.marca || ''} ${h.modelo || ''}</div>
                        <div class="herramienta-price">
                            ${formatearMoneda(h.precioBaseDia)}
                            <span class="herramienta-price-label">/día</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; font-size: 14px; margin-top: 12px;">
                            <span>⭐ ${h.calificacionPromedio || 0}</span>
                            <span>(${h.totalCalificaciones || 0})</span>
                        </div>
                    </div>
                    <div class="herramienta-footer">
                        <button class="btn btn-danger btn-sm" onclick="quitarDeFavoritos('${favorito.id}')">
                            ❌ Quitar
                        </button>
                        <button class="btn btn-primary btn-sm" onclick="iniciarReserva('${h.id}')">
                            Reservar
                        </button>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('favoritosGrid').innerHTML = `
            <div class="alert alert-danger" style="grid-column: 1/-1;">
                Error al cargar favoritos
            </div>
        `;
    }
}

// ==================== MÓDULO DE PAGO ====================
async function pagarReserva(reservaId) {
    const modalHTML = `
        <div class="modal active" id="modalPago">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3 class="modal-title">💳 Procesar Pago</h3>
                    <button class="modal-close" onclick="cerrarModalPago()">✖</button>
                </div>
                <div class="modal-body">
                    <div id="alertContainerPago"></div>
                    
                    <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 0; color: #6c757d; font-size: 14px;">Reserva:</p>
                        <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: 600;">
                            ${reservaId.substring(0, 8)}...
                        </p>
                    </div>

                    <form id="formPago">
                        <input type="hidden" id="reservaIdPago" value="${reservaId}">

                        <div class="form-group">
                            <label class="form-label">Método de Pago</label>
                            <select class="form-select" id="metodoPago" required>
                                <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
                                <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
                                <option value="PSE">PSE</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Número de Tarjeta</label>
                            <input type="text" class="form-control" id="numeroTarjeta" 
                                   placeholder="1234 5678 9012 3456" maxlength="19" required>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">Fecha de Expiración</label>
                                <input type="text" class="form-control" id="fechaExpiracion" 
                                       placeholder="MM/AA" maxlength="5" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">CVV</label>
                                <input type="text" class="form-control" id="cvv" 
                                       placeholder="123" maxlength="4" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Nombre del Titular</label>
                            <input type="text" class="form-control" id="nombreTitular" 
                                   placeholder="Como aparece en la tarjeta" required>
                        </div>

                        <div style="background: #fff3cd; padding: 12px; border-radius: 6px; font-size: 13px; margin-top: 20px;">
                            <strong>⚠️ Nota:</strong> Esta es una simulación de pago para desarrollo. 
                            En producción se usaría una pasarela real como Wompi o PayU.
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" onclick="cerrarModalPago()">Cancelar</button>
                    <button class="btn btn-primary btn-lg" id="btnProcesarPago" onclick="procesarPago()">
                        💳 Procesar Pago
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Formatear número de tarjeta automáticamente
    document.getElementById('numeroTarjeta').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });

    // Formatear fecha de expiración
    document.getElementById('fechaExpiracion').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
}

function cerrarModalPago() {
    const modal = document.getElementById('modalPago');
    if (modal) modal.remove();
}

async function procesarPago() {
    const form = document.getElementById('formPago');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const reservaId = document.getElementById('reservaIdPago').value;

    deshabilitarBoton('btnProcesarPago', true);

    try {
        // Simular procesamiento de pago
        await new Promise(resolve => setTimeout(resolve, 2000));

        const alertContainer = document.getElementById('alertContainerPago');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-success">
                    ✅ ¡Pago procesado exitosamente!<br>
                    <small>La reserva ahora está en estado PAGADA</small>
                </div>
            `;
        }

        // Actualizar estado de la reserva a PAGADA
        await api.patch(`/reservas/${reservaId}/estado?nuevoEstado=PAGADA`);

        setTimeout(() => {
            cerrarModalPago();
            cambiarVista('misReservas');
            mostrarAlerta('💳 Pago procesado exitosamente', 'success');
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        const alertContainer = document.getElementById('alertContainerPago');
        if (alertContainer) {
            alertContainer.innerHTML = `
                <div class="alert alert-danger">
                    ❌ Error al procesar el pago: ${error.message}
                </div>
            `;
        }
        deshabilitarBoton('btnProcesarPago', false);
    }
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
            <div class="card-body" id="perfilBody">
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

        document.getElementById('perfilBody').innerHTML = `
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
                <button type="submit" class="btn btn-primary" id="guardarPerfilBtn">💾 Guardar Cambios</button>
            </form>
        `;

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

        document.getElementById('perfilForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const datos = {
                nombre: document.getElementById('nombre').value,
                apellido: document.getElementById('apellido').value,
                telefono: document.getElementById('telefono').value,
                direccion: document.getElementById('direccion').value,
                ciudad: document.getElementById('ciudad').value
            };

            deshabilitarBoton('guardarPerfilBtn', true);

            try {
                await api.put(`/usuarios/${userId}`, datos);
                mostrarAlerta('Perfil actualizado exitosamente', 'success');
                localStorage.setItem('userName', `${datos.nombre} ${datos.apellido}`);
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