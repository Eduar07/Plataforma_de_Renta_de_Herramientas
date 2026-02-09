# 🔨 Plataforma de Renta de Herramientas y Equipos de Construcción

Sistema web para la gestión de alquiler de herramientas de construcción con arquitectura hexagonal, autenticación JWT y roles diferenciados.

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Características Principales](#-características-principales)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Base de Datos](#-base-de-datos)
- [API Documentation (Swagger)](#-api-documentation-swagger)
- [Roles y Permisos](#-roles-y-permisos)
- [Endpoints Principales](#-endpoints-principales)
- [Frontend](#-frontend)
- [Autenticación y Seguridad](#-autenticación-y-seguridad)
- [Funcionalidades por Rol](#-funcionalidades-por-rol)
- [Testing](#-testing)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)
- [Autores](#-autores)
- [Licencia](#-licencia)

---

## 📖 Descripción del Proyecto

**RentaHerramientas** es una plataforma completa que permite a proveedores ofrecer herramientas de construcción en alquiler y a clientes reservarlas de manera simple y segura. El sistema gestiona todo el ciclo: desde la publicación de herramientas, reservas, pagos, entregas, hasta la devolución y calificación.

### Contexto

El alquiler de herramientas y equipos de construcción es una necesidad frecuente para contratistas, empresas y particulares. Este proyecto automatiza el proceso de alquiler, mejorando la organización, el control de inventarios y la experiencia de los usuarios.

---

## ✨ Características Principales

✅ **Sistema de Autenticación y Autorización**
- Registro e inicio de sesión con JWT
- Roles diferenciados: ADMIN, PROVEEDOR, CLIENTE
- Refresh tokens para sesiones extendidas
- Cambio de contraseña seguro

✅ **Gestión de Perfiles de Proveedor**
- Creación automática de perfil al registrarse como proveedor
- Perfil comercial con misión, visión y logo
- Sistema de calificaciones y reseñas
- Verificación KYC (Know Your Customer)

✅ **Gestión de Herramientas**
- CRUD completo de herramientas
- Categorización por tipo de herramienta
- Sistema de disponibilidad en tiempo real
- Galería de imágenes por herramienta
- Control de estado (ACTIVO, PAUSADO, ELIMINADO)

✅ **Sistema de Reservas**
- Creación de reservas con selección de fechas
- Validación de disponibilidad automática
- Estados de reserva: PENDIENTE_PAGO, PAGADA, CONFIRMADA, ENVIADA, ENTREGADA, EN_USO, COMPLETADA
- Cancelación por cliente o proveedor
- Tracking de envío

✅ **Gestión de Pagos y Facturación**
- Registro de pagos con múltiples métodos
- Generación automática de facturas
- Cálculo automático de montos (días × precio base + seguro + envío)
- Historial de transacciones

✅ **Panel de Control por Rol**
- Dashboard personalizado para cada tipo de usuario
- Estadísticas en tiempo real (KPIs)
- Gestión de favoritos (clientes)
- Historial completo de transacciones

✅ **Sistema de Calificaciones**
- Clientes pueden calificar herramientas y proveedores
- Promedio de calificaciones visible
- Comentarios y reseñas

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Java 21** - Lenguaje de programación
- **Spring Boot 3.3.0** - Framework principal
- **Spring Security** - Autenticación y autorización
- **JWT (JSON Web Tokens)** - Manejo de sesiones
- **Spring Data JPA** - Persistencia de datos
- **Hibernate** - ORM
- **MySQL 8.0** - Base de datos relacional
- **Maven** - Gestión de dependencias
- **Lombok** - Reducción de código boilerplate
- **SpringDoc OpenAPI 3** - Documentación de API (Swagger)

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos personalizados
- **JavaScript (Vanilla)** - Lógica de cliente
- **Fetch API** - Comunicación con backend
- **LocalStorage** - Gestión de tokens y sesión

### Herramientas de Desarrollo
- **Git & GitHub** - Control de versiones
- **IntelliJ IDEA / VS Code** - IDEs
- **Postman** - Testing de API
- **MySQL Workbench** - Administración de base de datos
- **Apache Tomcat** - Servidor de aplicaciones

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una **Arquitectura Hexagonal (Ports & Adapters)** que garantiza separación de responsabilidades y facilita el mantenimiento.

```
src/main/java/com/rentaherramientas/
│
├── domain/                          # Capa de Dominio (Lógica de negocio)
│   ├── model/                       # Entidades del dominio
│   │   ├── Usuario.java
│   │   ├── PerfilProveedor.java
│   │   ├── Herramienta.java
│   │   ├── Reserva.java
│   │   ├── Pago.java
│   │   └── Factura.java
│   │
│   ├── port/                        # Puertos (Interfaces)
│   │   ├── in/                      # Use Cases (entrada)
│   │   │   ├── UsuarioUseCase.java
│   │   │   ├── HerramientaUseCase.java
│   │   │   └── ReservaUseCase.java
│   │   │
│   │   └── out/                     # Repository Ports (salida)
│   │       ├── UsuarioRepositoryPort.java
│   │       ├── HerramientaRepositoryPort.java
│   │       └── ReservaRepositoryPort.java
│   │
│   └── service/                     # Servicios de dominio
│       ├── UsuarioService.java
│       ├── HerramientaService.java
│       └── ReservaService.java
│
├── application/                     # Capa de Aplicación
│   └── dto/                         # Data Transfer Objects
│       ├── request/
│       │   ├── LoginRequest.java
│       │   ├── RegistroRequest.java
│       │   └── CrearHerramientaRequest.java
│       │
│       └── response/
│           ├── LoginResponse.java
│           ├── HerramientaResponse.java
│           └── ReservaResponse.java
│
└── infrastructure/                  # Capa de Infraestructura
    ├── adapter/
    │   ├── in/                      # Adaptadores de entrada
    │   │   └── rest/                # Controllers REST
    │   │       ├── AuthController.java
    │   │       ├── HerramientaController.java
    │   │       ├── ReservaController.java
    │   │       └── PerfilProveedorController.java
    │   │
    │   └── out/                     # Adaptadores de salida
    │       └── persistence/         # Implementaciones JPA
    │           ├── UsuarioRepositoryAdapter.java
    │           ├── HerramientaRepositoryAdapter.java
    │           └── ReservaRepositoryAdapter.java
    │
    ├── config/                      # Configuraciones
    │   ├── SecurityConfig.java      # Configuración de seguridad
    │   ├── BeanConfiguration.java   # Inyección de dependencias
    │   ├── OpenApiConfig.java       # Configuración Swagger
    │   └── JwtConfig.java           # Configuración JWT
    │
    └── security/                    # Seguridad
        ├── JwtService.java          # Generación y validación JWT
        └── JwtAuthenticationFilter.java
```

### Ventajas de la Arquitectura Hexagonal

✅ **Independencia de frameworks**: El dominio no depende de Spring
✅ **Testeable**: Fácil crear tests unitarios del dominio
✅ **Mantenible**: Cambios en infraestructura no afectan el dominio
✅ **Escalable**: Facilita agregar nuevas funcionalidades

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Java JDK 21** o superior ([Descargar](https://www.oracle.com/java/technologies/downloads/))
- **Maven 3.8+** ([Descargar](https://maven.apache.org/download.cgi))
- **MySQL 8.0+** ([Descargar](https://dev.mysql.com/downloads/installer/))
- **Git** ([Descargar](https://git-scm.com/downloads))
- **IDE** (IntelliJ IDEA o VS Code recomendados)

### Verificar Instalaciones

```bash
# Verificar Java
java -version
# Debe mostrar: java version "21.x.x"

# Verificar Maven
mvn -version
# Debe mostrar: Apache Maven 3.x.x

# Verificar MySQL
mysql --version
# Debe mostrar: mysql Ver 8.x.x
```

---

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/RentaHerramientas.git
cd RentaHerramientas
```

### 2. Configurar Base de Datos

#### Opción A: Crear Base de Datos Manualmente

```sql
-- Conectarse a MySQL
mysql -u root -p

-- Crear base de datos
CREATE DATABASE marketplace_herramientas 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE marketplace_herramientas;

-- Ejecutar el script SQL completo
source /ruta/al/proyecto/sql/marketplace_herramientas.sql;
```

#### Opción B: Dejar que Spring Boot cree las tablas automáticamente

Configurar en `application.yml`:
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: update  # O 'create' para recrear
```

### 3. Configurar Variables de Entorno

Crea un archivo `application-dev.yml` en `src/main/resources/`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/marketplace_herramientas?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: TU_PASSWORD_MYSQL
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true
        dialect: org.hibernate.dialect.MySQL8Dialect

jwt:
  secret: tu-secreto-super-seguro-minimo-32-caracteres-aqui-cambiar-en-produccion
  expiration: 900000        # 15 minutos
  refresh-expiration: 604800000  # 7 días

server:
  port: 8080
```

**⚠️ IMPORTANTE**: Cambia `TU_PASSWORD_MYSQL` por tu contraseña real de MySQL.

### 4. Instalar Dependencias

```bash
mvn clean install
```

### 5. Ejecutar la Aplicación

```bash
mvn spring-boot:run
```

O desde tu IDE, ejecuta la clase principal:
```java
RentaherramientasApplication.java
```

### 6. Verificar que funciona

Abre tu navegador en:
- **API Swagger**: http://localhost:8080/swagger-ui.html
- **Frontend**: http://localhost:8080/index.html

---

## 📁 Estructura del Proyecto

```
RentaHerramientas/
│
├── src/
│   ├── main/
│   │   ├── java/com/rentaherramientas/
│   │   │   ├── domain/              # Lógica de negocio
│   │   │   ├── application/         # DTOs
│   │   │   └── infrastructure/      # Controllers, Config, Security
│   │   │
│   │   └── resources/
│   │       ├── application.yml      # Configuración principal
│   │       ├── application-dev.yml  # Configuración desarrollo
│   │       ├── application-prod.yml # Configuración producción
│   │       └── static/              # Frontend (HTML, CSS, JS)
│   │           ├── index.html
│   │           ├── login.html
│   │           ├── registro.html
│   │           ├── cliente-dashboard.html
│   │           ├── proveedor-dashboard.html
│   │           ├── css/
│   │           │   ├── main.css
│   │           │   └── responsive.css
│   │           └── js/
│   │               ├── api.js
│   │               ├── auth.js
│   │               ├── cliente-dashboard.js
│   │               └── proveedor-dashboard.js
│   │
│   └── test/
│       └── java/com/rentaherramientas/
│           └── [Tests unitarios e integración]
│
├── sql/
│   └── marketplace_herramientas.sql  # Script completo de BD
│
├── docs/
│   ├── DATABASE_SETUP.md            # Guía de configuración BD
│   ├── SWAGGER_SETUP.md             # Guía de Swagger
│   ├── JWT_AUTHENTICATION.md        # Guía de autenticación
│   └── diagrama-er.png              # Diagrama relacional
│
├── pom.xml                          # Dependencias Maven
├── README.md                        # Este archivo
└── .gitignore
```

---

## 🗄️ Base de Datos

### Diagrama Entidad-Relación

![Diagrama ER](docs/diagrama-er.png)

### Tablas Principales

#### 1. **usuarios** (Users)
```sql
CREATE TABLE usuarios (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tipo ENUM('ADMIN', 'PROVEEDOR', 'CLIENTE') NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    direccion TEXT,
    ciudad VARCHAR(100),
    departamento VARCHAR(100),
    documento_tipo ENUM('CC', 'CE', 'NIT', 'PASAPORTE'),
    documento_numero VARCHAR(50),
    score INT DEFAULT 100,
    estado ENUM('ACTIVO', 'SUSPENDIDO', 'BLOQUEADO') DEFAULT 'ACTIVO',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. **perfiles_proveedor** (Provider Profiles)
```sql
CREATE TABLE perfiles_proveedor (
    id CHAR(36) PRIMARY KEY,
    usuario_id CHAR(36) UNIQUE NOT NULL,
    nombre_comercial VARCHAR(255) NOT NULL,
    mision TEXT,
    vision TEXT,
    logo_url VARCHAR(500),
    calificacion_promedio DECIMAL(3,2) DEFAULT 0.00,
    total_calificaciones INT DEFAULT 0,
    estado_kyc ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO') DEFAULT 'PENDIENTE',
    verificado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
```

#### 3. **herramientas** (Tools)
```sql
CREATE TABLE herramientas (
    id CHAR(36) PRIMARY KEY,
    proveedor_id CHAR(36) NOT NULL,
    categoria_id CHAR(36) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    precio_base_dia DECIMAL(10,2) NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    estado ENUM('ACTIVO', 'PAUSADO', 'ELIMINADO') DEFAULT 'ACTIVO',
    fotos JSON,
    envio_incluido BOOLEAN DEFAULT FALSE,
    calificacion_promedio DECIMAL(3,2) DEFAULT 0.00,
    total_alquileres INT DEFAULT 0,
    vistas INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES perfiles_proveedor(id),
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);
```

#### 4. **reservas** (Bookings)
```sql
CREATE TABLE reservas (
    id CHAR(36) PRIMARY KEY,
    numero_reserva VARCHAR(20) UNIQUE NOT NULL,
    cliente_id CHAR(36) NOT NULL,
    herramienta_id CHAR(36) NOT NULL,
    proveedor_id CHAR(36) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    dias_totales INT NOT NULL,
    precio_base DECIMAL(10,2) NOT NULL,
    seguro DECIMAL(10,2) DEFAULT 0.00,
    costo_envio DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    estado ENUM('PENDIENTE_PAGO', 'PAGADA', 'CONFIRMADA', 'ENVIADA', 
                'ENTREGADA', 'EN_USO', 'COMPLETADA', 
                'CANCELADA_CLIENTE', 'CANCELADA_PROVEEDOR') DEFAULT 'PENDIENTE_PAGO',
    direccion_entrega_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id),
    FOREIGN KEY (herramienta_id) REFERENCES herramientas(id),
    FOREIGN KEY (proveedor_id) REFERENCES perfiles_proveedor(id)
);
```

#### 5. **pagos** (Payments)
```sql
CREATE TABLE pagos (
    id CHAR(36) PRIMARY KEY,
    reserva_id CHAR(36) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    metodo ENUM('TARJETA_CREDITO', 'TARJETA_DEBITO', 'PSE', 'EFECTIVO', 'TRANSFERENCIA'),
    estado ENUM('PENDIENTE', 'APROBADO', 'RECHAZADO', 'REEMBOLSADO') DEFAULT 'PENDIENTE',
    referencia_pago VARCHAR(255),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reserva_id) REFERENCES reservas(id)
);
```

### Script SQL Completo

El script completo con **47 tablas** y datos de prueba está disponible en:
```
sql/marketplace_herramientas.sql
```

**Incluye:**
- 10 usuarios de prueba (3 proveedores, 5 clientes, 2 admins)
- 5 perfiles de proveedor
- 8 categorías de herramientas
- 15+ herramientas de ejemplo
- Datos de reservas y pagos
- Configuraciones del sistema

---

## 📚 API Documentation (Swagger)

### Acceder a Swagger UI

Una vez que la aplicación esté ejecutándose, accede a:

```
http://localhost:8080/swagger-ui.html
```

### Endpoints Documentados

Swagger proporciona documentación interactiva de todos los endpoints:

✅ **Autenticación**
- POST `/api/auth/registro` - Registrar nuevo usuario
- POST `/api/auth/login` - Iniciar sesión
- POST `/api/auth/refresh` - Renovar token
- POST `/api/auth/logout` - Cerrar sesión
- PUT `/api/auth/change-password` - Cambiar contraseña

✅ **Usuarios**
- GET `/api/usuarios` - Listar usuarios
- GET `/api/usuarios/{id}` - Obtener usuario por ID
- PUT `/api/usuarios/{id}` - Actualizar usuario
- DELETE `/api/usuarios/{id}` - Eliminar usuario

✅ **Perfiles de Proveedor**
- POST `/api/perfiles-proveedor` - Crear perfil
- GET `/api/perfiles-proveedor/{id}` - Obtener perfil
- PUT `/api/perfiles-proveedor/{id}` - Actualizar perfil
- GET `/api/perfiles-proveedor/usuario/{usuarioId}` - Obtener por usuario

✅ **Herramientas**
- POST `/api/herramientas` - Crear herramienta
- GET `/api/herramientas` - Listar herramientas
- GET `/api/herramientas/{id}` - Obtener herramienta
- PUT `/api/herramientas/{id}` - Actualizar herramienta
- PATCH `/api/herramientas/{id}/estado` - Cambiar estado
- GET `/api/herramientas/proveedor/{proveedorId}` - Herramientas por proveedor

✅ **Reservas**
- POST `/api/reservas` - Crear reserva
- GET `/api/reservas` - Listar reservas
- GET `/api/reservas/{id}` - Obtener reserva
- PATCH `/api/reservas/{id}/estado` - Cambiar estado
- GET `/api/reservas/cliente/{clienteId}` - Reservas por cliente
- GET `/api/reservas/proveedor/{usuarioId}` - Reservas por proveedor

✅ **Pagos**
- POST `/api/pagos` - Registrar pago
- GET `/api/pagos/reserva/{reservaId}` - Pagos por reserva

✅ **Facturas**
- GET `/api/facturas/reserva/{reservaId}` - Obtener factura

### Cómo Autenticarse en Swagger

1. **Obtener Token**:
   - Expandir `POST /api/auth/login`
   - Click en "Try it out"
   - Ingresar credenciales:
     ```json
     {
       "email": "proveedor1@example.com",
       "password": "password123"
     }
     ```
   - Click "Execute"
   - Copiar el `accessToken` de la respuesta

2. **Autorizar**:
   - Click en el botón **"Authorize"** 🔒 (arriba a la derecha)
   - Pegar el token (sin "Bearer")
   - Click "Authorize"

3. **Probar Endpoints Protegidos**:
   - Ahora puedes probar cualquier endpoint que requiera autenticación

---

## 🔐 Roles y Permisos

### Matriz de Permisos

| Funcionalidad | ADMIN | PROVEEDOR | CLIENTE |
|--------------|-------|-----------|---------|
| Gestionar usuarios | ✅ | ❌ | ❌ |
| Ver todos los usuarios | ✅ | ❌ | ❌ |
| Crear herramientas | ❌ | ✅ | ❌ |
| Editar propias herramientas | ❌ | ✅ | ❌ |
| Ver herramientas públicas | ✅ | ✅ | ✅ |
| Crear reservas | ❌ | ❌ | ✅ |
| Confirmar reservas | ❌ | ✅ | ❌ |
| Ver propias reservas | ✅ | ✅ | ✅ |
| Gestionar pagos | ✅ | ✅ | ✅ |
| Generar facturas | ✅ | ✅ | ✅ |
| Ver reportes globales | ✅ | ❌ | ❌ |
| Calificar herramientas | ❌ | ❌ | ✅ |

---

## 🔌 Endpoints Principales

### Autenticación

#### Registro
```http
POST /api/auth/registro
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123",
  "tipo": "PROVEEDOR",
  "nombre": "Juan",
  "apellido": "Pérez",
  "telefono": "3001234567",
  "direccion": "Calle 10 #20-30",
  "ciudad": "Bucaramanga",
  "departamento": "Santander",
  "documentoTipo": "CC",
  "documentoNumero": "1234567890"
}
```

**Respuesta 201 Created:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "usuario@example.com",
    "tipo": "PROVEEDOR",
    "nombre": "Juan",
    "apellido": "Pérez"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta 200 OK:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tipo": "PROVEEDOR",
    "usuario": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "usuario@example.com",
      "nombre": "Juan",
      "apellido": "Pérez"
    }
  }
}
```

### Herramientas

#### Crear Herramienta (Requiere rol PROVEEDOR)
```http
POST /api/herramientas
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "Taladro Percutor Bosch",
  "categoriaId": "1",
  "descripcion": "Taladro profesional de 850W con función de percusión",
  "marca": "Bosch",
  "modelo": "GSB 13 RE",
  "precioBaseDia": 25000,
  "proveedorId": "660e8400-e29b-41d4-a716-446655440001",
  "envioIncluido": true,
  "fotos": [
    "https://ejemplo.com/taladro1.jpg",
    "https://ejemplo.com/taladro2.jpg"
  ]
}
```

**Respuesta 201 Created:**
```json
{
  "success": true,
  "message": "Herramienta creada exitosamente",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440010",
    "nombre": "Taladro Percutor Bosch",
    "marca": "Bosch",
    "modelo": "GSB 13 RE",
    "precioBaseDia": 25000,
    "disponible": true,
    "estado": "ACTIVO",
    "calificacionPromedio": 0.0,
    "fotos": [...]
  }
}
```

#### Listar Herramientas (Público)
```http
GET /api/herramientas?categoria=1&disponible=true&page=0&size=20
```

### Reservas

#### Crear Reserva (Requiere rol CLIENTE)
```http
POST /api/reservas
Authorization: Bearer {token}
Content-Type: application/json

{
  "herramientaId": "770e8400-e29b-41d4-a716-446655440010",
  "fechaInicio": "2026-03-01",
  "fechaFin": "2026-03-05",
  "direccionEntregaId": "880e8400-e29b-41d4-a716-446655440020",
  "requiereSeguro": true
}
```

**Respuesta 201 Created:**
```json
{
  "success": true,
  "message": "Reserva creada exitosamente",
  "data": {
    "id": "990e8400-e29b-41d4-a716-446655440030",
    "numeroReserva": "R-2026-001",
    "herramienta": {...},
    "fechaInicio": "2026-03-01",
    "fechaFin": "2026-03-05",
    "diasTotales": 4,
    "precioBase": 100000,
    "seguro": 10000,
    "costoEnvio": 15000,
    "total": 125000,
    "estado": "PENDIENTE_PAGO"
  }
}
```

---

## 💻 Frontend

### Estructura de Páginas

#### Públicas (Sin autenticación)
- `index.html` - Landing page con catálogo de herramientas
- `login.html` - Inicio de sesión
- `registro.html` - Registro de usuarios

#### Privadas (Requieren autenticación)
- `cliente-dashboard.html` - Panel del cliente
- `proveedor-dashboard.html` - Panel del proveedor
- `admin-dashboard.html` - Panel del administrador

### Flujo de Autenticación

```javascript
// 1. Login exitoso
localStorage.setItem('token', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);
localStorage.setItem('userId', response.usuario.id);
localStorage.setItem('userRole', response.tipo);
localStorage.setItem('userName', response.usuario.nombre);

// 2. Verificar autenticación en cada página
if (!localStorage.getItem('token')) {
    window.location.href = '/login.html';
}

// 3. Incluir token en cada petición
const headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
};
```

### API Client (api.js)

```javascript
const api = {
    async get(endpoint) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.status === 401) {
            // Token expirado, intentar renovar
            await this.refreshToken();
            // Reintentar petición original
            return this.get(endpoint);
        }
        
        return await response.json();
    },
    
    async post(endpoint, data) {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        return await response.json();
    },
    
    async refreshToken() {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });
        
        const data = await response.json();
        localStorage.setItem('token', data.accessToken);
        return data;
    }
};
```

### Dashboard del Proveedor

Funcionalidades principales:
- **Mi Negocio**: KPIs (herramientas activas, reservas, ingresos)
- **Mis Herramientas**: CRUD de herramientas con galería de imágenes
- **Reservas**: Gestión de solicitudes y confirmación de entregas
- **Mi Perfil**: Edición de perfil comercial (nombre, misión, visión, logo)
- **Estadísticas**: Gráficos de rendimiento (próximamente)

---

## 🔒 Autenticación y Seguridad

### JWT (JSON Web Tokens)

#### Estructura del Token

```
Header.Payload.Signature
```

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "sub": "usuario@example.com",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "role": "PROVEEDOR",
  "iat": 1709856000,
  "exp": 1709856900
}
```

### Configuración de Seguridad

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // Públicos
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/herramientas/publicas").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                
                // Solo PROVEEDOR
                .requestMatchers(POST, "/api/herramientas").hasRole("PROVEEDOR")
                
                // Solo CLIENTE
                .requestMatchers(POST, "/api/reservas").hasRole("CLIENTE")
                
                // Solo ADMIN
                .requestMatchers("/api/usuarios/admin/**").hasRole("ADMIN")
                
                // Autenticados
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, 
                             UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### Password Hashing

Se utiliza **BCrypt** para hashear contraseñas:

```java
@Service
public class PasswordService {
    
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    
    public String hashPassword(String plainPassword) {
        return passwordEncoder.encode(plainPassword);
    }
    
    public boolean matches(String plainPassword, String hashedPassword) {
        return passwordEncoder.matches(plainPassword, hashedPassword);
    }
}
```

### CORS Configuration

```yaml
cors:
  allowed-origins:
    - http://localhost:3000
    - http://localhost:8080
  allowed-methods:
    - GET
    - POST
    - PUT
    - PATCH
    - DELETE
  allowed-headers:
    - Authorization
    - Content-Type
  allow-credentials: true
```

---

## 👥 Funcionalidades por Rol

### ADMIN (Administrador)

✅ **Gestión de Usuarios**
- Ver todos los usuarios registrados
- Activar/Suspender/Bloquear usuarios
- Asignar y modificar roles
- Ver historial de actividad

✅ **Supervisión de Alquileres**
- Ver todas las reservas del sistema
- Resolver disputas entre clientes y proveedores
- Validar devoluciones y reportes de daños

✅ **Gestión de Pagos**
- Monitorear todos los pagos
- Gestionar reembolsos
- Ver estadísticas financieras

✅ **Reportes y Métricas**
- Ingresos totales y por período
- Herramientas más alquiladas
- Proveedores con mejor rendimiento
- Clientes más activos

### PROVEEDOR (Proveedor de Herramientas)

✅ **Mi Perfil**
- Editar nombre comercial
- Configurar misión y visión
- Subir logo
- Ver calificación promedio

✅ **Gestión de Inventario**
- Agregar nuevas herramientas
- Editar herramientas existentes
- Pausar/Activar publicaciones
- Subir galería de imágenes
- Definir precio por día

✅ **Gestión de Reservas**
- Ver solicitudes de alquiler (PAGADA)
- Confirmar o rechazar reservas
- Marcar como enviada (con tracking)
- Confirmar devolución
- Reportar daños

✅ **Mi Negocio**
- Dashboard con KPIs
- Herramientas activas
- Reservas del mes
- Calificación promedio
- Ingresos acumulados

✅ **Historial**
- Ver todas las reservas pasadas
- Historial de pagos recibidos
- Estadísticas de rendimiento

### CLIENTE (Cliente/Arrendatario)

✅ **Exploración**
- Ver catálogo de herramientas
- Filtrar por categoría
- Buscar por nombre
- Ver detalles y fotos
- Leer reseñas y calificaciones

✅ **Reservas**
- Seleccionar fechas de alquiler
- Validar disponibilidad en tiempo real
- Agregar seguro opcional
- Especificar dirección de entrega
- Realizar pago en línea

✅ **Mis Reservas**
- Ver reservas activas
- Ver historial de alquileres
- Ver estado de envío (tracking)
- Confirmar recepción
- Confirmar devolución

✅ **Pagos y Facturas**
- Ver historial de pagos
- Descargar facturas en PDF
- Ver detalles de transacciones

✅ **Favoritos**
- Marcar herramientas como favoritas
- Acceso rápido a favoritos

✅ **Calificaciones**
- Calificar herramientas alquiladas
- Dejar comentarios
- Calificar al proveedor

---

## 🧪 Testing

### Tests Unitarios

```bash
# Ejecutar todos los tests
mvn test

# Ejecutar tests de un paquete específico
mvn test -Dtest="com.rentaherramientas.domain.service.*"

# Ejecutar un test específico
mvn test -Dtest="UsuarioServiceTest#testCrearUsuario"
```

### Tests de Integración

```bash
# Ejecutar tests de integración
mvn verify

# Ejecutar con perfil de test
mvn test -Dspring.profiles.active=test
```

### Cobertura de Código

```bash
# Generar reporte de cobertura con JaCoCo
mvn clean test jacoco:report

# Ver reporte en: target/site/jacoco/index.html
```

### Ejemplo de Test Unitario

```java
@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {
    
    @Mock
    private UsuarioRepositoryPort usuarioRepository;
    
    @InjectMocks
    private UsuarioService usuarioService;
    
    @Test
    void testCrearUsuarioProveedor() {
        // Given
        CrearUsuarioRequest request = new CrearUsuarioRequest(
            "test@example.com",
            "password123",
            Rol.PROVEEDOR,
            "Juan",
            "Pérez"
        );
        
        // When
        Usuario usuario = usuarioService.crearUsuario(request);
        
        // Then
        assertNotNull(usuario);
        assertEquals("test@example.com", usuario.getEmail());
        assertEquals(Rol.PROVEEDOR, usuario.getTipo());
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }
}
```

---

## 🚀 Despliegue

### Desarrollo Local

```bash
# Ejecutar con perfil dev
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

### Producción

#### 1. Crear JAR ejecutable

```bash
mvn clean package -DskipTests
```

El JAR se generará en: `target/rentaherramientas-1.0.0.jar`

#### 2. Ejecutar en Producción

```bash
# Configurar variables de entorno
export SPRING_PROFILES_ACTIVE=prod
export DB_URL=jdbc:mysql://servidor:3306/marketplace_herramientas
export DB_USERNAME=usuario_prod
export DB_PASSWORD=password_seguro
export JWT_SECRET=secreto-super-seguro-minimo-64-caracteres

# Ejecutar JAR
java -jar target/rentaherramientas-1.0.0.jar
```

#### 3. Desplegar con Docker (Opcional)

```dockerfile
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
# Build imagen
docker build -t rentaherramientas:1.0.0 .

# Ejecutar contenedor
docker run -d \
  -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_URL=jdbc:mysql://host.docker.internal:3306/marketplace \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=password \
  --name rentaherramientas \
  rentaherramientas:1.0.0
```

#### 4. Desplegar en Apache Tomcat

```bash
# 1. Cambiar packaging en pom.xml a 'war'
<packaging>war</packaging>

# 2. Compilar WAR
mvn clean package -DskipTests

# 3. Copiar a Tomcat
cp target/rentaherramientas-1.0.0.war /opt/tomcat/webapps/

# 4. Iniciar Tomcat
/opt/tomcat/bin/startup.sh
```

---

## 🤝 Contribución

### Flujo de Trabajo Git

```bash
# 1. Crear rama para nueva funcionalidad
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios y commits
git add .
git commit -m "feat: descripción del cambio"

# 3. Subir rama
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request en GitHub

# 5. Después de aprobación, merge a main
git checkout main
git pull origin main
git merge feature/nueva-funcionalidad
git push origin main
```

### Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Formato (no afecta código)
- `refactor:` Refactorización
- `test:` Tests
- `chore:` Mantenimiento

**Ejemplos:**
```
feat: agregar endpoint de búsqueda de herramientas
fix: corregir validación de fechas en reservas
docs: actualizar README con instrucciones de despliegue
```

---

## 👨‍💻 Autores

- **Tu Nombre** - *Desarrollo Backend* - [GitHub](https://github.com/tu-usuario)
- **Nombre Compañero** - *Desarrollo Frontend* - [GitHub](https://github.com/compañero)

---

## 📄 Licencia

Este proyecto es un trabajo académico para [Nombre de la Universidad/Institución].

---

## 🙏 Agradecimientos

- Spring Boot Documentation
- Baeldung Tutorials
- Stack Overflow Community
- [Nombre del Instructor/Profesor]

---

## 📞 Soporte

Si tienes problemas o preguntas:

1. **Revisa la documentación** en la carpeta `docs/`
2. **Verifica los logs** en `logs/application.log`
3. **Abre un issue** en GitHub
4. **Contacta al equipo**: tu-email@example.com

---

## 🔮 Roadmap / Próximas Funcionalidades

- [ ] Sistema de chat en tiempo real (WebSockets)
- [ ] Notificaciones push
- [ ] Integración con pasarelas de pago (PSE, Mercado Pago)
- [ ] App móvil (React Native)
- [ ] Sistema de recomendaciones con IA
- [ ] Geolocalización y mapa de proveedores
- [ ] Sistema de puntos y beneficios
- [ ] Módulo de reportes avanzados con gráficos

---

## 📊 Estado del Proyecto

**Versión Actual**: 1.0.0

**Estado**: ✅ **En Desarrollo Activo**

**Última Actualización**: Febrero 2026

---

**¡Gracias por usar RentaHerramientas!** 🔨🚀