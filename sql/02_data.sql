-- ========================================
-- SCRIPT DML: Datos de Prueba
-- Plataforma de Renta de Herramientas
-- MySQL 8.x
-- ========================================

USE renta_herramientas;

-- ========================================
-- DATOS: usuarios
-- Password para todos: password123
-- Encriptado con BCrypt
-- ========================================

INSERT INTO usuarios (username, email, password, nombre_completo, telefono, direccion, ciudad, documento, rol, activo) VALUES
-- ADMIN
('admin', 'admin@rentaherramientas.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador Sistema', '3001234567', 'Calle 100 #15-20', 'Bogotá', '1234567890', 'ADMIN', TRUE),

-- PROVEEDORES
('proveedor1', 'proveedor1@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Juan Carlos Martínez', '3101234567', 'Carrera 50 #30-15', 'Medellín', '1010101010', 'PROVEEDOR', TRUE),
('proveedor2', 'proveedor2@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'María Fernanda López', '3201234567', 'Avenida 68 #45-30', 'Cali', '2020202020', 'PROVEEDOR', TRUE),
('proveedor3', 'proveedor3@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Carlos Andrés Rodríguez', '3301234567', 'Calle 80 #20-40', 'Barranquilla', '3030303030', 'PROVEEDOR', TRUE),
('proveedor4', 'proveedor4@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Ana María González', '3401234567', 'Carrera 15 #90-25', 'Cartagena', '4040404040', 'PROVEEDOR', TRUE),
('proveedor5', 'proveedor5@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Pedro Pablo Ramírez', '3501234567', 'Calle 45 #12-30', 'Bucaramanga', '5050505050', 'PROVEEDOR', TRUE),

-- CLIENTES
('cliente1', 'cliente1@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Luis Alberto Pérez', '3601234567', 'Calle 25 #10-15', 'Bogotá', '6060606060', 'CLIENTE', TRUE),
('cliente2', 'cliente2@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Sandra Patricia Gómez', '3701234567', 'Carrera 30 #50-20', 'Medellín', '7070707070', 'CLIENTE', TRUE),
('cliente3', 'cliente3@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Jorge Eliécer Díaz', '3801234567', 'Avenida 10 #20-30', 'Cali', '8080808080', 'CLIENTE', TRUE),
('cliente4', 'cliente4@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Carolina Herrera Vargas', '3901234567', 'Calle 50 #15-25', 'Barranquilla', '9090909090', 'CLIENTE', TRUE),
('cliente5', 'cliente5@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Roberto Carlos Silva', '3102345678', 'Carrera 20 #40-10', 'Cartagena', '1011121314', 'CLIENTE', TRUE),
('cliente6', 'cliente6@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Diana Marcela Torres', '3112345678', 'Calle 60 #25-35', 'Bucaramanga', '1112131415', 'CLIENTE', TRUE),
('cliente7', 'cliente7@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Miguel Ángel Sánchez', '3122345678', 'Avenida 30 #10-20', 'Bogotá', '1213141516', 'CLIENTE', TRUE),
('cliente8', 'cliente8@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Patricia Elena Ruiz', '3132345678', 'Carrera 40 #30-15', 'Medellín', '1314151617', 'CLIENTE', TRUE),
('cliente9', 'cliente9@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Andrés Felipe Castro', '3142345678', 'Calle 70 #20-40', 'Cali', '1415161718', 'CLIENTE', TRUE),
('cliente10', 'cliente10@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Claudia Marcela Jiménez', '3152345678', 'Avenida 50 #15-25', 'Barranquilla', '1516171819', 'CLIENTE', TRUE),
('cliente11', 'cliente11@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Fernando José Morales', '3162345678', 'Carrera 60 #40-30', 'Cartagena', '1617181920', 'CLIENTE', TRUE),
('cliente12', 'cliente12@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Gloria Inés Mendoza', '3172345678', 'Calle 35 #25-15', 'Bucaramanga', '1718192021', 'CLIENTE', TRUE),
('cliente13', 'cliente13@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Héctor Manuel Ortiz', '3182345678', 'Avenida 80 #30-20', 'Bogotá', '1819202122', 'CLIENTE', TRUE),
('cliente14', 'cliente14@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Isabel Cristina Reyes', '3192345678', 'Carrera 70 #50-25', 'Medellín', '1920212223', 'CLIENTE', TRUE);

-- ========================================
-- DATOS: herramientas
-- ========================================

INSERT INTO herramientas (nombre, descripcion, marca, modelo, categoria, precio_dia, precio_semana, precio_mes, stock_disponible, estado, especificaciones, proveedor_id) VALUES
-- Herramientas del Proveedor 1
('Taladro Percutor Profesional', 'Taladro percutor con alta potencia para trabajo pesado', 'DeWalt', 'DW5140', 'Herramientas Eléctricas', 25000.00, 150000.00, 500000.00, 5, 'DISPONIBLE', 'Potencia: 1200W, Velocidad: 0-3000 RPM, Incluye maletín', 2),
('Mezcladora de Concreto', 'Mezcladora eléctrica de concreto capacidad 120 litros', 'Truper', 'MX-120', 'Maquinaria Pesada', 80000.00, 500000.00, 1800000.00, 2, 'DISPONIBLE', 'Motor 1HP, Capacidad 120L, Voltaje 110V', 2),
('Cortadora de Cerámica', 'Cortadora manual profesional para cerámica y porcelanato', 'Rubi', 'TX-900', 'Herramientas de Corte', 15000.00, 90000.00, 300000.00, 3, 'DISPONIBLE', 'Corte máximo: 90cm, Disco diamantado incluido', 2),
('Andamio Tubular 2 Cuerpos', 'Andamio metálico tubular de 2 cuerpos con ruedas', 'Alustep', 'AT-2000', 'Andamios y Escaleras', 35000.00, 200000.00, 700000.00, 4, 'DISPONIBLE', 'Altura: 4m, Carga máxima: 200kg, Con ruedas y frenos', 2),
('Compresor de Aire', 'Compresor de aire portátil de alta presión', 'Stanley', 'SC-50', 'Maquinaria', 40000.00, 240000.00, 850000.00, 2, 'DISPONIBLE', 'Tanque 50L, Presión máx: 150PSI, Motor 2HP', 2),

-- Herramientas del Proveedor 2
('Martillo Demoledor', 'Martillo demoledor eléctrico de alta potencia', 'Bosch', 'GSH-11E', 'Herramientas Eléctricas', 60000.00, 350000.00, 1200000.00, 3, 'DISPONIBLE', 'Potencia: 1500W, Impactos: 2900/min, Peso: 10kg', 3),
('Sierra Circular', 'Sierra circular profesional con guía láser', 'Makita', 'HS7600', 'Herramientas de Corte', 20000.00, 120000.00, 400000.00, 4, 'DISPONIBLE', 'Disco 7 1/4", Potencia 1200W, Profundidad corte: 66mm', 3),
('Pulidora Angular Grande', 'Pulidora angular de 9 pulgadas para corte y desbaste', 'Bosch', 'GWS-2000', 'Herramientas Eléctricas', 18000.00, 100000.00, 350000.00, 5, 'DISPONIBLE', 'Disco 9", Potencia 2000W, RPM: 6500', 3),
('Escalera Telescópica', 'Escalera telescópica de aluminio multiposición', 'Little Giant', 'M22', 'Andamios y Escaleras', 12000.00, 70000.00, 240000.00, 6, 'DISPONIBLE', 'Extensión: 6.70m, Aluminio, Carga: 136kg', 3),
('Generador Eléctrico', 'Generador eléctrico a gasolina portátil', 'Honda', 'EU2200i', 'Maquinaria', 70000.00, 400000.00, 1400000.00, 2, 'DISPONIBLE', 'Potencia: 2200W, Inverter, Arranque eléctrico', 3),

-- Herramientas del Proveedor 3
('Vibrador para Concreto', 'Vibrador de inmersión para concreto', 'Wacker', 'M2500', 'Maquinaria', 30000.00, 180000.00, 600000.00, 3, 'DISPONIBLE', 'Motor eléctrico, Manguera 4m, Cabezal 45mm', 4),
('Nivel Láser Rotativo', 'Nivel láser autonivelante rotativo 360°', 'Dewalt', 'DW074', 'Herramientas de Medición', 25000.00, 150000.00, 500000.00, 4, 'DISPONIBLE', 'Rango: 100m, Precisión ±1.5mm, Con trípode', 4),
('Soldadora Inverter', 'Soldadora eléctrica tipo inverter profesional', 'Lincoln', 'PowerMIG-210', 'Herramientas de Soldadura', 35000.00, 200000.00, 700000.00, 2, 'DISPONIBLE', 'Corriente: 30-210A, MIG/TIG/Electrodo', 4),
('Plataforma Elevadora', 'Plataforma elevadora manual tijera', 'Genie', 'GS-1530', 'Andamios y Escaleras', 90000.00, 550000.00, 2000000.00, 1, 'DISPONIBLE', 'Altura: 5.7m, Capacidad: 227kg, Batería eléctrica', 4),
('Compactador de Placa', 'Compactador vibratorio de placa reversible', 'Wacker', 'DPU-5045', 'Maquinaria Pesada', 50000.00, 300000.00, 1000000.00, 2, 'DISPONIBLE', 'Motor Honda GX160, Peso 98kg, Ancho 45cm', 4),

-- Herramientas del Proveedor 4
('Pistola de Calor', 'Pistola de calor industrial ajustable', 'Black+Decker', 'HG1300', 'Herramientas Eléctricas', 8000.00, 45000.00, 150000.00, 8, 'DISPONIBLE', 'Temperatura: 50-600°C, Potencia 1800W', 5),
('Lijadora Orbital', 'Lijadora orbital eléctrica profesional', 'Makita', 'BO5041', 'Herramientas Eléctricas', 10000.00, 60000.00, 200000.00, 6, 'DISPONIBLE', 'Órbita 2.8mm, Potencia 300W, Velcro', 5),
('Carretilla Industrial', 'Carretilla de carga tipo buggy motorizada', 'Honda', 'HP500', 'Transporte', 45000.00, 270000.00, 900000.00, 3, 'DISPONIBLE', 'Motor Honda, Capacidad 500kg, Volcado hidráulico', 5),
('Cortadora de Piso', 'Cortadora de concreto y asfalto a gasolina', 'Husqvarna', 'K970', 'Herramientas de Corte', 75000.00, 450000.00, 1500000.00, 2, 'DISPONIBLE', 'Disco 14", Motor 94cc, Profundidad: 125mm', 5),
('Bomba de Agua', 'Motobomba centrífuga a gasolina', 'Honda', 'WB20XT', 'Maquinaria', 28000.00, 165000.00, 550000.00, 4, 'DISPONIBLE', 'Caudal: 600L/min, Motor 5.5HP, Altura: 26m', 5),

-- Herramientas del Proveedor 5
('Amoladora de Banco', 'Esmeril de banco doble profesional', 'DeWalt', 'DW756', 'Herramientas Eléctricas', 15000.00, 90000.00, 300000.00, 3, 'DISPONIBLE', 'Discos 6", Motor 3/4HP, Luces LED', 6),
('Pistola Clavadora', 'Clavadora neumática para acabados', 'Senco', 'FinishPro-18', 'Herramientas Neumáticas', 12000.00, 70000.00, 240000.00, 5, 'DISPONIBLE', 'Clavos 15-50mm, Presión 70-120PSI', 6),
('Aspiradora Industrial', 'Aspiradora industrial para polvo y líquidos', 'Karcher', 'WD6', 'Limpieza', 18000.00, 100000.00, 350000.00, 4, 'DISPONIBLE', 'Capacidad 30L, Potencia 1300W, HEPA filter', 6),
('Soplete de Propano', 'Kit completo soplete con tanque de propano', 'Rothenberger', 'Hot Box', 'Herramientas de Calor', 6000.00, 35000.00, 120000.00, 10, 'DISPONIBLE', 'Llama regulable, Tanque 14kg, Con manguera', 6),
('Dobladora de Varilla', 'Dobladora eléctrica para varilla de construcción', 'Benner Nawman', 'DBR-32WH', 'Maquinaria', 55000.00, 320000.00, 1100000.00, 2, 'DISPONIBLE', 'Varilla hasta 1", Motor 1HP, Portátil', 6),

-- Herramientas adicionales
('Hidrolavadora', 'Hidrolavadora de alta presión profesional', 'Karcher', 'K5', 'Limpieza', 22000.00, 130000.00, 450000.00, 3, 'DISPONIBLE', 'Presión: 145bar, Caudal 500L/h, Motor 2100W', 2),
('Rotomartillo', 'Rotomartillo percutor SDS-Plus', 'Bosch', 'GBH2-28', 'Herramientas Eléctricas', 16000.00, 95000.00, 320000.00, 4, 'DISPONIBLE', 'Potencia 880W, Impactos 4000/min, SDS-Plus', 3),
('Cizalla Eléctrica', 'Cizalla para corte de lámina metálica', 'Makita', 'JS3201', 'Herramientas de Corte', 20000.00, 120000.00, 400000.00, 2, 'DISPONIBLE', 'Corte hasta 3.2mm, Velocidad 2500/min', 4);

-- ========================================
-- DATOS: reservas
-- ========================================

INSERT INTO reservas (cliente_id, herramienta_id, proveedor_id, fecha_inicio, fecha_fin, dias_alquiler, costo_total, estado, observaciones) VALUES
-- Reservas APROBADAS
(7, 1, 2, '2025-02-01', '2025-02-03', 2, 50000.00, 'APROBADA', 'Trabajo de remodelación de casa'),
(8, 6, 3, '2025-02-05', '2025-02-10', 5, 300000.00, 'APROBADA', 'Demolición de muro'),
(9, 11, 4, '2025-02-03', '2025-02-07', 4, 100000.00, 'APROBADA', 'Medición de terreno'),
(10, 16, 5, '2025-01-28', '2025-02-02', 5, 375000.00, 'EN_CURSO', 'Corte de concreto en obra'),
(11, 21, 6, '2025-01-25', '2025-01-30', 5, 90000.00, 'COMPLETADA', 'Aspirado de obra'),

-- Reservas PENDIENTES
(12, 2, 2, '2025-02-10', '2025-02-15', 5, 400000.00, 'PENDIENTE', 'Mezclado de concreto para fundición'),
(13, 7, 3, '2025-02-12', '2025-02-17', 5, 100000.00, 'PENDIENTE', 'Corte de madera para estructura'),
(14, 12, 4, '2025-02-08', '2025-02-13', 5, 175000.00, 'PENDIENTE', 'Soldadura de estructura metálica'),
(15, 17, 5, '2025-02-14', '2025-02-20', 6, 270000.00, 'PENDIENTE', 'Transporte de materiales'),
(16, 22, 6, '2025-02-11', '2025-02-16', 5, 30000.00, 'PENDIENTE', 'Calentamiento de tubería'),

-- Reservas EN_CURSO
(17, 3, 2, '2025-01-29', '2025-02-05', 7, 105000.00, 'EN_CURSO', 'Corte de cerámica para baño'),
(18, 8, 3, '2025-01-30', '2025-02-04', 5, 90000.00, 'EN_CURSO', 'Desbaste de metal'),
(19, 13, 4, '2025-01-27', '2025-02-01', 5, 450000.00, 'EN_CURSO', 'Elevación de materiales'),
(20, 18, 5, '2025-01-26', '2025-02-02', 7, 525000.00, 'EN_CURSO', 'Corte de asfalto'),

-- Reservas COMPLETADAS
(7, 4, 2, '2025-01-15', '2025-01-20', 5, 175000.00, 'COMPLETADA', 'Trabajo en altura'),
(8, 9, 3, '2025-01-10', '2025-01-17', 7, 490000.00, 'COMPLETADA', 'Escalera para pintura'),
(9, 14, 4, '2025-01-12', '2025-01-18', 6, 180000.00, 'COMPLETADA', 'Compactación de terreno'),
(10, 19, 5, '2025-01-08', '2025-01-13', 5, 140000.00, 'COMPLETADA', 'Bombeo de agua'),
(11, 24, 2, '2025-01-20', '2025-01-25', 5, 110000.00, 'COMPLETADA', 'Lavado de fachada'),

-- Reservas RECHAZADAS
(12, 5, 2, '2025-02-20', '2025-02-25', 5, 200000.00, 'RECHAZADA', 'Equipo no disponible en esas fechas'),
(13, 10, 3, '2025-02-18', '2025-02-23', 5, 350000.00, 'RECHAZADA', 'Proveedor sin capacidad'),

-- Reservas CANCELADAS
(14, 15, 4, '2025-02-05', '2025-02-10', 5, 225000.00, 'CANCELADA', 'Cliente canceló por cambio de planes'),
(15, 20, 5, '2025-02-07', '2025-02-12', 5, 165000.00, 'CANCELADA', 'Cancelación por lluvia'),

-- Más reservas variadas
(16, 25, 3, '2025-01-18', '2025-01-23', 5, 80000.00, 'COMPLETADA', 'Perforación de concreto'),
(17, 26, 4, '2025-01-22', '2025-01-27', 5, 100000.00, 'COMPLETADA', 'Corte de lámina'),
(7, 5, 2, '2025-02-15', '2025-02-20', 5, 240000.00, 'PENDIENTE', 'Compresor para pintura'),
(8, 10, 3, '2025-02-16', '2025-02-21', 5, 400000.00, 'PENDIENTE', 'Generación de energía temporal');

-- ========================================
-- DATOS: pagos
-- ========================================

INSERT INTO pagos (reserva_id, cliente_id, monto, metodo_pago, estado, referencia, comprobante, observaciones) VALUES
-- Pagos COMPLETADOS
(1, 7, 50000.00, 'TARJETA_CREDITO', 'COMPLETADO', 'TC-2025-001', 'COMP-001.pdf', 'Pago exitoso con Visa'),
(2, 8, 300000.00, 'TRANSFERENCIA', 'COMPLETADO', 'TRANS-2025-001', 'COMP-002.pdf', 'Transferencia bancaria Bancolombia'),
(3, 9, 100000.00, 'PSE', 'COMPLETADO', 'PSE-2025-001', 'COMP-003.pdf', 'Pago por PSE'),
(4, 10, 375000.00, 'TARJETA_DEBITO', 'COMPLETADO', 'TD-2025-001', 'COMP-004.pdf', 'Débito Mastercard'),
(5, 11, 90000.00, 'EFECTIVO', 'COMPLETADO', 'EF-2025-001', 'COMP-005.pdf', 'Pago en efectivo al proveedor'),
(11, 17, 105000.00, 'TARJETA_CREDITO', 'COMPLETADO', 'TC-2025-002', 'COMP-006.pdf', 'Pago con Amex'),
(12, 18, 90000.00, 'PSE', 'COMPLETADO', 'PSE-2025-002', 'COMP-007.pdf', 'PSE exitoso'),
(13, 19, 450000.00, 'TRANSFERENCIA', 'COMPLETADO', 'TRANS-2025-002', 'COMP-008.pdf', 'Transferencia Davivienda'),
(14, 20, 525000.00, 'TARJETA_CREDITO', 'COMPLETADO', 'TC-2025-003', 'COMP-009.pdf', 'Visa empresarial'),
(15, 7, 175000.00, 'TARJETA_DEBITO', 'COMPLETADO', 'TD-2025-002', 'COMP-010.pdf', 'Débito exitoso'),
(16, 8, 490000.00, 'TRANSFERENCIA', 'COMPLETADO', 'TRANS-2025-003', 'COMP-011.pdf', 'Transferencia BBVA'),
(17, 9, 180000.00, 'EFECTIVO', 'COMPLETADO', 'EF-2025-002', 'COMP-012.pdf', 'Efectivo al entregar'),
(18, 10, 140000.00, 'PSE', 'COMPLETADO', 'PSE-2025-003', 'COMP-013.pdf', 'PSE Banco Popular'),
(19, 11, 110000.00, 'TARJETA_CREDITO', 'COMPLETADO', 'TC-2025-004', 'COMP-014.pdf', 'Mastercard'),
(24, 16, 80000.00, 'EFECTIVO', 'COMPLETADO', 'EF-2025-003', 'COMP-015.pdf', 'Pago al recoger'),
(25, 17, 100000.00, 'TARJETA_DEBITO', 'COMPLETADO', 'TD-2025-003', 'COMP-016.pdf', 'Débito visa'),

-- Pagos PENDIENTES
(6, 12, 400000.00, 'TRANSFERENCIA', 'PENDIENTE', 'TRANS-2025-004', NULL, 'Esperando confirmación bancaria'),
(7, 13, 100000.00, 'PSE', 'PENDIENTE', 'PSE-2025-004', NULL, 'Pago en proceso'),
(8, 14, 175000.00, 'TARJETA_CREDITO', 'PENDIENTE', 'TC-2025-005', NULL, 'Autorización pendiente'),
(9, 15, 270000.00, 'TRANSFERENCIA', 'PENDIENTE', 'TRANS-2025-005', NULL, 'En verificación');

-- ========================================
-- DATOS: facturas
-- ========================================

INSERT INTO facturas (numero_factura, reserva_id, cliente_id, proveedor_id, subtotal, impuestos, total, ruta_pdf) VALUES
('FACT-20250101-001', 1, 7, 2, 50000.00, 9500.00, 59500.00, '/facturas/FACT-20250101-001.pdf'),
('FACT-20250102-001', 2, 8, 3, 300000.00, 57000.00, 357000.00, '/facturas/FACT-20250102-001.pdf'),
('FACT-20250103-001', 3, 9, 4, 100000.00, 19000.00, 119000.00, '/facturas/FACT-20250103-001.pdf'),
('FACT-20250104-001', 4, 10, 5, 375000.00, 71250.00, 446250.00, '/facturas/FACT-20250104-001.pdf'),
('FACT-20250105-001', 5, 11, 6, 90000.00, 17100.00, 107100.00, '/facturas/FACT-20250105-001.pdf'),
('FACT-20250106-001', 11, 17, 2, 105000.00, 19950.00, 124950.00, '/facturas/FACT-20250106-001.pdf'),
('FACT-20250107-001', 12, 18, 3, 90000.00, 17100.00, 107100.00, '/facturas/FACT-20250107-001.pdf'),
('FACT-20250108-001', 13, 19, 4, 450000.00, 85500.00, 535500.00, '/facturas/FACT-20250108-001.pdf'),
('FACT-20250109-001', 14, 20, 5, 525000.00, 99750.00, 624750.00, '/facturas/FACT-20250109-001.pdf'),
('FACT-20250110-001', 15, 7, 2, 175000.00, 33250.00, 208250.00, '/facturas/FACT-20250110-001.pdf'),
('FACT-20250111-001', 16, 8, 3, 490000.00, 93100.00, 583100.00, '/facturas/FACT-20250111-001.pdf'),
('FACT-20250112-001', 17, 9, 4, 180000.00, 34200.00, 214200.00, '/facturas/FACT-20250112-001.pdf'),
('FACT-20250113-001', 18, 10, 5, 140000.00, 26600.00, 166600.00, '/facturas/FACT-20250113-001.pdf'),
('FACT-20250114-001', 19, 11, 6, 110000.00, 20900.00, 130900.00, '/facturas/FACT-20250114-001.pdf'),
('FACT-20250115-001', 24, 16, 2, 80000.00, 15200.00, 95200.00, '/facturas/FACT-20250115-001.pdf');

-- ========================================
-- FIN DEL SCRIPT DML
-- ========================================

-- Verificación de datos insertados
SELECT 'Usuarios insertados:' as Info, COUNT(*) as Total FROM usuarios
UNION ALL
SELECT 'Herramientas insertadas:', COUNT(*) FROM herramientas
UNION ALL
SELECT 'Reservas insertadas:', COUNT(*) FROM reservas
UNION ALL
SELECT 'Pagos insertados:', COUNT(*) FROM pagos
UNION ALL
SELECT 'Facturas insertadas:', COUNT(*) FROM facturas;