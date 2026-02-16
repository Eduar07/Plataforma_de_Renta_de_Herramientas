-- ============================================
-- DATOS INICIALES - MARKETPLACE HERRAMIENTAS
-- ============================================

USE marketplace_herramientas;

-- ============================================
-- 1. USUARIOS ADMINISTRADORES
-- ============================================
INSERT INTO usuarios (id, email, password_hash, tipo, nombre, apellido, telefono, direccion, ciudad, departamento, documento_tipo, documento_numero, score, estado) VALUES
(UUID(), 'admin@rentaherramientas.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'Administrador', 'Sistema', '3001234567', 'Calle 123 #45-67', 'Bucaramanga', 'Santander', 'CC', '1234567890', 100, 'ACTIVO'),
(UUID(), 'soporte@rentaherramientas.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'Soporte', 'Técnico', '3009876543', 'Carrera 27 #34-56', 'Bucaramanga', 'Santander', 'CC', '9876543210', 100, 'ACTIVO');

-- ============================================
-- 2. USUARIOS PROVEEDORES
-- ============================================
INSERT INTO usuarios (id, email, password_hash, tipo, nombre, apellido, telefono, direccion, ciudad, departamento, documento_tipo, documento_numero, score, estado) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'proveedor1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PROVEEDOR', 'Carlos', 'Ramírez', '3101234567', 'Calle 50 #20-30', 'Bucaramanga', 'Santander', 'CC', '1020304050', 100, 'ACTIVO'),
('550e8400-e29b-41d4-a716-446655440002', 'proveedor2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'PROVEEDOR', 'María', 'González', '3159876543', 'Carrera 33 #15-25', 'Floridablanca', 'Santander', 'CC', '2030405060', 100, 'ACTIVO');

-- ============================================
-- 3. PERFILES DE PROVEEDORES
-- ============================================
INSERT INTO perfiles_proveedor (id, usuario_id, nombre_comercial, mision, vision, calificacion_promedio, total_calificaciones, estado_kyc, verificado) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Herramientas El Constructor', 'Proveer las mejores herramientas para construcción', 'Ser líderes en renta de herramientas industriales', 4.8, 156, 'APROBADO', TRUE),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Equipos Pro', 'Calidad y servicio en alquiler de equipos', 'Innovar en el sector de renta de herramientas', 4.6, 89, 'APROBADO', TRUE);

-- ============================================
-- 4. USUARIOS CLIENTES
-- ============================================
INSERT INTO usuarios (id, email, password_hash, tipo, nombre, apellido, telefono, direccion, ciudad, departamento, documento_tipo, documento_numero, score, estado) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'cliente1@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CLIENTE', 'Juan', 'Pérez', '3201234567', 'Calle 10 #5-15', 'Bucaramanga', 'Santander', 'CC', '3040506070', 95, 'ACTIVO'),
('770e8400-e29b-41d4-a716-446655440002', 'cliente2@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CLIENTE', 'Ana', 'Martínez', '3159998877', 'Carrera 15 #8-20', 'Girón', 'Santander', 'CC', '4050607080', 98, 'ACTIVO');

-- ============================================
-- 5. DIRECCIONES DE ENVÍO
-- ============================================
INSERT INTO direcciones_envio (id, usuario_id, alias, destinatario, telefono, direccion, ciudad, departamento, codigo_postal, es_principal, activa) VALUES
(UUID(), '770e8400-e29b-41d4-a716-446655440001', 'Casa', 'Juan Pérez', '3201234567', 'Calle 10 #5-15', 'Bucaramanga', 'Santander', '680001', TRUE, TRUE),
(UUID(), '770e8400-e29b-41d4-a716-446655440002', 'Apartamento', 'Ana Martínez', '3159998877', 'Carrera 15 #8-20', 'Girón', 'Santander', '681001', TRUE, TRUE);

-- ============================================
-- 6. CATEGORÍAS
-- ============================================
INSERT INTO categorias (id, nombre, slug, descripcion, orden, activa) VALUES
('880e8400-e29b-41d4-a716-446655440001', 'Construcción', 'construccion', 'Herramientas para construcción y obras', 1, TRUE),
('880e8400-e29b-41d4-a716-446655440002', 'Carpintería', 'carpinteria', 'Herramientas para trabajo en madera', 2, TRUE),
('880e8400-e29b-41d4-a716-446655440003', 'Jardinería', 'jardineria', 'Equipos para mantenimiento de jardines', 3, TRUE),
('880e8400-e29b-41d4-a716-446655440004', 'Electricidad', 'electricidad', 'Herramientas eléctricas y de medición', 4, TRUE),
('880e8400-e29b-41d4-a716-446655440005', 'Pintura', 'pintura', 'Equipos para pintar y acabados', 5, TRUE);

-- ============================================
-- 7. CARACTERÍSTICAS
-- ============================================
INSERT INTO caracteristicas (id, nombre, tipo, descripcion, activa) VALUES
(UUID(), 'Potencia', 'ESPECIFICACION', 'Potencia del motor', TRUE),
(UUID(), 'Voltaje', 'ESPECIFICACION', 'Voltaje de operación', TRUE),
(UUID(), 'Peso', 'ESPECIFICACION', 'Peso del equipo', TRUE),
(UUID(), 'Inalámbrica', 'CARACTERISTICA', 'Funciona sin cable', TRUE),
(UUID(), 'Portátil', 'CARACTERISTICA', 'Fácil de transportar', TRUE),
(UUID(), 'Maletín de transporte', 'INCLUYE', 'Incluye estuche', TRUE),
(UUID(), 'Manual de usuario', 'INCLUYE', 'Incluye manual', TRUE),
(UUID(), 'Garantía extendida', 'INCLUYE', 'Garantía adicional', TRUE);

-- ============================================
-- 8. HERRAMIENTAS
-- ============================================
INSERT INTO herramientas (id, proveedor_id, categoria_id, nombre, marca, modelo, sku, descripcion, fotos, precio_base_dia, envio_incluido, dias_minimo_alquiler, dias_maximo_alquiler, deposito_seguridad, estado, calificacion_promedio, total_calificaciones, total_alquileres) VALUES
('990e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Taladro Percutor Profesional', 'DeWalt', 'DWD520K', 'TAL-001', 'Taladro percutor de 1/2" con control de velocidad variable', '["taladro1.jpg","taladro2.jpg"]', 25000.00, TRUE, 1, 30, 150000.00, 'ACTIVO', 4.7, 45, 78),
('990e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', 'Mezcladora de Concreto', 'Truper', 'MZ-180', 'MEZ-001', 'Mezcladora de concreto 180 litros gasolina', '["mezcladora1.jpg"]', 80000.00, FALSE, 2, 15, 500000.00, 'ACTIVO', 4.9, 23, 34),
('990e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440002', 'Sierra Circular de Mesa', 'Bosch', 'GTS 10J', 'SIE-001', 'Sierra de mesa profesional con guía de precisión', '["sierra1.jpg","sierra2.jpg"]', 45000.00, TRUE, 1, 20, 300000.00, 'ACTIVO', 4.8, 32, 56),
('990e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440003', 'Cortadora de Césped', 'Honda', 'HRX217VKA', 'COR-001', 'Cortadora autopropulsada 21" con bolsa recolectora', '["cortadora1.jpg"]', 35000.00, TRUE, 1, 10, 200000.00, 'ACTIVO', 4.6, 18, 29),
('990e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440005', 'Compresor de Aire', 'Campbell Hausfeld', 'DC080500', 'COM-001', 'Compresor portátil 8 galones 150 PSI', '["compresor1.jpg","compresor2.jpg"]', 40000.00, TRUE, 1, 25, 250000.00, 'ACTIVO', 4.7, 27, 41);

-- ============================================
-- 9. INSTANCIAS DE HERRAMIENTAS
-- ============================================
INSERT INTO herramientas_instancia (id, herramienta_id, codigo_interno, estado, ubicacion_fisica, total_usos) VALUES
(UUID(), '990e8400-e29b-41d4-a716-446655440001', 'TAL-001-A', 'DISPONIBLE', 'Bodega Principal - Estante A3', 15),
(UUID(), '990e8400-e29b-41d4-a716-446655440001', 'TAL-001-B', 'DISPONIBLE', 'Bodega Principal - Estante A3', 12),
(UUID(), '990e8400-e29b-41d4-a716-446655440002', 'MEZ-001-A', 'DISPONIBLE', 'Bodega Principal - Área Pesada', 8),
(UUID(), '990e8400-e29b-41d4-a716-446655440003', 'SIE-001-A', 'DISPONIBLE', 'Bodega Secundaria - Zona B', 22),
(UUID(), '990e8400-e29b-41d4-a716-446655440004', 'COR-001-A', 'DISPONIBLE', 'Bodega Principal - Jardinería', 10),
(UUID(), '990e8400-e29b-41d4-a716-446655440005', 'COM-001-A', 'DISPONIBLE', 'Bodega Principal - Estante C1', 18);

-- ============================================
-- 10. CONFIGURACIÓN DE LA PLATAFORMA
-- ============================================
INSERT INTO configuracion_plataforma
(id, clave, valor, tipo_dato, descripcion, categoria)
VALUES
(UUID(), 'comision_porcentaje', '10.0', 'NUMBER', 'Porcentaje de comisión que cobra la plataforma', 'FINANCIERO'),
(UUID(), 'seguro_porcentaje', '5.0', 'NUMBER', 'Porcentaje del subtotal para el seguro', 'FINANCIERO'),
(UUID(), 'mora_cargo_diario', '10000', 'NUMBER', 'Cargo por día de mora en pesos', 'FINANCIERO'),
(UUID(), 'dias_verificacion_entrega', '1', 'NUMBER', 'Días para verificar recepción (24 horas)', 'OPERACIONAL'),
(UUID(), 'retiro_minimo', '50000', 'NUMBER', 'Monto mínimo para solicitar retiro', 'FINANCIERO'),
(UUID(), 'datacredito_dias_mora', '90', 'NUMBER', 'Días de mora antes de reportar a Datacrédito', 'FINANCIERO'),
(UUID(), 'maximo_advertencias', '5', 'NUMBER', 'Máximo de advertencias antes de bloqueo', 'SEGURIDAD'),
(UUID(), 'dias_cancelacion_sin_penalizacion', '2', 'NUMBER', 'Días antes de inicio para cancelar sin penalización', 'OPERACIONAL')
ON DUPLICATE KEY UPDATE
    valor       = VALUES(valor),
    tipo_dato   = VALUES(tipo_dato),
    descripcion = VALUES(descripcion),
    categoria   = VALUES(categoria);

-- ============================================
-- 11. FONDO DE SEGUROS
-- ============================================
INSERT INTO fondo_seguros (id, balance_total, total_recaudado, total_pagado, seguros_activos) VALUES
(UUID(), 0.00, 0.00, 0.00, 0);

-- ============================================
-- 12. BILLETERAS DE PROVEEDORES
-- ============================================
INSERT INTO billetera_proveedor
(id, proveedor_id, saldo_disponible, saldo_retenido)
VALUES
(UUID(), '660e8400-e29b-41d4-a716-446655440001', 0.00, 0.00),
(UUID(), '660e8400-e29b-41d4-a716-446655440002', 0.00, 0.00)
ON DUPLICATE KEY UPDATE
    saldo_disponible = VALUES(saldo_disponible),
    saldo_retenido   = VALUES(saldo_retenido);

-- ============================================
-- 13. CUPONES DE DESCUENTO
-- ============================================
INSERT INTO cupones (id, codigo, descripcion, tipo_descuento, valor, monto_minimo, fecha_inicio, fecha_expiracion, usos_maximos, usos_actuales, activo) VALUES
(UUID(), 'BIENVENIDA2024', 'Cupón de bienvenida para nuevos clientes', 'PORCENTAJE', 15.00, 50000.00, '2024-01-01', '2024-12-31', 1000, 0, TRUE),
(UUID(), 'PRIMERARENTA', 'Descuento en tu primera renta', 'MONTO_FIJO', 20000.00, 100000.00, '2024-01-01', '2024-12-31', 500, 0, TRUE),
(UUID(), 'VERANO2024', 'Descuento especial de verano', 'PORCENTAJE', 10.00, 75000.00, '2024-06-01', '2024-08-31', 2000, 0, TRUE);

-- ============================================
-- FIN DE DATOS INICIALES
-- ============================================

-- Contraseña para todos los usuarios de prueba: "password123"
-- Hash bcrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy

UPDATE usuarios SET password_hash = '$2a$10$WD7y6OkvHiGVI.4u5.rGHOhdqXYXrQy1/CtYouEs8SgkHoE2t7x9m' WHERE email = 'proveedor1@example.com';
UPDATE usuarios SET password_hash = '$2a$10$WD7y6OkvHiGVI.4u5.rGHOhdqXYXrQy1/CtYouEs8SgkHoE2t7x9m' WHERE email = 'proveedor2@example.com';
UPDATE usuarios SET password_hash = '$2a$10$WD7y6OkvHiGVI.4u5.rGHOhdqXYXrQy1/CtYouEs8SgkHoE2t7x9m' WHERE email = 'cliente1@example.com';
UPDATE usuarios SET password_hash = '$2a$10$WD7y6OkvHiGVI.4u5.rGHOhdqXYXrQy1/CtYouEs8SgkHoE2t7x9m' WHERE email = 'cliente2@example.com';
UPDATE usuarios SET password_hash = '$2a$10$WD7y6OkvHiGVI.4u5.rGHOhdqXYXrQy1/CtYouEs8SgkHoE2t7x9m' WHERE email = 'admin@rentaherramientas.com';
UPDATE usuarios SET password_hash = '$2a$10$WD7y6OkvHiGVI.4u5.rGHOhdqXYXrQy1/CtYouEs8SgkHoE2t7x9m' WHERE email = 'soporte@rentaherramientas.com';