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
                <button class="btn btn-primary btn-lg" onclick="mostrarFormAgregarHerramienta()">
                    + Agregar Herramienta
                </button>
                <button class="btn btn-outline btn-lg" onclick="cambiarVista('reservas')">
                    📋 Ver Reservas
                </button>
                <button class="btn btn-outline btn-lg" onclick="solicitarRetiro()">
                    💰 Solicitar Retiro
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
        
        // Cargar datos en paralelo
        const [herramientas, reservas] = await Promise.all([
            api.get(`/herramientas/proveedor/${userId}`),
            api.get(`/reservas/proveedor/${userId}`)
        ]);

        // Calcular KPIs
        const herramientasActivas = herramientas.filter(h => h.estado === 'ACTIVO').length;
        const reservasEsteMes = reservas.filter(r => {
            const fecha = new Date(r.created_at);
            const ahora = new Date();
            return fecha.getMonth() === ahora.getMonth() && fecha.getFullYear() === ahora.getFullYear();
        }).length;

        // Calcular ingresos totales
        const reservasPagadas = reservas.filter(r => 
            ['PAGADA', 'CONFIRMADA', 'EN_PREPARACION', 'ENVIADA', 'ENTREGADA', 'EN_USO', 'COMPLETADA'].includes(r.estado)
        );
        const ingresosTotales = reservasPagadas.reduce((total, r) => total + (r.total || 0), 0);
        const saldoDisponible = ingresosTotales * 0.85; // 85% para proveedor, 15% comisión

        // Renderizar KPIs
        document.getElementById('kpiGrid').innerHTML = `
            <div class="kpi-card" style="background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);">
                <div class="kpi-label">Saldo Disponible</div>
                <div class="kpi-value">${formatearMoneda(saldoDisponible)}</div>
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
                <div class="kpi-value">⭐ ${calcularCalificacionPromedio(herramientas)}</div>
                <div class="kpi-change">Promedio</div>
            </div>
        `;

        // Reservas pendientes
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
                        Confirmar
                    </button>
                </div>
            `).join('');
        }

    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al cargar datos del negocio', 'danger');
    }
}

function calcularCalificacionPromedio(herramientas) {
    if (herramientas.length === 0) return '0.0';
    
    const totalCalificaciones = herramientas.reduce((sum, h) => {
        const calificacion = parseFloat(h.calificacionPromedio) || 0;
        const cantidad = h.totalCalificaciones || 1;
        return sum + (calificacion * cantidad);
    }, 0);
    
    const totalResenas = herramientas.reduce((sum, h) => sum + (h.totalCalificaciones || 0), 0);
    
    return totalResenas > 0 ? (totalCalificaciones / totalResenas).toFixed(1) : '0.0';
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
            <div class="alert alert-danger" style="grid-column: 1/-1;">
                Error al cargar herramientas
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
                <img src="${imagen}" alt="${h.nombre}" class="herramienta-image" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
                <div class="herramienta-body">
                    <div class="herramienta-title">${h.nombre}</div>
                    <div class="herramienta-brand">${h.marca || ''} ${h.modelo || ''}</div>
                    <div class="herramienta-price">
                        ${formatearMoneda(h.precioBaseDia)}
                        <span class="herramienta-price-label">/día</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 14px; margin-top: 12px;">
                        <span title="Calificación">⭐ ${h.calificacionPromedio || 0}</span>
                        <span title="Vistas">👁️ ${h.vistas || 0}</span>
                        <span title="Alquileres">📋 ${h.totalAlquileres || 0}</span>
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

function mostrarFormAgregarHerramienta() {
    const modalBody = `
        <form id="formAgregarHerramienta" enctype="multipart/form-data">
            <div class="form-group">
                <label class="form-label">Nombre de la Herramienta *</label>
                <input type="text" id="nombre" class="form-control" required 
                       placeholder="Ej: Taladro Percutor 1/2''">
            </div>
            
            <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label class="form-label">Marca</label>
                    <input type="text" id="marca" class="form-control" 
                           placeholder="Ej: DeWalt, Bosch">
                </div>
                
                <div class="form-group">
                    <label class="form-label">Modelo</label>
                    <input type="text" id="modelo" class="form-control" 
                           placeholder="Ej: DCD791D2">
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Descripción *</label>
                <textarea id="descripcion" class="form-control" rows="3" required 
                          placeholder="Describe tu herramienta..."></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Precio por Día (COP) *</label>
                <input type="number" id="precioBaseDia" class="form-control" 
                       min="1000" step="1000" required placeholder="Ej: 25000">
            </div>
            
            <div class="form-group">
                <label class="form-label">Categoría *</label>
                <select id="categoriaId" class="form-select" required>
                    <option value="">Selecciona una categoría...</option>
                    <!-- Las categorías se cargarán dinámicamente -->
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">Características (una por línea)</label>
                <textarea id="caracteristicas" class="form-control" rows="3" 
                          placeholder="Potente motor de 650W
Batería de litio 20V
Incluye 2 baterías
Maletín de transporte"></textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">Condiciones de Uso</label>
                <textarea id="condicionesUso" class="form-control" rows="3" 
                          placeholder="Condiciones para el alquiler..."></textarea>
            </div>
            
            <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div class="form-group">
                    <label class="form-checkbox">
                        <input type="checkbox" id="envioIncluido">
                        <span>Envío incluido en el precio</span>
                    </label>
                </div>
                
                <div class="form-group">
                    <label class="form-checkbox">
                        <input type="checkbox" id="garantia">
                        <span>Ofrece garantía</span>
                    </label>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Imágenes de la Herramienta (Máx. 5)</label>
                <input type="file" id="imagenes" class="form-control" 
                       accept="image/*" multiple>
                <small style="color: #6c757d;">Formatos: JPG, PNG. Tamaño máximo: 5MB por imagen</small>
            </div>
            
            <div id="previewImagenes" style="margin-top: 10px;"></div>
            
            <div class="form-actions" style="margin-top: 20px;">
                <button type="submit" class="btn btn-primary" id="btnGuardarHerramienta">
                    Publicar Herramienta
                </button>
                <button type="button" class="btn btn-secondary" onclick="cerrarModal('modalAgregarHerramienta')">
                    Cancelar
                </button>
            </div>
        </form>
    `;
    
    // Crear o usar modal existente
    let modal = document.getElementById('modalAgregarHerramienta');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalAgregarHerramienta';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 700px; max-height: 80vh; overflow-y: auto;">
                <div class="modal-header">
                    <h3 class="modal-title">Agregar Nueva Herramienta</h3>
                    <button class="modal-close" onclick="cerrarModal('modalAgregarHerramienta')">✖</button>
                </div>
                <div class="modal-body" id="modalAgregarHerramientaBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('modalAgregarHerramientaBody').innerHTML = modalBody;
    abrirModal('modalAgregarHerramienta');
    
    // Cargar categorías
    cargarCategorias();
    
    // Configurar preview de imágenes
    setTimeout(() => {
        const imagenesInput = document.getElementById('imagenes');
        if (imagenesInput) {
            imagenesInput.addEventListener('change', previewImagenes);
        }
        
        // Configurar submit del formulario
        const form = document.getElementById('formAgregarHerramienta');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await guardarHerramienta();
            });
        }
    }, 100);
}

async function cargarCategorias() {
    try {
        const categorias = await api.get('/categorias', false);
        const select = document.getElementById('categoriaId');
        
        if (select) {
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.nombre;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error cargando categorías:', error);
    }
}

function previewImagenes(event) {
    const preview = document.getElementById('previewImagenes');
    if (!preview) return;
    
    preview.innerHTML = '';
    
    const files = event.target.files;
    if (files.length > 5) {
        mostrarAlerta('Máximo 5 imágenes permitidas', 'warning');
        event.target.value = '';
        return;
    }
    
    for (let i = 0; i < Math.min(files.length, 5); i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) { // 5MB
            mostrarAlerta(`La imagen "${file.name}" excede el tamaño máximo de 5MB`, 'warning');
            continue;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgContainer = document.createElement('div');
            imgContainer.style.cssText = `
                display: inline-block;
                margin: 5px;
                position: relative;
            `;
            
            imgContainer.innerHTML = `
                <img src="${e.target.result}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 8px;">
                <button type="button" onclick="removerImagen(${i})" style="
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 12px;
                    cursor: pointer;
                ">×</button>
            `;
            
            preview.appendChild(imgContainer);
        };
        reader.readAsDataURL(file);
    }
}

function removerImagen(index) {
    const input = document.getElementById('imagenes');
    if (!input) return;
    
    const files = Array.from(input.files);
    files.splice(index, 1);
    
    // Crear nuevo DataTransfer
    const dt = new DataTransfer();
    files.forEach(file => dt.items.add(file));
    input.files = dt.files;
    
    // Refrescar preview
    previewImagenes({ target: input });
}

async function guardarHerramienta() {
    const nombre = document.getElementById('nombre');
    const descripcion = document.getElementById('descripcion');
    const precioBaseDia = document.getElementById('precioBaseDia');
    const categoriaId = document.getElementById('categoriaId');
    
    if (!nombre || !descripcion || !precioBaseDia || !categoriaId) {
        mostrarAlerta('Error: No se pudo cargar el formulario', 'danger');
        return;
    }
    
    if (!nombre.value || !descripcion.value || !precioBaseDia.value || !categoriaId.value) {
        mostrarAlerta('Por favor completa todos los campos obligatorios', 'warning');
        return;
    }
    
    const formData = new FormData();
    
    // Agregar datos básicos
    formData.append('nombre', nombre.value);
    formData.append('descripcion', descripcion.value);
    formData.append('precioBaseDia', precioBaseDia.value);
    formData.append('categoriaId', categoriaId.value);
    formData.append('envioIncluido', document.getElementById('envioIncluido').checked);
    formData.append('garantia', document.getElementById('garantia').checked);
    
    // Datos opcionales
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const caracteristicas = document.getElementById('caracteristicas').value;
    const condicionesUso = document.getElementById('condicionesUso').value;
    
    if (marca) formData.append('marca', marca);
    if (modelo) formData.append('modelo', modelo);
    if (caracteristicas) formData.append('caracteristicas', caracteristicas);
    if (condicionesUso) formData.append('condicionesUso', condicionesUso);
    
    // Agregar imágenes
    const imagenesInput = document.getElementById('imagenes');
    if (imagenesInput && imagenesInput.files.length > 0) {
        for (let i = 0; i < imagenesInput.files.length; i++) {
            formData.append('fotos', imagenesInput.files[i]);
        }
    }
    
    deshabilitarBoton('btnGuardarHerramienta', true);
    
    try {
        // Usar fetch directamente para FormData
        const token = localStorage.getItem('token');
        const API_BASE_URL = window.API_BASE_URL || 'http://localhost:8080/api';
        
        const response = await fetch(`${API_BASE_URL}/herramientas`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // NO incluir 'Content-Type': fetch lo hará automáticamente con FormData
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        mostrarAlerta('¡Herramienta publicada exitosamente!', 'success');
        cerrarModal('modalAgregarHerramienta');
        
        // Recargar la lista de herramientas
        cargarMisHerramientas();
        
    } catch (error) {
        console.error('Error guardando herramienta:', error);
        mostrarAlerta('Error: ' + error.message, 'danger');
        deshabilitarBoton('btnGuardarHerramienta', false);
    }
}

async function editarHerramienta(id) {
    try {
        const herramienta = await api.get(`/herramientas/${id}`);
        
        const modalBody = `
            <form id="formEditarHerramienta">
                <input type="hidden" id="herramientaId" value="${herramienta.id}">
                
                <div class="form-group">
                    <label class="form-label">Nombre de la Herramienta *</label>
                    <input type="text" id="nombre" class="form-control" value="${herramienta.nombre}" required>
                </div>
                
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label class="form-label">Marca</label>
                        <input type="text" id="marca" class="form-control" value="${herramienta.marca || ''}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Modelo</label>
                        <input type="text" id="modelo" class="form-control" value="${herramienta.modelo || ''}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Descripción *</label>
                    <textarea id="descripcion" class="form-control" rows="3" required>${herramienta.descripcion || ''}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Precio por Día (COP) *</label>
                    <input type="number" id="precioBaseDia" class="form-control" 
                           value="${herramienta.precioBaseDia}" min="1000" step="1000" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Características (una por línea)</label>
                    <textarea id="caracteristicas" class="form-control" rows="3">${(herramienta.caracteristicas || []).join('\n')}</textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Condiciones de Uso</label>
                    <textarea id="condicionesUso" class="form-control" rows="3">${herramienta.condicionesUso || ''}</textarea>
                </div>
                
                <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                    <div class="form-group">
                        <label class="form-checkbox">
                            <input type="checkbox" id="envioIncluido" ${herramienta.envioIncluido ? 'checked' : ''}>
                            <span>Envío incluido en el precio</span>
                        </label>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-checkbox">
                            <input type="checkbox" id="garantia" ${herramienta.garantia ? 'checked' : ''}>
                            <span>Ofrece garantía</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-actions" style="margin-top: 20px;">
                    <button type="submit" class="btn btn-primary" id="btnActualizarHerramienta">
                        Actualizar Herramienta
                    </button>
                    <button type="button" class="btn btn-secondary" onclick="cerrarModal('modalEditarHerramienta')">
                        Cancelar
                    </button>
                </div>
            </form>
        `;
        
        let modal = document.getElementById('modalEditarHerramienta');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalEditarHerramienta';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 700px;">
                    <div class="modal-header">
                        <h3 class="modal-title">Editar Herramienta</h3>
                        <button class="modal-close" onclick="cerrarModal('modalEditarHerramienta')">✖</button>
                    </div>
                    <div class="modal-body" id="modalEditarHerramientaBody"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        document.getElementById('modalEditarHerramientaBody').innerHTML = modalBody;
        abrirModal('modalEditarHerramienta');
        
        // Configurar submit del formulario
        document.getElementById('formEditarHerramienta').addEventListener('submit', async (e) => {
            e.preventDefault();
            await actualizarHerramienta(id);
        });
        
    } catch (error) {
        console.error('Error cargando herramienta para editar:', error);
        mostrarAlerta('Error al cargar la herramienta', 'danger');
    }
}

async function actualizarHerramienta(id) {
    const datosActualizados = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precioBaseDia: document.getElementById('precioBaseDia').value,
        envioIncluido: document.getElementById('envioIncluido').checked,
        garantia: document.getElementById('garantia').checked,
        marca: document.getElementById('marca').value || null,
        modelo: document.getElementById('modelo').value || null,
        caracteristicas: document.getElementById('caracteristicas').value.split('\n').filter(c => c.trim() !== ''),
        condicionesUso: document.getElementById('condicionesUso').value || null
    };
    
    deshabilitarBoton('btnActualizarHerramienta', true);
    
    try {
        await api.put(`/herramientas/${id}`, datosActualizados);
        mostrarAlerta('¡Herramienta actualizada exitosamente!', 'success');
        cerrarModal('modalEditarHerramienta');
        cargarMisHerramientas();
    } catch (error) {
        console.error('Error actualizando herramienta:', error);
        mostrarAlerta('Error al actualizar la herramienta', 'danger');
        deshabilitarBoton('btnActualizarHerramienta', false);
    }
}

async function toggleEstadoHerramienta(id, estadoActual) {
    const nuevoEstado = estadoActual === 'ACTIVO' ? 'PAUSADO' : 'ACTIVO';
    const confirmacion = estadoActual === 'ACTIVO' 
        ? '¿Estás seguro de pausar esta herramienta? No estará disponible para reservas.'
        : '¿Estás seguro de activar esta herramienta? Estará disponible para reservas.';
    
    if (!confirm(confirmacion)) return;
    
    try {
        await api.patch(`/herramientas/${id}/estado?estado=${nuevoEstado}`);
        mostrarAlerta(`Herramienta ${nuevoEstado === 'ACTIVO' ? 'activada' : 'pausada'} exitosamente`, 'success');
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
                <div class="empty-state-text">${event?.target?.textContent.includes('Nuevas') ? 
                    'No hay reservas nuevas pendientes' : 
                    'No hay reservas en esta categoría'}</div>
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
                    <div>
                        <strong>Total:</strong><br>
                        ${formatearMoneda(r.total || 0)}
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
                    ${r.estado === 'ENVIADA' ? `
                        <button class="btn btn-success btn-sm" onclick="marcarComoEntregada('${r.id}')">
                            ✅ Marcar como Entregada
                        </button>
                    ` : ''}
                    ${r.estado === 'EN_USO' || r.estado === 'ENTREGADA' ? `
                        <button class="btn btn-success btn-sm" onclick="marcarComoDevuelta('${r.id}')">
                            ↩️ Marcar como Devuelta
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
    
    const datos = {};
    if (tracking) {
        datos.trackingEnvioIda = tracking;
    }
    
    try {
        await api.patch(`/reservas/${id}/estado?nuevoEstado=ENVIADA`);
        
        if (tracking) {
            await api.put(`/reservas/${id}`, datos);
        }
        
        mostrarAlerta('Reserva marcada como enviada', 'success');
        cargarReservas();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al actualizar reserva', 'danger');
    }
}

async function marcarComoEntregada(id) {
    if (!confirm('¿Confirmas que la herramienta ha sido entregada al cliente?')) return;
    
    try {
        await api.patch(`/reservas/${id}/estado?nuevoEstado=ENTREGADA`);
        mostrarAlerta('Reserva marcada como entregada', 'success');
        cargarReservas();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al actualizar reserva', 'danger');
    }
}

async function marcarComoDevuelta(id) {
    const tracking = prompt('Ingresa el número de tracking para el retorno (opcional):');
    
    const datos = {};
    if (tracking) {
        datos.trackingEnvioRegreso = tracking;
    }
    
    try {
        await api.patch(`/reservas/${id}/estado?nuevoEstado=DEVUELTA`);
        
        if (tracking) {
            await api.put(`/reservas/${id}`, datos);
        }
        
        mostrarAlerta('Reserva marcada como devuelta', 'success');
        cargarReservas();
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al actualizar reserva', 'danger');
    }
}

async function verDetalleReservaProveedor(id) {
    try {
        const reserva = await api.get(`/reservas/${id}`);
        const cliente = await api.get(`/usuarios/${reserva.clienteId}`);
        const herramienta = await api.get(`/herramientas/${reserva.herramientaId}`, false);
        
        const modalBody = `
            <div class="reserva-detalle-proveedor">
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
                                <td><strong>Total:</strong></td>
                                <td>${formatearMoneda(reserva.total || 0)}</td>
                            </tr>
                            <tr>
                                <td><strong>Tu ganancia (85%):</strong></td>
                                <td style="color: #28a745; font-weight: bold;">${formatearMoneda((reserva.total || 0) * 0.85)}</td>
                            </tr>
                        </table>
                        
                        ${reserva.trackingEnvioIda ? `
                            <div style="margin-top: 10px;">
                                <strong>Tracking ID de envío:</strong> ${reserva.trackingEnvioIda}
                            </div>
                        ` : ''}
                        
                        ${reserva.trackingEnvioRegreso ? `
                            <div style="margin-top: 5px;">
                                <strong>Tracking ID de retorno:</strong> ${reserva.trackingEnvioRegreso}
                            </div>
                        ` : ''}
                        
                        ${reserva.direccionEntrega ? `
                            <div style="margin-top: 10px;">
                                <strong>Dirección de entrega:</strong><br>
                                ${reserva.direccionEntrega}
                            </div>
                        ` : ''}
                        
                        ${reserva.notas ? `
                            <div style="margin-top: 10px;">
                                <strong>Notas del cliente:</strong><br>
                                ${reserva.notas}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div>
                        <h4>Información del Cliente</h4>
                        <table class="table-details">
                            <tr>
                                <td><strong>Nombre:</strong></td>
                                <td>${cliente.nombre} ${cliente.apellido}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>${cliente.email}</td>
                            </tr>
                            <tr>
                                <td><strong>Teléfono:</strong></td>
                                <td>${cliente.telefono || 'No disponible'}</td>
                            </tr>
                            <tr>
                                <td><strong>Score:</strong></td>
                                <td>${cliente.score || 0}/100</td>
                            </tr>
                        </table>
                        
                        <h4 style="margin-top: 20px;">Información de la Herramienta</h4>
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
                        </table>
                    </div>
                </div>
                
                <div class="acciones-reserva" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                    ${reserva.estado === 'PAGADA' ? `
                        <button class="btn btn-primary" onclick="confirmarReserva('${reserva.id}')">
                            ✓ Confirmar Reserva
                        </button>
                        <button class="btn btn-danger" onclick="rechazarReserva('${reserva.id}')">
                            ✖ Rechazar Reserva
                        </button>
                    ` : ''}
                    
                    ${reserva.estado === 'CONFIRMADA' ? `
                        <button class="btn btn-primary" onclick="marcarComoEnviada('${reserva.id}')">
                            📦 Marcar como Enviada
                        </button>
                    ` : ''}
                    
                    ${reserva.estado === 'ENVIADA' ? `
                        <button class="btn btn-success" onclick="marcarComoEntregada('${reserva.id}')">
                            ✅ Marcar como Entregada
                        </button>
                    ` : ''}
                    
                    ${reserva.estado === 'ENTREGADA' || reserva.estado === 'EN_USO' ? `
                        <button class="btn btn-success" onclick="marcarComoDevuelta('${reserva.id}')">
                            ↩️ Marcar como Devuelta
                        </button>
                    ` : ''}
                    
                    ${reserva.estado === 'DEVUELTA' ? `
                        <button class="btn btn-success" onclick="completarReserva('${reserva.id}')">
                            ✅ Completar Reserva
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
        
        let modal = document.getElementById('modalDetalleReservaProveedor');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'modalDetalleReservaProveedor';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3 class="modal-title">Detalle de Reserva</h3>
                        <button class="modal-close" onclick="cerrarModal('modalDetalleReservaProveedor')">✖</button>
                    </div>
                    <div class="modal-body" id="modalDetalleReservaProveedorBody"></div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        document.getElementById('modalDetalleReservaProveedorBody').innerHTML = modalBody;
        abrirModal('modalDetalleReservaProveedor');
        
    } catch (error) {
        console.error('Error cargando detalle de reserva:', error);
        mostrarAlerta('Error al cargar los detalles de la reserva', 'danger');
    }
}

async function rechazarReserva(id) {
    const motivo = prompt('¿Por qué deseas rechazar esta reserva?');
    if (!motivo) return;

    try {
        await api.post(`/reservas/${id}/cancelar?motivo=${encodeURIComponent(motivo)}&canceladoPor=PROVEEDOR`);
        mostrarAlerta('Reserva rechazada exitosamente', 'success');
        cargarReservas();
        cerrarModal('modalDetalleReservaProveedor');
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al rechazar reserva', 'danger');
    }
}

async function completarReserva(id) {
    if (!confirm('¿Confirmas que has recibido la herramienta en buen estado?')) return;
    
    try {
        await api.patch(`/reservas/${id}/estado?nuevoEstado=COMPLETADA`);
        mostrarAlerta('¡Reserva completada exitosamente!', 'success');
        cargarReservas();
        cerrarModal('modalDetalleReservaProveedor');
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('Error al completar reserva', 'danger');
    }
}

// ==================== BILLETERA ====================
async function cargarBilletera() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">💰 Mi Billetera</h1>
            <p class="page-subtitle">Gestiona tus ingresos y retiros</p>
        </div>

        <div class="kpi-grid" id="kpiBilletera">
            <div class="loading" style="grid-column: 1/-1;">
                <div class="spinner"></div>
                <p class="loading-text">Cargando información...</p>
            </div>
        </div>

        <div class="card">
            <div class="card-header">📊 Historial de Movimientos</div>
            <div class="card-body" id="historialMovimientos">
                <div class="loading">
                    <div class="spinner"></div>
                </div>
            </div>
        </div>
    `;

    try {
        const userId = localStorage.getItem('userId');
        const [movimientos, estadisticas] = await Promise.all([
            api.get(`/billetera/movimientos`),
            api.get(`/billetera/estadisticas`)
        ]);

        // Renderizar KPIs de billetera
        document.getElementById('kpiBilletera').innerHTML = `
            <div class="kpi-card" style="background: linear-gradient(135deg, #28A745 0%, #1e7e34 100%);">
                <div class="kpi-label">Saldo Disponible</div>
                <div class="kpi-value">${formatearMoneda(estadisticas.saldoDisponible || 0)}</div>
                <button class="btn btn-primary btn-sm" style="margin-top: 16px;" onclick="solicitarRetiro()">
                    💸 Solicitar Retiro
                </button>
            </div>
            <div class="kpi-card" style="background: linear-gradient(135deg, #FFC107 0%, #e0a800 100%);">
                <div class="kpi-label">Saldo Retenido</div>
                <div class="kpi-value">${formatearMoneda(estadisticas.saldoRetenido || 0)}</div>
                <div class="kpi-change">Temporal</div>
            </div>
            <div class="kpi-card" style="background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);">
                <div class="kpi-label">Total Acumulado</div>
                <div class="kpi-value">${formatearMoneda(estadisticas.totalAcumulado || 0)}</div>
                <div class="kpi-change">Histórico</div>
            </div>
            <div class="kpi-card" style="background: linear-gradient(135deg, #6F42C1 0%, #593196 100%);">
                <div class="kpi-label">Retiros Pendientes</div>
                <div class="kpi-value">${estadisticas.retirosPendientes || 0}</div>
                <div class="kpi-change">En proceso</div>
            </div>
        `;

        // Renderizar historial
        renderizarHistorialMovimientos(movimientos);

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('kpiBilletera').innerHTML = `
            <div class="alert alert-danger" style="grid-column: 1/-1;">
                Error al cargar información de billetera
            </div>
        `;
    }
}

function renderizarHistorialMovimientos(movimientos) {
    const content = document.getElementById('historialMovimientos');
    
    if (!movimientos || movimientos.length === 0) {
        content.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💰</div>
                <div class="empty-state-title">No hay movimientos</div>
                <div class="empty-state-text">Tus movimientos aparecerán aquí</div>
            </div>
        `;
        return;
    }

    content.innerHTML = `
        <div class="table-container">
            <table class="table">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Descripción</th>
                        <th>Tipo</th>
                        <th>Monto</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    ${movimientos.map(m => `
                        <tr>
                            <td>${formatearFechaHora(m.fecha)}</td>
                            <td>${m.descripcion}</td>
                            <td>
                                <span class="badge badge-${m.tipo === 'INGRESO' ? 'success' : 
                                                       m.tipo === 'RETIRO' ? 'warning' : 'info'}">
                                    ${m.tipo}
                                </span>
                            </td>
                            <td class="${m.tipo === 'INGRESO' ? 'text-success' : 
                                      m.tipo === 'RETIRO' ? 'text-danger' : ''}">
                                ${m.tipo === 'INGRESO' ? '+' : '-'} ${formatearMoneda(m.monto)}
                            </td>
                            <td>
                                <span class="badge badge-${m.estado === 'COMPLETADO' ? 'success' : 
                                                       m.estado === 'PENDIENTE' ? 'warning' : 
                                                       m.estado === 'RECHAZADO' ? 'danger' : 'info'}">
                                    ${m.estado}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function solicitarRetiro() {
    const modalBody = `
        <form id="formSolicitarRetiro">
            <div class="form-group">
                <label class="form-label">Monto a Retirar *</label>
                <input type="number" id="monto" class="form-control" 
                       min="50000" step="1000" required
                       placeholder="Mínimo $50,000">
                <small style="color: #6c757d;">Monto mínimo: $50,000</small>
            </div>
            
            <div class="form-group">
                <label class="form-label">Método de Retiro *</label>
                <select id="metodoRetiro" class="form-select" required>
                    <option value="">Selecciona...</option>
                    <option value="TRANSFERENCIA_BANCARIA">Transferencia Bancaria</option>
                    <option value="NEQUI">Nequi</option>
                    <option value="DAVIPLATA">DaviPlata</option>
                    <option value="EFECTY">Efecty</option>
                </select>
            </div>
            
            <div id="detallesTransferencia" style="display: none;">
                <div class="form-group">
                    <label class="form-label">Tipo de Cuenta</label>
                    <select id="tipoCuenta" class="form-select">
                        <option value="AHORROS">Ahorros</option>
                        <option value="CORRIENTE">Corriente</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Número de Cuenta *</label>
                    <input type="text" id="numeroCuenta" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Banco *</label>
                    <input type="text" id="banco" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Titular de la Cuenta *</label>
                    <input type="text" id="titularCuenta" class="form-control" required>
                </div>
            </div>
            
            <div id="detallesBilletera" style="display: none;">
                <div class="form-group">
                    <label class="form-label">Número de Celular *</label>
                    <input type="tel" id="numeroCelular" class="form-control" required>
                </div>
            </div>
            
            <div id="detallesEfecty" style="display: none;">
                <div class="form-group">
                    <label class="form-label">Documento de Identidad *</label>
                    <input type="text" id="documentoEfecty" class="form-control" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Nombre Completo *</label>
                    <input type="text" id="nombreEfecty" class="form-control" required>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">Notas (Opcional)</label>
                <textarea id="notas" class="form-control" rows="2" 
                          placeholder="Información adicional..."></textarea>
            </div>
            
            <div class="alert alert-info" style="margin: 20px 0;">
                <strong>⚠️ Importante:</strong>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    <li>Los retiros se procesan en 3-5 días hábiles</li>
                    <li>Se aplica una comisión del 2% por transacción</li>
                    <li>Monto mínimo de retiro: $50,000</li>
                    <li>Verifica que la información sea correcta</li>
                </ul>
            </div>
            
            <div class="form-actions" style="margin-top: 20px;">
                <button type="submit" class="btn btn-primary" id="btnSolicitarRetiro">
                    Solicitar Retiro
                </button>
                <button type="button" class="btn btn-secondary" onclick="cerrarModal('modalSolicitarRetiro')">
                    Cancelar
                </button>
            </div>
        </form>
    `;
    
    let modal = document.getElementById('modalSolicitarRetiro');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalSolicitarRetiro';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3 class="modal-title">Solicitar Retiro</h3>
                    <button class="modal-close" onclick="cerrarModal('modalSolicitarRetiro')">✖</button>
                </div>
                <div class="modal-body" id="modalSolicitarRetiroBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('modalSolicitarRetiroBody').innerHTML = modalBody;
    abrirModal('modalSolicitarRetiro');
    
    // Mostrar/ocultar campos según método de retiro
    setTimeout(() => {
        const metodoSelect = document.getElementById('metodoRetiro');
        if (metodoSelect) {
            metodoSelect.addEventListener('change', function() {
                const metodo = this.value;
                document.getElementById('detallesTransferencia').style.display = 
                    metodo === 'TRANSFERENCIA_BANCARIA' ? 'block' : 'none';
                document.getElementById('detallesBilletera').style.display = 
                    ['NEQUI', 'DAVIPLATA'].includes(metodo) ? 'block' : 'none';
                document.getElementById('detallesEfecty').style.display = 
                    metodo === 'EFECTY' ? 'block' : 'none';
            });
        }
        
        // Configurar submit
        const form = document.getElementById('formSolicitarRetiro');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await enviarSolicitudRetiro();
            });
        }
    }, 100);
}

async function enviarSolicitudRetiro() {
    const monto = parseFloat(document.getElementById('monto').value);
    const metodoRetiro = document.getElementById('metodoRetiro').value;
    
    if (monto < 50000) {
        mostrarAlerta('El monto mínimo de retiro es $50,000', 'warning');
        return;
    }
    
    const datosRetiro = {
        monto: monto,
        metodoRetiro: metodoRetiro,
        notas: document.getElementById('notas').value || null
    };
    
    // Agregar detalles según método
    if (metodoRetiro === 'TRANSFERENCIA_BANCARIA') {
        datosRetiro.tipoCuenta = document.getElementById('tipoCuenta').value;
        datosRetiro.numeroCuenta = document.getElementById('numeroCuenta').value;
        datosRetiro.banco = document.getElementById('banco').value;
        datosRetiro.titularCuenta = document.getElementById('titularCuenta').value;
    } else if (['NEQUI', 'DAVIPLATA'].includes(metodoRetiro)) {
        datosRetiro.numeroCelular = document.getElementById('numeroCelular').value;
    } else if (metodoRetiro === 'EFECTY') {
        datosRetiro.documentoIdentidad = document.getElementById('documentoEfecty').value;
        datosRetiro.nombreCompleto = document.getElementById('nombreEfecty').value;
    }
    
    deshabilitarBoton('btnSolicitarRetiro', true);
    
    try {
        await api.post('/billetera/retiros', datosRetiro);
        
        mostrarAlerta('¡Solicitud de retiro enviada exitosamente!', 'success');
        cerrarModal('modalSolicitarRetiro');
        
        // Recargar billetera
        cargarBilletera();
        
    } catch (error) {
        console.error('Error solicitando retiro:', error);
        mostrarAlerta('Error: ' + (error.message || 'No se pudo procesar la solicitud'), 'danger');
        deshabilitarBoton('btnSolicitarRetiro', false);
    }
}

// ==================== ESTADÍSTICAS ====================
async function cargarEstadisticas() {
    const mainContent = document.getElementById('mainContent');
    
    mainContent.innerHTML = `
        <div class="page-header">
            <h1 class="page-title">📈 Estadísticas</h1>
            <p class="page-subtitle">Analiza el rendimiento de tu negocio</p>
        </div>

        <div id="estadisticasContent">
            <div class="loading">
                <div class="spinner"></div>
                <p class="loading-text">Cargando estadísticas...</p>
            </div>
        </div>
    `;

    try {
        const userId = localStorage.getItem('userId');
        const estadisticas = await api.get(`/proveedor/estadisticas/${userId}`);
        
        renderizarEstadisticas(estadisticas);
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('estadisticasContent').innerHTML = `
            <div class="alert alert-danger">
                Error al cargar estadísticas. Prueba nuevamente más tarde.
            </div>
        `;
    }
}

function renderizarEstadisticas(estadisticas) {
    const content = document.getElementById('estadisticasContent');
    
    content.innerHTML = `
        <div class="kpi-grid" style="margin-bottom: 30px;">
            <div class="kpi-card" style="background: linear-gradient(135deg, #007BFF 0%, #0056b3 100%);">
                <div class="kpi-label">Ingresos del Mes</div>
                <div class="kpi-value">${formatearMoneda(estadisticas.ingresosMes || 0)}</div>
                <div class="kpi-change">${estadisticas.cambioIngresos >= 0 ? '↗' : '↘'} ${Math.abs(estadisticas.cambioIngresos || 0)}% vs mes anterior</div>
            </div>
            <div class="kpi-card" style="background: linear-gradient(135deg, #28A745 0%, #1e7e34 100%);">
                <div class="kpi-label">Reservas del Mes</div>
                <div class="kpi-value">${estadisticas.reservasMes || 0}</div>
                <div class="kpi-change">${estadisticas.cambioReservas >= 0 ? '↗' : '↘'} ${Math.abs(estadisticas.cambioReservas || 0)}% vs mes anterior</div>
            </div>
            <div class="kpi-card" style="background: linear-gradient(135deg, #FFC107 0%, #e0a800 100%);">
                <div class="kpi-label">Tasa de Ocupación</div>
                <div class="kpi-value">${(estadisticas.tasaOcupacion || 0).toFixed(1)}%</div>
                <div class="kpi-change">Promedio diario</div>
            </div>
            <div class="kpi-card" style="background: linear-gradient(135deg, #6F42C1 0%, #593196 100%);">
                <div class="kpi-label">Calificación Promedio</div>
                <div class="kpi-value">⭐ ${(estadisticas.calificacionPromedio || 0).toFixed(1)}</div>
                <div class="kpi-change">${estadisticas.totalResenas || 0} reseñas</div>
            </div>
        </div>
        
        <div class="card" style="margin-bottom: 20px;">
            <div class="card-header">📊 Herramientas Más Populares</div>
            <div class="card-body">
                ${estadisticas.herramientasPopulares && estadisticas.herramientasPopulares.length > 0 ? `
                    <div style="display: grid; gap: 15px;">
                        ${estadisticas.herramientasPopulares.map((h, index) => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: ${index % 2 === 0 ? '#f8f9fa' : 'white'}; border-radius: 8px;">
                                <div>
                                    <strong>${h.nombre}</strong><br>
                                    <small style="color: #6c757d;">${h.totalReservas} reservas</small>
                                </div>
                                <div style="text-align: right;">
                                    <div>${formatearMoneda(h.ingresosTotales)}</div>
                                    <small style="color: #6c757d;">⭐ ${h.calificacionPromedio.toFixed(1)}</small>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <div class="empty-state-icon">📊</div>
                        <div class="empty-state-title">No hay datos suficientes</div>
                    </div>
                `}
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">📈 Tendencias Mensuales</div>
            <div class="card-body">
                ${estadisticas.tendenciasMensuales && estadisticas.tendenciasMensuales.length > 0 ? `
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        ${estadisticas.tendenciasMensuales.map(t => `
                            <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                                <div style="font-size: 12px; color: #6c757d; margin-bottom: 5px;">${t.mes}</div>
                                <div style="font-size: 20px; font-weight: bold; color: #007bff;">${t.reservas}</div>
                                <div style="font-size: 14px; color: #28a745;">${formatearMoneda(t.ingresos)}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="empty-state">
                        <div class="empty-state-icon">📈</div>
                        <div class="empty-state-title">No hay datos históricos</div>
                    </div>
                `}
            </div>
        </div>
    `;
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