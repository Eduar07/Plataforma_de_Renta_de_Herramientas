# Arquitectura Hexagonal - Renta de Herramientas

## 🏗️ Patrón: Hexagonal Architecture (Ports & Adapters)

### Descripción General
Este proyecto implementa una arquitectura hexagonal completa, también conocida como Ports & Adapters, que permite mantener el dominio del negocio completamente desacoplado de los detalles de implementación tecnológica.

## 📊 Diagrama de Arquitectura

┌─────────────────────────────────────────────────────────────┐
│                     INFRASTRUCTURE LAYER                     │
│  ┌────────────┐                            ┌──────────────┐ │
│  │  REST API  │                            │ PERSISTENCE  │ │
│  │ Controllers│                            │  JPA/MySQL   │ │
│  └─────┬──────┘                            └───────┬──────┘ │
│        │                                           │        │
│        │ Adapters In                    Adapters Out│        │
└────────┼───────────────────────────────────────────┼────────┘
         │                                           │
         │                                           │
┌────────┼───────────────────────────────────────────┼────────┐
│        ▼              APPLICATION LAYER            ▼        │
│  ┌──────────┐                              ┌──────────────┐ │
│  │ Use Case │◄──────────DTOs──────────────►│ Use Case     │ │
│  │ Services │                              │ Services     │ │
│  └────┬─────┘                              └───────┬──────┘ │
│       │                                            │        │
└───────┼────────────────────────────────────────────┼────────┘
        │                                            │
        │ Implements                      Implements │
┌───────┼────────────────────────────────────────────┼────────┐
│       ▼              DOMAIN LAYER                  ▼        │
│  ┌─────────┐                              ┌──────────────┐ │
│  │  Ports  │                              │  Ports       │ │
│  │   IN    │                              │   OUT        │ │
│  └─────────┘                              └──────────────┘ │
│       │                                            │        │
│       │          ┌───────────────┐                 │        │
│       └─────────►│  DOMAIN MODEL │◄────────────────┘        │
│                  │   (Entities)  │                          │
│                  └───────────────┘                          │
│                  ┌───────────────┐                          │
│                  │  EXCEPTIONS   │                          │
│                  └───────────────┘                          │
└─────────────────────────────────────────────────────────────┘


## 🎯 Capas de la Arquitectura

### 1️⃣ DOMAIN LAYER (Capa de Dominio)
*Ubicación:* com.rentaherramientas.domain

El corazón del sistema. Contiene:

- *Model:* Entidades de dominio puras (POJOs)
  - Usuario, Herramienta, Reserva, Pago, Factura
  - Sin anotaciones de JPA
  - Solo lógica de negocio

- *Ports IN:* Interfaces que definen casos de uso
  - UsuarioUseCase
  - HerramientaUseCase
  - ReservaUseCase
  - PagoUseCase
  - FacturaUseCase

- *Ports OUT:* Interfaces que definen contratos de persistencia
  - UsuarioRepositoryPort
  - HerramientaRepositoryPort
  - etc.

- *Exceptions:* Excepciones específicas del dominio
  - DomainException
  - ResourceNotFoundException
  - BusinessException
  - ValidationException

*Reglas:*
- ❌ NO depender de frameworks externos
- ❌ NO tener anotaciones de Spring o JPA
- ✅ SÍ contener toda la lógica de negocio
- ✅ SÍ definir las reglas del dominio

### 2️⃣ APPLICATION LAYER (Capa de Aplicación)
*Ubicación:* com.rentaherramientas.application

Orquesta los casos de uso. Contiene:

- *Services:* Implementación de los Use Cases (Ports IN)
  - UsuarioService implements UsuarioUseCase
  - HerramientaService implements HerramientaUseCase
  - Coordinan la lógica de negocio
  - Usan Ports OUT para persistencia

- *DTOs:* Objetos de transferencia de datos
  - Request DTOs (entrada de datos)
  - Response DTOs (salida de datos)
  - Validaciones con Jakarta Validation

*Reglas:*
- ✅ SÍ implementar Ports IN
- ✅ SÍ usar Ports OUT
- ✅ SÍ contener lógica de orquestación
- ❌ NO contener lógica de infraestructura

### 3️⃣ INFRASTRUCTURE LAYER (Capa de Infraestructura)
*Ubicación:* com.rentaherramientas.infrastructure

Implementa los detalles técnicos. Contiene:

*Adapters IN (Entrada):*
- *REST Controllers:* Exponen la API HTTP
  - UsuarioController
  - HerramientaController
  - Reciben requests HTTP
  - Llaman a Use Cases
  - Retornan responses HTTP

*Adapters OUT (Salida):*
- *Persistence:*
  - *Entity:* Entidades JPA con anotaciones
  - *Repository:* Interfaces Spring Data JPA
  - *Mapper:* Conversión Domain ↔ Entity
  - *Adapter:* Implementan Ports OUT

*Config:*
- SecurityConfig
- SwaggerConfig
- CorsConfig
- BeanConfiguration

*Security:*
- JwtTokenProvider
- JwtAuthenticationFilter
- UserDetailsServiceImpl

*Reglas:*
- ✅ SÍ implementar Ports OUT
- ✅ SÍ usar frameworks (Spring, JPA)
- ✅ SÍ contener detalles técnicos
- ❌ NO contener lógica de negocio

### 4️⃣ SHARED LAYER (Capa Compartida)
*Ubicación:* com.rentaherramientas.shared

Utilidades transversales:
- Constants
- Utils
- GlobalExceptionHandler

## 🔄 Flujo de Datos

### Ejemplo: Crear una Herramienta

1. *Request HTTP* llega al Controller

   POST /api/herramientas


2. *Controller* (Adapter IN) recibe HerramientaRequest
java
   @PostMapping
   public ResponseEntity<ApiResponse<HerramientaResponse>> crear(@RequestBody HerramientaRequest request)


3. *Controller* convierte DTO → Domain y llama al Use Case
java
   Herramienta herramienta = toEntity(request);
   Herramienta creada = herramientaUseCase.crearHerramienta(herramienta);


4. *Service* (Application) implementa la lógica de negocio
java
   @Service
   public class HerramientaService implements HerramientaUseCase {
       // Valida, procesa y llama al Port OUT
   }


5. *Repository Adapter* (Adapter OUT) persiste los datos
java
   @Component
   public class HerramientaRepositoryAdapter implements HerramientaRepositoryPort {
       // Usa JpaRepository para persistir
   }


6. *Mapper* convierte Domain → Entity JPA
java
   public HerramientaEntity toEntity(Herramienta domain)


7. *JPA Repository* guarda en MySQL

8. *Response* regresa por el mismo camino

   Entity → Domain → DTO → HTTP Response


## ✅ Ventajas de esta Arquitectura

1. *Independencia del Framework*
   - El dominio no conoce Spring, JPA, ni MySQL
   - Fácil cambiar de framework

2. *Testabilidad*
   - Dominio puede testearse sin infraestructura
   - Ports facilitan el uso de mocks

3. *Mantenibilidad*
   - Código organizado por responsabilidades
   - Fácil localizar y modificar

4. *Escalabilidad*
   - Nuevos adapters sin tocar el dominio
   - Nuevos use cases sin tocar infraestructura

5. *Flexibilidad*
   - Cambiar DB sin tocar dominio
   - Cambiar API sin tocar lógica de negocio

## 📦 Dependencias entre Capas

Infrastructure → Application → Domain
     ↑              ↑             ↑
     │              │             │
  Depende de    Depende de    Independiente


*Regla de Dependencia:*
- Las capas externas dependen de las internas
- Las capas internas NO conocen las externas
- Domain es completamente independiente

## 🎓 Principios SOLID Aplicados

- *S*ingle Responsibility: Cada capa tiene una responsabilidad
- *O*pen/Closed: Abierto a extensión, cerrado a modificación
- *L*iskov Substitution: Los adapters son intercambiables
- *I*nterface Segregation: Ports pequeños y específicos
- *D*ependency Inversion: Dependemos de abstracciones (Ports)

---

*Desarrollado con ❤️ siguiendo Clean Architecture y Hexagonal Architecture*