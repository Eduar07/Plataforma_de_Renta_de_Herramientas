-- ========================================
-- SCRIPT DDL: Creación de Base de Datos
-- Plataforma de Renta de Herramientas
-- MySQL 8.x
-- ========================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS renta_herramientas
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE renta_herramientas;

-- ========================================
-- TABLA: usuarios
-- ========================================
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    documento VARCHAR(50),
    rol ENUM('ADMIN', 'PROVEEDOR', 'CLIENTE') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: herramientas
-- ========================================
CREATE TABLE IF NOT EXISTS herramientas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    categoria VARCHAR(50) NOT NULL,
    precio_dia DECIMAL(10, 2) NOT NULL,
    precio_semana DECIMAL(10, 2),
    precio_mes DECIMAL(10, 2),
    stock_disponible INT NOT NULL DEFAULT 0,
    estado ENUM('DISPONIBLE', 'ALQUILADA', 'EN_MANTENIMIENTO', 'DANADA') NOT NULL DEFAULT 'DISPONIBLE',
    imagen_url VARCHAR(255),
    especificaciones TEXT,
    proveedor_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_categoria (categoria),
    INDEX idx_estado (estado),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_precio (precio_dia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: reservas
-- ========================================
CREATE TABLE IF NOT EXISTS reservas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    herramienta_id BIGINT NOT NULL,
    proveedor_id BIGINT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_alquiler INT NOT NULL,
    costo_total DECIMAL(10, 2) NOT NULL,
    estado ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA') NOT NULL DEFAULT 'PENDIENTE',
    observaciones TEXT,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_aprobacion TIMESTAMP NULL,
    fecha_entrega TIMESTAMP NULL,
    fecha_devolucion TIMESTAMP NULL,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (herramienta_id) REFERENCES herramientas(id) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_cliente (cliente_id),
    INDEX idx_herramienta (herramienta_id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_estado (estado),
    INDEX idx_fechas (fecha_inicio, fecha_fin)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: pagos
-- ========================================
CREATE TABLE IF NOT EXISTS pagos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reserva_id BIGINT NOT NULL,
    cliente_id BIGINT NOT NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago ENUM('TARJETA_CREDITO', 'TARJETA_DEBITO', 'TRANSFERENCIA', 'EFECTIVO', 'PSE') NOT NULL,
    estado ENUM('PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO') NOT NULL DEFAULT 'PENDIENTE',
    referencia VARCHAR(100),
    comprobante VARCHAR(255),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_reserva (reserva_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- TABLA: facturas
-- ========================================
CREATE TABLE IF NOT EXISTS facturas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    reserva_id BIGINT NOT NULL,
    cliente_id BIGINT NOT NULL,
    proveedor_id BIGINT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    impuestos DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ruta_pdf VARCHAR(255),
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_numero (numero_factura),
    INDEX idx_reserva (reserva_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_fecha (fecha_emision)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- VISTAS ÚTILES
-- ========================================

-- Vista de herramientas disponibles
CREATE OR REPLACE VIEW v_herramientas_disponibles AS
SELECT 
    h.*,
    u.nombre_completo AS proveedor_nombre,
    u.telefono AS proveedor_telefono
FROM herramientas h
INNER JOIN usuarios u ON h.proveedor_id = u.id
WHERE h.estado = 'DISPONIBLE' AND h.stock_disponible > 0;

-- Vista de reservas activas
CREATE OR REPLACE VIEW v_reservas_activas AS
SELECT 
    r.*,
    c.nombre_completo AS cliente_nombre,
    c.email AS cliente_email,
    h.nombre AS herramienta_nombre,
    h.categoria AS herramienta_categoria,
    p.nombre_completo AS proveedor_nombre
FROM reservas r
INNER JOIN usuarios c ON r.cliente_id = c.id
INNER JOIN herramientas h ON r.herramienta_id = h.id
INNER JOIN usuarios p ON r.proveedor_id = p.id
WHERE r.estado IN ('APROBADA', 'EN_CURSO');

-- ========================================
-- FIN DEL SCRIPT DDL
-- ========================================