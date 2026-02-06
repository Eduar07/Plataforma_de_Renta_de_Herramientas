/**
 * Configuración Global de la Aplicación
 */

const API_BASE_URL = 'http://localhost:8080/api';

const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTRO: `${API_BASE_URL}/auth/registro`,
    
    // Usuarios
    USUARIOS: `${API_BASE_URL}/usuarios`,
    USUARIOS_BY_ID: (id) => `${API_BASE_URL}/usuarios/${id}`,
    USUARIOS_BY_TIPO: (tipo) => `${API_BASE_URL}/usuarios/tipo/${tipo}`,
    BLOQUEAR_USUARIO: (id) => `${API_BASE_URL}/usuarios/${id}/bloquear`,
    DESBLOQUEAR_USUARIO: (id) => `${API_BASE_URL}/usuarios/${id}/desbloquear`,
    
    // Herramientas
    HERRAMIENTAS: `${API_BASE_URL}/herramientas`,
    HERRAMIENTAS_BY_ID: (id) => `${API_BASE_URL}/herramientas/${id}`,
    HERRAMIENTAS_BUSCAR: `${API_BASE_URL}/herramientas/buscar`,
    HERRAMIENTAS_BY_CATEGORIA: (id) => `${API_BASE_URL}/herramientas/categoria/${id}`,
    HERRAMIENTAS_BY_PROVEEDOR: (id) => `${API_BASE_URL}/herramientas/proveedor/${id}`,
    HERRAMIENTA_CAMBIAR_ESTADO: (id) => `${API_BASE_URL}/herramientas/${id}/estado`,
    
    // Reservas
    RESERVAS: `${API_BASE_URL}/reservas`,
    RESERVAS_BY_ID: (id) => `${API_BASE_URL}/reservas/${id}`,
    RESERVAS_BY_CLIENTE: (id) => `${API_BASE_URL}/reservas/cliente/${id}`,
    RESERVAS_BY_PROVEEDOR: (id) => `${API_BASE_URL}/reservas/proveedor/${id}`,
    RESERVAS_BY_ESTADO: (estado) => `${API_BASE_URL}/reservas/estado/${estado}`,
    RESERVA_CAMBIAR_ESTADO: (id) => `${API_BASE_URL}/reservas/${id}/estado`,
    RESERVA_CANCELAR: (id) => `${API_BASE_URL}/reservas/${id}/cancelar`,
    VERIFICAR_DISPONIBILIDAD: `${API_BASE_URL}/reservas/disponibilidad`,
    
    // Pagos
    PAGOS: `${API_BASE_URL}/pagos`,
    PAGOS_BY_ID: (id) => `${API_BASE_URL}/pagos/${id}`,
    PAGOS_BY_CLIENTE: (id) => `${API_BASE_URL}/pagos/cliente/${id}`,
    PAGOS_BY_RESERVA: (id) => `${API_BASE_URL}/pagos/reserva/${id}`,
    
    // Facturas
    FACTURAS: `${API_BASE_URL}/facturas`,
    FACTURAS_BY_RESERVA: (id) => `${API_BASE_URL}/facturas/reserva/${id}`,
};

// Estados de Reserva con colores
const ESTADOS_RESERVA = {
    PENDIENTE_PAGO: { label: 'Pendiente Pago', color: 'warning' },
    PAGADA: { label: 'Pagada', color: 'info' },
    CONFIRMADA: { label: 'Confirmada', color: 'success' },
    EN_PREPARACION: { label: 'En Preparación', color: 'info' },
    ENVIADA: { label: 'Enviada', color: 'info' },
    ENTREGADA: { label: 'Entregada', color: 'success' },
    EN_USO: { label: 'En Uso', color: 'success' },
    DEVUELTA: { label: 'Devuelta', color: 'info' },
    COMPLETADA: { label: 'Completada', color: 'success' },
    CANCELADA_CLIENTE: { label: 'Cancelada (Cliente)', color: 'secondary' },
    CANCELADA_PROVEEDOR: { label: 'Cancelada (Proveedor)', color: 'secondary' },
    CANCELADA_SISTEMA: { label: 'Cancelada (Sistema)', color: 'secondary' },
    MORA: { label: 'Mora', color: 'danger' },
    PERDIDA: { label: 'Perdida', color: 'danger' },
    ROBADA: { label: 'Robada', color: 'danger' }
};

// Estados de Pago con colores
const ESTADOS_PAGO = {
    PENDIENTE: { label: 'Pendiente', color: 'warning' },
    PROCESANDO: { label: 'Procesando', color: 'info' },
    EXITOSO: { label: 'Exitoso', color: 'success' },
    FALLIDO: { label: 'Fallido', color: 'danger' },
    REEMBOLSADO: { label: 'Reembolsado', color: 'secondary' },
    CANCELADO: { label: 'Cancelado', color: 'secondary' }
};

// LocalStorage keys
const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER: 'user_data',
    USER_ID: 'user_id',
    USER_ROLE: 'user_role'
};