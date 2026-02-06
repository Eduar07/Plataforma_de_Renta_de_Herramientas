/**
 * Página Principal - Index
 */

// Cargar categorías y herramientas al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarCategorias();
    cargarHerramientasDestacadas();
});

// Categorías hardcodeadas (podrías cargarlas desde el backend)
const categorias = [
    { id: '1', nombre: 'Construcción', icono: '🔨' },
    { id: '2', nombre: 'Carpintería', icono: '🪛' },
    { id: '3', nombre: 'Jardinería', icono: '🌿' },
    { id: '4', nombre: 'Electricidad', icono: '⚡' },
    { id: '5', nombre: 'Pintura', icono: '🎨' }
];

function cargarCategorias() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    
    grid.innerHTML = categorias.map(cat => `
        <div class="category-card" onclick="irACategoria('${cat.id}')">
            <div class="category-icon">${cat.icono}</div>
            <div class="category-name">${cat.nombre}</div>
        </div>
    `).join('');
}

async function cargarHerramientasDestacadas() {
    const grid = document.getElementById('herramientasGrid');
    if (!grid) return;
    
    try {
        const response = await fetchAPI(API_ENDPOINTS.HERRAMIENTAS);
        
        if (response.success && response.data) {
            const herramientas = response.data.slice(0, 8); // Solo 8 destacadas
            
            if (herramientas.length === 0) {
                grid.innerHTML = `
                    <div class="empty-state" style="grid-column: 1/-1;">
                        <div class="empty-state-icon">🔍</div>
                        <div class="empty-state-title">No hay herramientas disponibles</div>
                        <div class="empty-state-text">Pronto habrá nuevas herramientas</div>
                    </div>
                `;
                return;
            }
            
            grid.innerHTML = herramientas.map(h => crearCardHerramienta(h)).join('');
        }
    } catch (error) {
        console.error('Error cargando herramientas:', error);
        grid.innerHTML = `
            <div class="alert alert-danger" style="grid-column: 1/-1;">
                Error al cargar herramientas. Por favor intenta nuevamente.
            </div>
        `;
    }
}

function crearCardHerramienta(herramienta) {
    const imagen = herramienta.fotos && herramienta.fotos.length > 0 
        ? herramienta.fotos[0] 
        : 'https://via.placeholder.com/300x200?text=Sin+Imagen';
    
    return `
        <div class="herramienta-card" onclick="verDetalleHerramienta('${herramienta.id}')">
            <div style="position: relative;">
                <img src="${imagen}" alt="${herramienta.nombre}" class="herramienta-image" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Sin+Imagen'">
                ${herramienta.envioIncluido ? '<span class="badge badge-success" style="position: absolute; top: 10px; left: 10px;">📦 Envío Incluido</span>' : ''}
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
                <button class="btn btn-outline-primary btn-sm" onclick="event.stopPropagation(); verDetalleHerramienta('${herramienta.id}')">
                    Ver Detalles
                </button>
                <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); reservarHerramienta('${herramienta.id}')">
                    Reservar Ahora
                </button>
            </div>
        </div>
    `;
}

function searchHerramientas() {
    const termino = document.getElementById('heroSearchInput').value.trim();
    if (termino) {
        window.location.href = `/herramientas.html?q=${encodeURIComponent(termino)}`;
    }
}

function irACategoria(categoriaId) {
    window.location.href = `/herramientas.html?categoria=${categoriaId}`;
}

function verDetalleHerramienta(id) {
    if (!isAuthenticated()) {
        showAlert('Debes iniciar sesión para ver detalles', 'warning');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1500);
        return;
    }
    window.location.href = `/herramientas.html?id=${id}`;
}

function reservarHerramienta(id) {
    if (!isAuthenticated()) {
        showAlert('Debes iniciar sesión para reservar', 'warning');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1500);
        return;
    }
    window.location.href = `/herramientas.html?id=${id}&action=reservar`;
}

// Enter en búsqueda
document.getElementById('heroSearchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchHerramientas();
    }
});