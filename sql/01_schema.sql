-- ============================================
-- BASE DE DATOS MARKETPLACE HERRAMIENTAS
-- ============================================

DROP DATABASE IF EXISTS marketplace_herramientas;
CREATE DATABASE marketplace_herramientas
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE marketplace_herramientas;

-- ============================================
-- TABLA 1: USUARIOS
-- ============================================
CREATE TABLE usuarios (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    tipo ENUM('CLIENTE', 'PROVEEDOR', 'ADMIN') NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(100),
    departamento VARCHAR(100),
    documento_tipo ENUM('CC', 'NIT', 'CE', 'PASAPORTE') NOT NULL,
    documento_numero VARCHAR(50) NOT NULL UNIQUE,
    score INT DEFAULT 100 CHECK (score >= 0 AND score <= 100),
    estado ENUM('ACTIVO', 'BLOQUEADO', 'SUSPENDIDO') DEFAULT 'ACTIVO',
    razon_bloqueo TEXT,
    advertencias INT DEFAULT 0 CHECK (advertencias >= 0 AND advertencias <= 5),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_tipo (tipo),
    INDEX idx_estado (estado),
    INDEX idx_documento (documento_numero)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 2: PERFILES_PROVEEDOR
-- ============================================
CREATE TABLE perfiles_proveedor (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL UNIQUE,
    nombre_comercial VARCHAR(255) NOT NULL,
    mision TEXT,
    vision TEXT,
    logo_url VARCHAR(500),
    calificacion_promedio DECIMAL(3,2) DEFAULT 0.00 CHECK (calificacion_promedio >= 0 AND calificacion_promedio <= 5),
    total_calificaciones INT DEFAULT 0,
    estado_kyc ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') DEFAULT 'PENDIENTE',
    documentos_kyc JSON,
    verificado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_verificado (verificado),
    INDEX idx_calificacion (calificacion_promedio)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 3: DIRECCIONES_ENVIO
-- ============================================
CREATE TABLE direcciones_envio (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    alias VARCHAR(100) NOT NULL,
    destinatario VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion TEXT NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(10),
    indicaciones TEXT,
    es_principal BOOLEAN DEFAULT FALSE,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_principal (es_principal),
    INDEX idx_activa (activa)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 4: METODOS_PAGO_GUARDADOS
-- ============================================
CREATE TABLE metodos_pago_guardados (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    tipo ENUM('TARJETA_CREDITO', 'TARJETA_DEBITO', 'PSE') NOT NULL,
    alias VARCHAR(100) NOT NULL,
    token_gateway VARCHAR(255) NOT NULL,
    ultimos_digitos VARCHAR(4),
    marca VARCHAR(50),
    fecha_expiracion VARCHAR(7),
    es_principal BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_principal (es_principal),
    INDEX idx_activo (activo)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 5: CATEGORIAS
-- ============================================
CREATE TABLE categorias (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icono_url VARCHAR(500),
    descripcion TEXT,
    parent_id CHAR(36),
    orden INT DEFAULT 0,
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categorias(id) ON DELETE SET NULL,
    INDEX idx_parent (parent_id),
    INDEX idx_activa (activa),
    INDEX idx_slug (slug)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 6: CARACTERISTICAS
-- ============================================
CREATE TABLE caracteristicas (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    tipo ENUM('ESPECIFICACION', 'CARACTERISTICA', 'INCLUYE') NOT NULL,
    descripcion TEXT,
    icono_url VARCHAR(500),
    activa BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_tipo (tipo),
    INDEX idx_nombre (nombre),
    INDEX idx_activa (activa)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 7: HERRAMIENTAS
-- ============================================
CREATE TABLE herramientas (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    proveedor_id CHAR(36) NOT NULL,
    categoria_id CHAR(36) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    sku VARCHAR(100) UNIQUE,
    descripcion TEXT,
    fotos JSON,
    precio_base_dia DECIMAL(12,2) NOT NULL CHECK (precio_base_dia > 0),
    envio_incluido BOOLEAN DEFAULT TRUE,
    dias_minimo_alquiler INT DEFAULT 1 CHECK (dias_minimo_alquiler > 0),
    dias_maximo_alquiler INT DEFAULT 90,
    deposito_seguridad DECIMAL(12,2) DEFAULT 0.00,
    estado ENUM('ACTIVO', 'PAUSADO', 'ELIMINADO') DEFAULT 'ACTIVO',
    calificacion_promedio DECIMAL(3,2) DEFAULT 0.00,
    total_calificaciones INT DEFAULT 0,
    total_alquileres INT DEFAULT 0,
    vistas INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- ✅ CHECK a nivel de tabla
    CONSTRAINT chk_dias_alquiler
        CHECK (dias_maximo_alquiler >= dias_minimo_alquiler),

    FOREIGN KEY (proveedor_id) REFERENCES perfiles_proveedor(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_categoria (categoria_id),
    INDEX idx_estado (estado),
    INDEX idx_precio (precio_base_dia),
    INDEX idx_calificacion (calificacion_promedio),
    FULLTEXT idx_busqueda (nombre, marca, modelo, descripcion)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 8: HERRAMIENTAS_CARACTERISTICAS
-- ============================================
CREATE TABLE herramientas_caracteristicas (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    herramienta_id CHAR(36) NOT NULL,
    caracteristica_id CHAR(36) NOT NULL,
    valor TEXT,
    orden INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (herramienta_id) REFERENCES herramientas(id) ON DELETE CASCADE,
    FOREIGN KEY (caracteristica_id) REFERENCES caracteristicas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_herramienta_caracteristica (herramienta_id, caracteristica_id),
    INDEX idx_herramienta (herramienta_id),
    INDEX idx_caracteristica (caracteristica_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 9: USUARIOS_FAVORITOS
-- ============================================
CREATE TABLE usuarios_favoritos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    herramienta_id CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (herramienta_id) REFERENCES herramientas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_herramienta (usuario_id, herramienta_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_herramienta (herramienta_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 10: HISTORIAL_PRECIOS
-- ============================================
CREATE TABLE historial_precios (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    herramienta_id CHAR(36) NOT NULL,
    precio_anterior DECIMAL(12,2) NOT NULL,
    precio_nuevo DECIMAL(12,2) NOT NULL,
    modificado_por CHAR(36) NOT NULL,
    vigencia_desde TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vigencia_hasta TIMESTAMP NULL,
    motivo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (herramienta_id) REFERENCES herramientas(id) ON DELETE CASCADE,
    FOREIGN KEY (modificado_por) REFERENCES usuarios(id),
    INDEX idx_herramienta (herramienta_id),
    INDEX idx_vigencia (vigencia_desde, vigencia_hasta)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 11: HERRAMIENTAS_INSTANCIA
-- ============================================
CREATE TABLE herramientas_instancia (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    herramienta_id CHAR(36) NOT NULL,
    codigo_interno VARCHAR(100) NOT NULL UNIQUE,
    estado ENUM('DISPONIBLE', 'RESERVADA', 'EN_USO', 'EN_MANTENIMIENTO', 'DANADA', 'PERDIDA', 'ROBADA') DEFAULT 'DISPONIBLE',
    ubicacion_fisica VARCHAR(255),
    notas_internas TEXT,
    fotos_especificas JSON,
    total_usos INT DEFAULT 0,
    ultima_revision TIMESTAMP,
    proximo_mantenimiento TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (herramienta_id) REFERENCES herramientas(id) ON DELETE CASCADE,
    INDEX idx_herramienta (herramienta_id),
    INDEX idx_estado (estado),
    INDEX idx_codigo (codigo_interno)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 12: DISPONIBILIDAD_BLOQUEADA
-- ============================================
CREATE TABLE disponibilidad_bloqueada (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    instancia_id CHAR(36) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    motivo ENUM('MANTENIMIENTO', 'USO_PERSONAL', 'REPARACION', 'OTRO') NOT NULL,
    notas TEXT,
    bloqueado_por CHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (instancia_id) REFERENCES herramientas_instancia(id) ON DELETE CASCADE,
    FOREIGN KEY (bloqueado_por) REFERENCES usuarios(id),
    INDEX idx_instancia (instancia_id),
    INDEX idx_fechas (fecha_inicio, fecha_fin),
    CHECK (fecha_fin >= fecha_inicio)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 13: POLITICAS_CANCELACION
-- ============================================
CREATE TABLE politicas_cancelacion (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    herramienta_id CHAR(36) NOT NULL,
    horas_antes_inicio INT NOT NULL,
    porcentaje_penalizacion DECIMAL(5,2) NOT NULL CHECK (porcentaje_penalizacion >= 0 AND porcentaje_penalizacion <= 100),
    descripcion TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (herramienta_id) REFERENCES herramientas(id) ON DELETE CASCADE,
    INDEX idx_herramienta (herramienta_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 14: CUPONES
-- ============================================
CREATE TABLE cupones (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    codigo VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    tipo_descuento ENUM('PORCENTAJE', 'MONTO_FIJO') NOT NULL,
    valor DECIMAL(12,2) NOT NULL,
    monto_minimo DECIMAL(12,2) DEFAULT 0.00,
    fecha_inicio DATE NOT NULL,
    fecha_expiracion DATE NOT NULL,
    usos_maximos INT,
    usos_actuales INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_codigo (codigo),
    INDEX idx_fechas (fecha_inicio, fecha_expiracion),
    INDEX idx_activo (activo)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 15: RESERVAS
-- ============================================
CREATE TABLE reservas (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    numero_reserva VARCHAR(50) NOT NULL UNIQUE,
    cliente_id CHAR(36) NOT NULL,
    proveedor_id CHAR(36) NOT NULL,
    herramienta_id CHAR(36) NOT NULL,
    instancia_id CHAR(36),
    direccion_envio_id CHAR(36),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_totales INT GENERATED ALWAYS AS (DATEDIFF(fecha_fin, fecha_inicio) + 1) STORED,
    estado ENUM(
        'PENDIENTE_PAGO',
        'PAGADA',
        'CONFIRMADA',
        'EN_PREPARACION',
        'ENVIADA',
        'ENTREGADA',
        'EN_USO',
        'DEVUELTA',
        'COMPLETADA',
        'CANCELADA_CLIENTE',
        'CANCELADA_PROVEEDOR',
        'CANCELADA_SISTEMA',
        'MORA',
        'PERDIDA',
        'ROBADA'
    ) DEFAULT 'PENDIENTE_PAGO',
    fecha_pago TIMESTAMP,
    fecha_confirmacion TIMESTAMP,
    fecha_envio TIMESTAMP,
    fecha_entrega TIMESTAMP,
    fecha_devolucion_programada TIMESTAMP,
    fecha_devolucion_real TIMESTAMP,
    fecha_completada TIMESTAMP,
    fecha_cancelacion TIMESTAMP,
    motivo_cancelacion TEXT,
    cancelado_por CHAR(36),
    tracking_envio_ida VARCHAR(255),
    tracking_envio_vuelta VARCHAR(255),
    notas_cliente TEXT,
    notas_proveedor TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (proveedor_id) REFERENCES perfiles_proveedor(id),
    FOREIGN KEY (herramienta_id) REFERENCES herramientas(id),
    FOREIGN KEY (instancia_id) REFERENCES herramientas_instancia(id),
    FOREIGN KEY (direccion_envio_id) REFERENCES direcciones_envio(id) ON DELETE SET NULL,
    FOREIGN KEY (cancelado_por) REFERENCES usuarios(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_herramienta (herramienta_id),
    INDEX idx_instancia (instancia_id),
    INDEX idx_estado (estado),
    INDEX idx_fechas (fecha_inicio, fecha_fin),
    INDEX idx_numero (numero_reserva),
    CHECK (fecha_fin >= fecha_inicio)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 16: DETALLE_RESERVA
-- ============================================
CREATE TABLE detalle_reserva (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reserva_id CHAR(36) NOT NULL UNIQUE,
    precio_dia_snapshot DECIMAL(12,2) NOT NULL,
    subtotal_alquiler DECIMAL(12,2) NOT NULL,
    costo_envio_ida DECIMAL(12,2) DEFAULT 0.00,
    costo_envio_vuelta DECIMAL(12,2) DEFAULT 0.00,
    costo_seguro DECIMAL(12,2) NOT NULL,
    deposito_seguridad DECIMAL(12,2) DEFAULT 0.00,
    cupon_id CHAR(36),
    codigo_cupon VARCHAR(50),
    descuento DECIMAL(12,2) DEFAULT 0.00,
    total_pagado DECIMAL(12,2) NOT NULL,
    comision_admin DECIMAL(12,2) NOT NULL,
    porcentaje_comision DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (cupon_id) REFERENCES cupones(id) ON DELETE SET NULL,
    INDEX idx_reserva (reserva_id),
    INDEX idx_cupon (cupon_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 17: CUPONES_USOS
-- ============================================
CREATE TABLE cupones_usos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    cupon_id CHAR(36) NOT NULL,
    usuario_id CHAR(36) NOT NULL,
    reserva_id CHAR(36) NOT NULL,
    monto_descuento DECIMAL(12,2) NOT NULL,
    fecha_uso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cupon_id) REFERENCES cupones(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    INDEX idx_cupon (cupon_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_reserva (reserva_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 18: CANCELACIONES
-- ============================================
CREATE TABLE cancelaciones (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reserva_id CHAR(36) NOT NULL UNIQUE,
    cancelado_por ENUM('CLIENTE', 'PROVEEDOR', 'SISTEMA') NOT NULL,
    horas_antes_inicio INT,
    penalizacion_aplicada DECIMAL(12,2) DEFAULT 0.00,
    monto_reembolsado DECIMAL(12,2) DEFAULT 0.00,
    motivo TEXT,
    estado ENUM('PENDIENTE', 'PROCESADA', 'REEMBOLSADA') DEFAULT 'PENDIENTE',
    fecha_cancelacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_reembolso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    INDEX idx_reserva (reserva_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 19: VERIFICACIONES_ENTREGA
-- ============================================
CREATE TABLE verificaciones_entrega (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reserva_id CHAR(36) NOT NULL,
    tipo ENUM('PREPARACION_PROVEEDOR', 'RECEPCION_CLIENTE') NOT NULL,
    decision ENUM('ACEPTADA', 'RECHAZADA') NOT NULL,
    comentarios TEXT,
    fotos JSON,
    defectos_reportados JSON,
    fecha_verificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    INDEX idx_reserva (reserva_id),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 20: VERIFICACIONES_DEVOLUCION
-- ============================================
CREATE TABLE verificaciones_devolucion (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reserva_id CHAR(36) NOT NULL UNIQUE,
    tipo ENUM('ENVIO_CLIENTE', 'RECEPCION_PROVEEDOR') NOT NULL,
    estado_herramienta ENUM('PERFECTO', 'BUENO', 'DANADO', 'PERDIDO', 'ROBADO') NOT NULL,
    descripcion TEXT,
    fotos JSON,
    costo_reparacion_estimado DECIMAL(12,2) DEFAULT 0.00,
    fecha_verificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    INDEX idx_reserva (reserva_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 21: CARGOS_ADICIONALES
-- ============================================
CREATE TABLE cargos_adicionales (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reserva_id CHAR(36) NOT NULL,
    cliente_id CHAR(36) NOT NULL,
    proveedor_id CHAR(36) NOT NULL,
    tipo ENUM('DANO', 'MORA', 'DIAS_EXTRA', 'PERDIDA', 'ROBO', 'LIMPIEZA', 'OTRO') NOT NULL,
    descripcion TEXT NOT NULL,
    evidencias JSON,
    monto_propuesto DECIMAL(12,2) NOT NULL,
    monto_aprobado DECIMAL(12,2),
    monto_final DECIMAL(12,2),
    estado ENUM('PENDIENTE', 'APROBADO', 'PAGADO', 'EN_DISPUTA', 'CONDONADO', 'MOROSO') DEFAULT 'PENDIENTE',
    fecha_limite_pago DATE,
    fecha_pago TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (proveedor_id) REFERENCES perfiles_proveedor(id),
    INDEX idx_reserva (reserva_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_tipo (tipo),
    INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 22: DISPUTAS
-- ============================================
CREATE TABLE disputas (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    cargo_id CHAR(36) NOT NULL UNIQUE,
    cliente_id CHAR(36) NOT NULL,
    motivo_disputa TEXT NOT NULL,
    evidencias_cliente JSON,
    estado ENUM('ABIERTA', 'EN_REVISION', 'RESUELTA_CLIENTE', 'RESUELTA_PROVEEDOR', 'MEDIACION') DEFAULT 'ABIERTA',
    admin_revisor_id CHAR(36),
    decision_admin TEXT,
    monto_ajustado DECIMAL(12,2),
    fecha_apertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cargo_id) REFERENCES cargos_adicionales(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (admin_revisor_id) REFERENCES usuarios(id),
    INDEX idx_cargo (cargo_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 23: MORA
-- ============================================
CREATE TABLE mora (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reserva_id CHAR(36) NOT NULL UNIQUE,
    dias_mora INT DEFAULT 0,
    cargo_por_dia DECIMAL(12,2) NOT NULL,
    total_acumulado DECIMAL(12,2) GENERATED ALWAYS AS (dias_mora * cargo_por_dia) STORED,
    estado ENUM('ACTIVA', 'RESUELTA', 'ESCALADA') DEFAULT 'ACTIVA',
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_resolucion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    INDEX idx_reserva (reserva_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 24: SEGUROS
-- ============================================
CREATE TABLE seguros (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reserva_id CHAR(36) NOT NULL UNIQUE,
    monto_pagado DECIMAL(12,2) NOT NULL,
    valor_cobertura DECIMAL(12,2) NOT NULL,
    deducible DECIMAL(12,2) DEFAULT 0.00,
    tipo_cobertura ENUM('BASICA', 'COMPLETA', 'PREMIUM') DEFAULT 'BASICA',
    estado ENUM('ACTIVO', 'DEVUELTO', 'RECLAMADO', 'PAGADO') DEFAULT 'ACTIVO',
    motivo_reclamo ENUM('DANO_TRANSPORTE', 'PERDIDA', 'ROBO', 'DANO_USO'),
    monto_reclamado DECIMAL(12,2),
    monto_aprobado DECIMAL(12,2),
    fecha_reclamo TIMESTAMP,
    fecha_pago TIMESTAMP,
    documentos_reclamo JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    INDEX idx_reserva (reserva_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 25: FONDO_SEGUROS
-- ============================================
CREATE TABLE fondo_seguros (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    balance_total DECIMAL(15,2) DEFAULT 0.00,
    total_recaudado DECIMAL(15,2) DEFAULT 0.00,
    total_pagado DECIMAL(15,2) DEFAULT 0.00,
    seguros_activos INT DEFAULT 0,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO fondo_seguros (id) VALUES (UUID());

-- ============================================
-- TABLA 26: PAGOS
-- ============================================
CREATE TABLE pagos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    numero_transaccion VARCHAR(50) NOT NULL UNIQUE,
    reserva_id CHAR(36),
    cliente_id CHAR(36) NOT NULL,
    metodo_pago_id CHAR(36),
    monto DECIMAL(12,2) NOT NULL,
    tipo ENUM('RESERVA_INICIAL', 'CARGO_ADICIONAL', 'DEPOSITO_SEGURIDAD', 'PENALIZACION') NOT NULL,
    metodo ENUM('TARJETA_CREDITO', 'TARJETA_DEBITO', 'PSE', 'TRANSFERENCIA', 'EFECTIVO') NOT NULL,
    estado ENUM('PENDIENTE', 'PROCESANDO', 'EXITOSO', 'FALLIDO', 'REEMBOLSADO', 'CANCELADO') DEFAULT 'PENDIENTE',
    gateway VARCHAR(50) NOT NULL,
    gateway_transaction_id VARCHAR(255),
    gateway_response JSON,
    ip_cliente VARCHAR(45),
    fecha_pago TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE SET NULL,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (metodo_pago_id) REFERENCES metodos_pago_guardados(id) ON DELETE SET NULL,
    INDEX idx_reserva (reserva_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado),
    INDEX idx_numero (numero_transaccion),
    INDEX idx_fecha (fecha_pago)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 27: FACTURAS
-- ============================================
CREATE TABLE facturas (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    numero_factura VARCHAR(50) NOT NULL UNIQUE,
    reserva_id CHAR(36) NOT NULL UNIQUE,
    cliente_id CHAR(36) NOT NULL,
    proveedor_id CHAR(36) NOT NULL,
    cliente_nombre VARCHAR(255) NOT NULL,
    cliente_documento VARCHAR(50) NOT NULL,
    cliente_direccion TEXT,
    proveedor_nombre VARCHAR(255) NOT NULL,
    proveedor_documento VARCHAR(50) NOT NULL,
    proveedor_direccion TEXT,
    subtotal DECIMAL(12,2) NOT NULL,
    descuentos DECIMAL(12,2) DEFAULT 0.00,
    impuestos DECIMAL(12,2) DEFAULT 0.00,
    total DECIMAL(12,2) NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE,
    estado ENUM('EMITIDA', 'PAGADA', 'ANULADA') DEFAULT 'EMITIDA',
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (proveedor_id) REFERENCES perfiles_proveedor(id),
    INDEX idx_numero (numero_factura),
    INDEX idx_reserva (reserva_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_emision)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 28: DETALLE_FACTURA
-- ============================================
CREATE TABLE detalle_factura (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    factura_id CHAR(36) NOT NULL,
    numero_linea INT NOT NULL,
    concepto VARCHAR(255) NOT NULL,
    descripcion TEXT,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    impuesto DECIMAL(12,2) DEFAULT 0.00,
    descuento DECIMAL(12,2) DEFAULT 0.00,
    total_linea DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE,
    INDEX idx_factura (factura_id),
    INDEX idx_concepto (concepto)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 29: LIQUIDACIONES
-- ============================================
CREATE TABLE liquidaciones (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    numero_liquidacion VARCHAR(50) NOT NULL UNIQUE,
    reserva_id CHAR(36) NOT NULL UNIQUE,
    proveedor_id CHAR(36) NOT NULL,
    monto_alquiler DECIMAL(12,2) NOT NULL,
    comision_plataforma DECIMAL(12,2) NOT NULL,
    porcentaje_comision DECIMAL(5,2) NOT NULL,
    cargos_adicionales DECIMAL(12,2) DEFAULT 0.00,
    deducciones DECIMAL(12,2) DEFAULT 0.00,
    total_liquidado DECIMAL(12,2) NOT NULL,
    fecha_liquidacion DATE NOT NULL,
    estado ENUM('PENDIENTE', 'PROCESADA', 'PAGADA') DEFAULT 'PENDIENTE',
    fecha_pago TIMESTAMP,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES perfiles_proveedor(id),
    INDEX idx_numero (numero_liquidacion),
    INDEX idx_reserva (reserva_id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_liquidacion)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 30: DETALLE_LIQUIDACION
-- ============================================
CREATE TABLE detalle_liquidacion (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    liquidacion_id CHAR(36) NOT NULL,
    numero_linea INT NOT NULL,
    concepto VARCHAR(255) NOT NULL,
    tipo ENUM('INGRESO', 'DEDUCCION', 'COMISION', 'CARGO_ADICIONAL') NOT NULL,
    descripcion TEXT,
    monto DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (liquidacion_id) REFERENCES liquidaciones(id) ON DELETE CASCADE,
    INDEX idx_liquidacion (liquidacion_id),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 31: REEMBOLSOS
-- ============================================
CREATE TABLE reembolsos (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    pago_id CHAR(36) NOT NULL,
    reserva_id CHAR(36),
    monto_reembolso DECIMAL(12,2) NOT NULL,
    motivo ENUM('CANCELACION', 'DEFECTO_PRODUCTO', 'SEGURO', 'DISPUTA_GANADA', 'OTRO') NOT NULL,
    descripcion TEXT,
    estado ENUM('SOLICITADO', 'APROBADO', 'EN_PROCESO', 'COMPLETADO', 'RECHAZADO') DEFAULT 'SOLICITADO',
    motivo_rechazo TEXT,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_aprobacion TIMESTAMP,
    fecha_completado TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (pago_id) REFERENCES pagos(id) ON DELETE CASCADE,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE SET NULL,
    INDEX idx_pago (pago_id),
    INDEX idx_reserva (reserva_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 32: RETENCIONES
-- ============================================
CREATE TABLE retenciones (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reserva_id CHAR(36) NOT NULL UNIQUE,
    monto_retenido DECIMAL(12,2) NOT NULL,
    motivo ENUM('GARANTIA_DEVOLUCION', 'VERIFICACION_DANOS', 'SEGURO', 'DEPOSITO') NOT NULL,
    estado ENUM('ACTIVA', 'LIBERADA', 'APLICADA', 'DEVUELTA') DEFAULT 'ACTIVA',
    fecha_retencion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_liberacion TIMESTAMP,
    notas TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    INDEX idx_reserva (reserva_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 33: BILLETERA_PROVEEDOR
-- ============================================
CREATE TABLE billetera_proveedor (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    proveedor_id CHAR(36) NOT NULL UNIQUE,
    saldo_disponible DECIMAL(12,2) DEFAULT 0.00 CHECK (saldo_disponible >= 0),
    saldo_retenido DECIMAL(12,2) DEFAULT 0.00 CHECK (saldo_retenido >= 0),
    saldo_total DECIMAL(12,2) GENERATED ALWAYS AS (saldo_disponible + saldo_retenido) STORED,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (proveedor_id) REFERENCES perfiles_proveedor(id) ON DELETE CASCADE,
    INDEX idx_proveedor (proveedor_id)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 34: MOVIMIENTOS_BILLETERA
-- ============================================
CREATE TABLE movimientos_billetera (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    billetera_id CHAR(36) NOT NULL,
    proveedor_id CHAR(36) NOT NULL,
    reserva_id CHAR(36),
    tipo ENUM('INGRESO_ALQUILER', 'INGRESO_CARGO', 'RETENCION', 'LIBERACION_RETENCION', 'RETIRO', 'COMISION', 'AJUSTE') NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    saldo_anterior DECIMAL(12,2) NOT NULL,
    saldo_nuevo DECIMAL(12,2) NOT NULL,
    descripcion TEXT,
    referencia VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (billetera_id) REFERENCES billetera_proveedor(id) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES perfiles_proveedor(id),
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE SET NULL,
    INDEX idx_billetera (billetera_id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_tipo (tipo),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 35: RETIROS
-- ============================================
CREATE TABLE retiros (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    proveedor_id CHAR(36) NOT NULL,
    monto DECIMAL(12,2) NOT NULL CHECK (monto > 0),
    cuenta_bancaria VARCHAR(255) NOT NULL,
    tipo_cuenta ENUM('AHORROS', 'CORRIENTE') NOT NULL,
    banco VARCHAR(100) NOT NULL,
    estado ENUM('SOLICITADO', 'EN_PROCESO', 'COMPLETADO', 'RECHAZADO', 'CANCELADO') DEFAULT 'SOLICITADO',
    motivo_rechazo TEXT,
    numero_transaccion VARCHAR(100),
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_procesado TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (proveedor_id) REFERENCES perfiles_proveedor(id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_solicitud)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 36: COMISIONES
-- ============================================
CREATE TABLE comisiones (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reserva_id CHAR(36) NOT NULL UNIQUE,
    proveedor_id CHAR(36) NOT NULL,
    monto_base DECIMAL(12,2) NOT NULL,
    porcentaje DECIMAL(5,2) NOT NULL,
    monto_comision DECIMAL(12,2) GENERATED ALWAYS AS (monto_base * (porcentaje / 100)) STORED,
    estado ENUM('PENDIENTE', 'APLICADA', 'REVERTIDA') DEFAULT 'PENDIENTE',
    fecha_aplicacion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES perfiles_proveedor(id),
    INDEX idx_reserva (reserva_id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 37: CALIFICACIONES_PROVEEDOR
-- ============================================
CREATE TABLE calificaciones_proveedor (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reserva_id CHAR(36) NOT NULL UNIQUE,
    cliente_id CHAR(36) NOT NULL,
    proveedor_id CHAR(36) NOT NULL,
    puntuacion INT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    respuesta_proveedor TEXT,
    verificada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (proveedor_id) REFERENCES perfiles_proveedor(id),
    INDEX idx_reserva (reserva_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_puntuacion (puntuacion)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 38: CALIFICACIONES_HERRAMIENTA
-- ============================================
CREATE TABLE calificaciones_herramienta (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    reserva_id CHAR(36) NOT NULL UNIQUE,
    cliente_id CHAR(36) NOT NULL,
    herramienta_id CHAR(36) NOT NULL,
    puntuacion INT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    respuesta_proveedor TEXT,
    verificada BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (herramienta_id) REFERENCES herramientas(id),
    INDEX idx_reserva (reserva_id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_herramienta (herramienta_id),
    INDEX idx_puntuacion (puntuacion)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 39: ADVERTENCIAS
-- ============================================
CREATE TABLE advertencias (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    tipo ENUM('ENTREGA_DEFECTUOSA', 'FRAUDE', 'DANO_INTENCIONAL', 'MORA_REITERADA', 'CANCELACION_ABUSIVA', 'NO_RECOGIDA', 'OTRO') NOT NULL,
    gravedad ENUM('LEVE', 'MODERADA', 'GRAVE', 'MUY_GRAVE') NOT NULL,
    descripcion TEXT NOT NULL,
    admin_emisor_id CHAR(36) NOT NULL,
    reserva_relacionada_id CHAR(36),
    activa BOOLEAN DEFAULT TRUE,
    fecha_emision TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_emisor_id) REFERENCES usuarios(id),
    FOREIGN KEY (reserva_relacionada_id) REFERENCES reservas(id) ON DELETE SET NULL,
    INDEX idx_usuario (usuario_id),
    INDEX idx_tipo (tipo),
    INDEX idx_activa (activa),
    INDEX idx_gravedad (gravedad)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 40: SUSPENSIONES
-- ============================================
CREATE TABLE suspensiones (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    tipo ENUM('TEMPORAL', 'PERMANENTE') NOT NULL,
    dias_suspension INT,
    motivo TEXT NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    estado ENUM('ACTIVA', 'FINALIZADA', 'REVOCADA') DEFAULT 'ACTIVA',
    revocado_por CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (revocado_por) REFERENCES usuarios(id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_tipo (tipo),
    INDEX idx_estado (estado),
    INDEX idx_fechas (fecha_inicio, fecha_fin)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 41: PROCESO_COBRANZA
-- ============================================
CREATE TABLE proceso_cobranza (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    cliente_id CHAR(36) NOT NULL,
    reserva_id CHAR(36) NOT NULL,
    monto_deuda DECIMAL(12,2) NOT NULL,
    etapa ENUM('NOTIFICACION_1', 'NOTIFICACION_2', 'NOTIFICACION_3', 'PRE_JURIDICO', 'JURIDICO', 'DATACREDITO') NOT NULL,
    fecha_etapa_actual TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_proxima_accion TIMESTAMP,
    acciones_tomadas JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (reserva_id) REFERENCES reservas(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_etapa (etapa),
    INDEX idx_fecha_proxima (fecha_proxima_accion)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 42: REPORTES_DATACREDITO
-- ============================================
CREATE TABLE reportes_datacredito (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    cliente_id CHAR(36) NOT NULL,
    proceso_cobranza_id CHAR(36) NOT NULL,
    monto_reportado DECIMAL(12,2) NOT NULL,
    dias_mora INT NOT NULL,
    estado ENUM('PENDIENTE', 'ENVIADO', 'REPORTADO', 'SALDADO') DEFAULT 'PENDIENTE',
    fecha_envio DATE,
    numero_radicado VARCHAR(100),
    documentos JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (proceso_cobranza_id) REFERENCES proceso_cobranza(id),
    INDEX idx_cliente (cliente_id),
    INDEX idx_estado (estado)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 43: CONVERSACIONES
-- ============================================
CREATE TABLE conversaciones (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    cliente_id CHAR(36) NOT NULL,
    proveedor_id CHAR(36) NOT NULL,
    reserva_id CHAR(36),
    asunto VARCHAR(255),
    estado ENUM('ACTIVA', 'CERRADA', 'ARCHIVADA') DEFAULT 'ACTIVA',
    ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (proveedor_id) REFERENCES perfiles_proveedor(id),
    FOREIGN KEY (reserva_id) REFERENCES reservas(id) ON DELETE SET NULL,
    INDEX idx_cliente (cliente_id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_reserva (reserva_id),
    INDEX idx_estado (estado),
    INDEX idx_ultima_actividad (ultima_actividad)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 44: MENSAJES
-- ============================================
CREATE TABLE mensajes (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    conversacion_id CHAR(36) NOT NULL,
    remitente_id CHAR(36) NOT NULL,
    contenido TEXT NOT NULL,
    archivos_adjuntos JSON,
    leido BOOLEAN DEFAULT FALSE,
    fecha_lectura TIMESTAMP,
    editado BOOLEAN DEFAULT FALSE,
    fecha_edicion TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (conversacion_id) REFERENCES conversaciones(id) ON DELETE CASCADE,
    FOREIGN KEY (remitente_id) REFERENCES usuarios(id),
    INDEX idx_conversacion (conversacion_id),
    INDEX idx_remitente (remitente_id),
    INDEX idx_leido (leido),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 45: NOTIFICACIONES
-- ============================================
CREATE TABLE notificaciones (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    usuario_id CHAR(36) NOT NULL,
    tipo ENUM('RESERVA', 'PAGO', 'ENTREGA', 'DEVOLUCION', 'MENSAJE', 'ADVERTENCIA', 'MORA', 'CANCELACION', 'SISTEMA') NOT NULL,
    prioridad ENUM('BAJA', 'MEDIA', 'ALTA', 'URGENTE') DEFAULT 'MEDIA',
    titulo VARCHAR(255) NOT NULL,
    contenido TEXT NOT NULL,
    url_accion VARCHAR(500),
    leida BOOLEAN DEFAULT FALSE,
    fecha_lectura TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_leida (leida),
    INDEX idx_tipo (tipo),
    INDEX idx_prioridad (prioridad),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB;

-- ============================================
-- TABLA 46: CONFIGURACION_PLATAFORMA
-- ============================================
CREATE TABLE configuracion_plataforma (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT NOT NULL,
    tipo_dato ENUM('NUMBER', 'STRING', 'BOOLEAN', 'JSON') NOT NULL,
    descripcion TEXT,
    categoria ENUM('FINANCIERO', 'OPERACIONAL', 'SEGURIDAD', 'NOTIFICACIONES', 'OTRO') DEFAULT 'OTRO',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_clave (clave),
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB;

INSERT INTO configuracion_plataforma (clave, valor, tipo_dato, descripcion, categoria) VALUES
('comision_porcentaje', '10.0', 'NUMBER', 'Porcentaje de comisión que cobra la plataforma', 'FINANCIERO'),
('seguro_porcentaje', '5.0', 'NUMBER', 'Porcentaje del subtotal para el seguro', 'FINANCIERO'),
('mora_cargo_diario', '10000', 'NUMBER', 'Cargo por día de mora en pesos', 'FINANCIERO'),
('dias_verificacion_entrega', '1', 'NUMBER', 'Días para verificar recepción (24 horas)', 'OPERACIONAL'),
('retiro_minimo', '50000', 'NUMBER', 'Monto mínimo para solicitar retiro', 'FINANCIERO'),
('datacredito_dias_mora', '90', 'NUMBER', 'Días de mora antes de reportar a Datacrédito', 'FINANCIERO'),
('maximo_advertencias', '5', 'NUMBER', 'Máximo de advertencias antes de bloqueo', 'SEGURIDAD'),
('dias_cancelacion_sin_penalizacion', '2', 'NUMBER', 'Días antes de inicio para cancelar sin penalización', 'OPERACIONAL');

-- ============================================
-- TABLA 47: AUDITORIA
-- ============================================
CREATE TABLE auditoria (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    tabla VARCHAR(100) NOT NULL,
    registro_id CHAR(36) NOT NULL,
    accion ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    usuario_id CHAR(36),
    datos_anteriores JSON,
    datos_nuevos JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_tabla (tabla),
    INDEX idx_registro (registro_id),
    INDEX idx_accion (accion),
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (created_at)
) ENGINE=InnoDB;

-- ============================================
-- TRIGGERS
-- ============================================

DELIMITER $$

CREATE TRIGGER after_calificacion_proveedor_insert
AFTER INSERT ON calificaciones_proveedor
FOR EACH ROW
BEGIN
    UPDATE perfiles_proveedor
    SET 
        calificacion_promedio = (
            SELECT AVG(puntuacion) 
            FROM calificaciones_proveedor 
            WHERE proveedor_id = NEW.proveedor_id
        ),
        total_calificaciones = (
            SELECT COUNT(*) 
            FROM calificaciones_proveedor 
            WHERE proveedor_id = NEW.proveedor_id
        )
    WHERE id = NEW.proveedor_id;
END$$

CREATE TRIGGER after_calificacion_herramienta_insert
AFTER INSERT ON calificaciones_herramienta
FOR EACH ROW
BEGIN
    UPDATE herramientas
    SET 
        calificacion_promedio = (
            SELECT AVG(puntuacion) 
            FROM calificaciones_herramienta 
            WHERE herramienta_id = NEW.herramienta_id
        ),
        total_calificaciones = (
            SELECT COUNT(*) 
            FROM calificaciones_herramienta 
            WHERE herramienta_id = NEW.herramienta_id
        )
    WHERE id = NEW.herramienta_id;
END$$

CREATE TRIGGER after_reserva_update_estado
AFTER UPDATE ON reservas
FOR EACH ROW
BEGIN
    IF NEW.estado = 'CONFIRMADA' AND OLD.estado != 'CONFIRMADA' AND NEW.instancia_id IS NOT NULL THEN
        UPDATE herramientas_instancia 
        SET estado = 'RESERVADA' 
        WHERE id = NEW.instancia_id;
    END IF;
    
    IF NEW.estado = 'EN_USO' AND OLD.estado != 'EN_USO' AND NEW.instancia_id IS NOT NULL THEN
        UPDATE herramientas_instancia 
        SET estado = 'EN_USO' 
        WHERE id = NEW.instancia_id;
    END IF;
    
    IF NEW.estado = 'COMPLETADA' AND OLD.estado != 'COMPLETADA' AND NEW.instancia_id IS NOT NULL THEN
        UPDATE herramientas_instancia 
        SET estado = 'DISPONIBLE',
            total_usos = total_usos + 1
        WHERE id = NEW.instancia_id;
    END IF;
    
    IF NEW.estado = 'PERDIDA' AND OLD.estado != 'PERDIDA' AND NEW.instancia_id IS NOT NULL THEN
        UPDATE herramientas_instancia 
        SET estado = 'PERDIDA' 
        WHERE id = NEW.instancia_id;
    END IF;
    
    IF NEW.estado = 'ROBADA' AND OLD.estado != 'ROBADA' AND NEW.instancia_id IS NOT NULL THEN
        UPDATE herramientas_instancia 
        SET estado = 'ROBADA' 
        WHERE id = NEW.instancia_id;
    END IF;
END$$

CREATE TRIGGER before_herramienta_update_precio
BEFORE UPDATE ON herramientas
FOR EACH ROW
BEGIN
    IF NEW.precio_base_dia != OLD.precio_base_dia THEN
        INSERT INTO historial_precios (
            id,
            herramienta_id,
            precio_anterior,
            precio_nuevo,
            modificado_por,
            vigencia_desde,
            motivo
        ) VALUES (
            UUID(),
            OLD.id,
            OLD.precio_base_dia,
            NEW.precio_base_dia,
            @current_user_id,
            NOW(),
            'Cambio de precio'
        );
        
        UPDATE historial_precios
        SET vigencia_hasta = NOW()
        WHERE herramienta_id = OLD.id
        AND vigencia_hasta IS NULL
        AND precio_nuevo = OLD.precio_base_dia;
    END IF;
END$$

CREATE TRIGGER after_reserva_completada_liquidacion
AFTER UPDATE ON reservas
FOR EACH ROW
BEGIN
    DECLARE monto_proveedor DECIMAL(12,2);
    DECLARE saldo_previo DECIMAL(12,2);
    DECLARE billetera_id_var CHAR(36);
    
    IF NEW.estado = 'COMPLETADA' AND OLD.estado != 'COMPLETADA' THEN
        SELECT 
            subtotal_alquiler - comision_admin INTO monto_proveedor
        FROM detalle_reserva
        WHERE reserva_id = NEW.id;
        
        SELECT id, saldo_disponible INTO billetera_id_var, saldo_previo
        FROM billetera_proveedor
        WHERE proveedor_id = NEW.proveedor_id;
        
        INSERT INTO movimientos_billetera (
            id,
            billetera_id,
            proveedor_id,
            reserva_id,
            tipo,
            monto,
            saldo_anterior,
            saldo_nuevo,
            descripcion,
            referencia
        ) VALUES (
            UUID(),
            billetera_id_var,
            NEW.proveedor_id,
            NEW.id,
            'INGRESO_ALQUILER',
            monto_proveedor,
            saldo_previo,
            saldo_previo + monto_proveedor,
            'Liquidación de reserva completada',
            NEW.numero_reserva
        );
        
        UPDATE billetera_proveedor
        SET saldo_disponible = saldo_disponible + monto_proveedor
        WHERE id = billetera_id_var;
    END IF;
END$$

CREATE TRIGGER after_perfil_proveedor_insert
AFTER INSERT ON perfiles_proveedor
FOR EACH ROW
BEGIN
    INSERT INTO billetera_proveedor (
        id,
        proveedor_id,
        saldo_disponible,
        saldo_retenido
    ) VALUES (
        UUID(),
        NEW.id,
        0.00,
        0.00
    );
END$$

DELIMITER ;

-- ============================================
-- FIN DEL SCRIPT - 47 TABLAS
-- ============================================