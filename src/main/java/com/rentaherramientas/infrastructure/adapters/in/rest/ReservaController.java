package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.request.DevolucionReservaRequest;
import com.rentaherramientas.application.dto.request.DevolucionClienteRequest;
import com.rentaherramientas.application.dto.request.ReservaRequest;
import com.rentaherramientas.application.dto.response.ApiResponse;
import com.rentaherramientas.application.dto.response.ReservaResponse;
import com.rentaherramientas.application.dto.response.VerificacionDevolucionResponse;
import com.rentaherramientas.domain.model.Reserva;
import com.rentaherramientas.domain.model.VerificacionDevolucion;
import com.rentaherramientas.domain.ports.in.PerfilProveedorUseCase;
import com.rentaherramientas.domain.ports.in.ReservaUseCase;
import com.rentaherramientas.domain.ports.in.UsuarioUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controlador REST: Reserva
 */
@RestController
@RequestMapping("/api/reservas")
@RequiredArgsConstructor
@Tag(name = "Reservas", description = "Gestión de reservas")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class ReservaController {
    
    private final ReservaUseCase reservaService;
    private final UsuarioUseCase usuarioService;
    private final PerfilProveedorUseCase perfilProveedorService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todas las reservas (Admin)")
    public ResponseEntity<ApiResponse<List<ReservaResponse>>> listarReservas() {
        try {
            System.out.println("=== LISTAR TODAS LAS RESERVAS ===");
            
            List<ReservaResponse> reservas = reservaService.listarReservas().stream()
                    .map(this::mapearReservaResponse)
                    .collect(Collectors.toList());
            
            System.out.println("✅ Total reservas: " + reservas.size());
            
            return ResponseEntity.ok(ApiResponse.success(reservas));
            
        } catch (Exception e) {
            System.err.println("❌ Error al listar reservas: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al listar reservas: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Obtener reserva por ID")
    public ResponseEntity<ApiResponse<ReservaResponse>> obtenerReserva(@PathVariable String id) {
        try {
            System.out.println("=== OBTENER RESERVA POR ID ===");
            System.out.println("ID: " + id);
            
            Reserva reserva = reservaService.obtenerReservaPorId(id)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            
            System.out.println("✅ Reserva encontrada: " + reserva.getNumeroReserva());
            
            return ResponseEntity.ok(ApiResponse.success(mapearReservaResponse(reserva)));
            
        } catch (RuntimeException e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error inesperado: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener reserva: " + e.getMessage()));
        }
    }
    
    @GetMapping("/numero/{numeroReserva}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Obtener reserva por número")
    public ResponseEntity<ApiResponse<ReservaResponse>> obtenerPorNumero(@PathVariable String numeroReserva) {
        try {
            System.out.println("=== OBTENER RESERVA POR NÚMERO ===");
            System.out.println("Número: " + numeroReserva);
            
            Reserva reserva = reservaService.obtenerReservaPorNumero(numeroReserva)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
            
            System.out.println("✅ Reserva encontrada");
            
            return ResponseEntity.ok(ApiResponse.success(mapearReservaResponse(reserva)));
            
        } catch (RuntimeException e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error inesperado: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener reserva: " + e.getMessage()));
        }
    }
    
    @GetMapping("/cliente/{clienteId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    @Operation(summary = "Listar reservas por cliente")
    public ResponseEntity<ApiResponse<List<ReservaResponse>>> listarPorCliente(@PathVariable String clienteId) {
        try {
            System.out.println("=== LISTAR RESERVAS POR CLIENTE ===");
            System.out.println("Cliente ID: " + clienteId);
            
            List<ReservaResponse> reservas = reservaService.listarReservasPorCliente(clienteId).stream()
                    .map(this::mapearReservaResponse)
                    .collect(Collectors.toList());
            
            System.out.println("✅ Reservas encontradas: " + reservas.size());
            
            return ResponseEntity.ok(ApiResponse.success(reservas));
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al listar reservas: " + e.getMessage()));
        }
    }
    
    @GetMapping("/proveedor/{proveedorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @Operation(summary = "Listar reservas por proveedor")
    public ResponseEntity<ApiResponse<List<ReservaResponse>>> listarPorProveedor(@PathVariable String proveedorId) {
        try {
            System.out.println("=== LISTAR RESERVAS POR PROVEEDOR ===");
            System.out.println("Proveedor ID: " + proveedorId);
            
            List<ReservaResponse> reservas = reservaService.listarReservasPorProveedor(proveedorId).stream()
                    .map(this::mapearReservaResponse)
                    .collect(Collectors.toList());
            
            System.out.println("✅ Reservas encontradas: " + reservas.size());
            
            return ResponseEntity.ok(ApiResponse.success(reservas));
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al listar reservas: " + e.getMessage()));
        }
    }
    
    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar reservas por estado (Admin)")
    public ResponseEntity<ApiResponse<List<ReservaResponse>>> listarPorEstado(@PathVariable String estado) {
        try {
            System.out.println("=== LISTAR RESERVAS POR ESTADO ===");
            System.out.println("Estado: " + estado);
            
            List<ReservaResponse> reservas = reservaService.listarReservasPorEstado(estado).stream()
                    .map(this::mapearReservaResponse)
                    .collect(Collectors.toList());
            
            System.out.println("✅ Reservas encontradas: " + reservas.size());
            
            return ResponseEntity.ok(ApiResponse.success(reservas));
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al listar reservas: " + e.getMessage()));
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    @Operation(summary = "Crear reserva (Cliente)")
    public ResponseEntity<ApiResponse<ReservaResponse>> crearReserva(@Valid @RequestBody ReservaRequest request) {
        try {
            System.out.println("=== CREAR RESERVA ===");
            System.out.println("Cliente ID: " + request.getClienteId());
            System.out.println("Herramienta ID: " + request.getHerramientaId());
            
            Reserva reserva = mapearReservaDomain(request);
            Reserva creada = reservaService.crearReserva(reserva);
            
            System.out.println("✅ Reserva creada: " + creada.getNumeroReserva());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Reserva creada exitosamente", mapearReservaResponse(creada)));
                    
        } catch (Exception e) {
            System.err.println("❌ Error al crear reserva: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear reserva: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Actualizar reserva")
    public ResponseEntity<ApiResponse<ReservaResponse>> actualizarReserva(
            @PathVariable String id,
            @RequestBody Reserva reserva) {
        
        try {
            System.out.println("=== ACTUALIZAR RESERVA ===");
            System.out.println("ID: " + id);
            
            Reserva actualizada = reservaService.actualizarReserva(id, reserva);
            
            System.out.println("✅ Reserva actualizada");
            
            return ResponseEntity.ok(ApiResponse.success("Reserva actualizada", mapearReservaResponse(actualizada)));
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar reserva: " + e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR', 'CLIENTE')")  // ✅ AGREGADO 'CLIENTE'
    @Operation(summary = "Cambiar estado de reserva (Admin, Proveedor, Cliente)")
    public ResponseEntity<ApiResponse<ReservaResponse>> cambiarEstado(
            @PathVariable String id,
            @RequestParam String nuevoEstado) {
        
        try {
            System.out.println("=== CAMBIAR ESTADO DE RESERVA ===");
            System.out.println("Reserva ID: " + id);
            System.out.println("Nuevo estado: " + nuevoEstado);
            
            Reserva actualizada = reservaService.cambiarEstado(id, nuevoEstado);
            
            System.out.println("✅ Estado actualizado a: " + actualizada.getEstado());
            
            return ResponseEntity.ok(ApiResponse.success("Estado actualizado", mapearReservaResponse(actualizada)));
            
        } catch (Exception e) {
            System.err.println("❌ Error al cambiar estado: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al cambiar estado: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    @Operation(summary = "Cancelar reserva")
    public ResponseEntity<ApiResponse<ReservaResponse>> cancelarReserva(
            @PathVariable String id,
            @RequestParam String motivo,
            @RequestParam String canceladoPor) {
        
        try {
            System.out.println("=== CANCELAR RESERVA ===");
            System.out.println("ID: " + id);
            System.out.println("Motivo: " + motivo);
            
            Reserva cancelada = reservaService.cancelarReserva(id, motivo, canceladoPor);
            
            System.out.println("✅ Reserva cancelada");
            
            return ResponseEntity.ok(ApiResponse.success("Reserva cancelada", mapearReservaResponse(cancelada)));
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al cancelar reserva: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/devolucion")
    @PreAuthorize("hasRole('PROVEEDOR')")
    @Operation(summary = "Completar devolucion de reserva (Proveedor) con reporte opcional de danos")
    public ResponseEntity<ApiResponse<ReservaResponse>> completarDevolucion(
            @PathVariable String id,
            @RequestBody(required = false) @Valid DevolucionReservaRequest request,
            Authentication authentication) {

        try {
            DevolucionReservaRequest body = request != null ? request : DevolucionReservaRequest.builder().build();
            String email = authentication.getName();

            var usuario = usuarioService.obtenerUsuarioPorEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));

            var perfilProveedor = perfilProveedorService.obtenerPerfilProveedorPorUsuarioId(usuario.getId())
                    .orElseThrow(() -> new RuntimeException("Perfil de proveedor no encontrado"));

            Reserva actualizada = reservaService.completarDevolucion(
                    id,
                    perfilProveedor.getId(),
                    body.getReportarDanos(),
                    body.getEstadoHerramienta(),
                    body.getDescripcion(),
                    body.getFotos(),
                    body.getCostoReparacionEstimado()
            );

            return ResponseEntity.ok(ApiResponse.success("Devolucion completada exitosamente", mapearReservaResponse(actualizada)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Error al completar devolucion: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno al completar devolucion: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/devolucion-cliente")
    @PreAuthorize("hasRole('CLIENTE')")
    @Operation(summary = "Solicitar devolucion o cancelacion al proveedor (Cliente), con reporte opcional de danos")
    public ResponseEntity<ApiResponse<ReservaResponse>> solicitarDevolucionCliente(
            @PathVariable String id,
            @RequestBody(required = false) @Valid DevolucionClienteRequest request,
            Authentication authentication) {
        try {
            DevolucionClienteRequest body = request != null ? request : DevolucionClienteRequest.builder().build();
            String email = authentication.getName();

            var usuario = usuarioService.obtenerUsuarioPorEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));

            Reserva actualizada = reservaService.solicitarDevolucionCliente(
                    id,
                    usuario.getId(),
                    body.getCancelarAlProveedor(),
                    body.getMotivo(),
                    body.getReportarDanos(),
                    body.getEstadoHerramienta(),
                    body.getDescripcion(),
                    body.getFotos(),
                    body.getCostoReparacionEstimado()
            );

            return ResponseEntity.ok(ApiResponse.success("Solicitud procesada exitosamente", mapearReservaResponse(actualizada)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Error en solicitud de devolucion: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno en solicitud de devolucion: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/devolucion-reporte")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR', 'CLIENTE')")
    @Operation(summary = "Obtener reporte de devolucion/danos de una reserva")
    public ResponseEntity<ApiResponse<VerificacionDevolucionResponse>> obtenerReporteDevolucion(
            @PathVariable String id,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            var usuario = usuarioService.obtenerUsuarioPorEmail(email)
                    .orElseThrow(() -> new RuntimeException("Usuario autenticado no encontrado"));

            Reserva reserva = reservaService.obtenerReservaPorId(id)
                    .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

            boolean isAdmin = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
            boolean isProveedor = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_PROVEEDOR"));
            boolean isCliente = authentication.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_CLIENTE"));

            if (!isAdmin) {
                if (isProveedor) {
                    var perfilProveedor = perfilProveedorService.obtenerPerfilProveedorPorUsuarioId(usuario.getId())
                            .orElseThrow(() -> new RuntimeException("Perfil de proveedor no encontrado"));
                    if (!perfilProveedor.getId().equals(reserva.getProveedorId())) {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                                .body(ApiResponse.error("No tienes permisos para ver este reporte"));
                    }
                } else if (isCliente && !usuario.getId().equals(reserva.getClienteId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                            .body(ApiResponse.error("No tienes permisos para ver este reporte"));
                }
            }

            VerificacionDevolucion verificacion = reservaService.obtenerVerificacionDevolucion(id)
                    .orElseThrow(() -> new RuntimeException("No existe reporte de devolucion para esta reserva"));

            return ResponseEntity.ok(ApiResponse.success(mapearVerificacionResponse(verificacion)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Error al obtener reporte: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error interno al obtener reporte: " + e.getMessage()));
        }
    }
    
    @GetMapping("/disponibilidad")
    @Operation(summary = "Verificar disponibilidad de herramienta (público)")
    public ResponseEntity<ApiResponse<Boolean>> verificarDisponibilidad(
            @RequestParam String herramientaId,
            @RequestParam String fechaInicio,
            @RequestParam String fechaFin) {
        
        try {
            System.out.println("=== VERIFICAR DISPONIBILIDAD (GET) ===");
            System.out.println("Herramienta: " + herramientaId);
            System.out.println("Desde: " + fechaInicio + " hasta: " + fechaFin);
            
            LocalDate inicio = LocalDate.parse(fechaInicio);
            LocalDate fin = LocalDate.parse(fechaFin);
            
            boolean disponible = reservaService.verificarDisponibilidad(herramientaId, inicio, fin);
            
            System.out.println(disponible ? "✅ Disponible" : "❌ No disponible");
            
            return ResponseEntity.ok(ApiResponse.success(disponible));
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al verificar disponibilidad: " + e.getMessage()));
        }
    }
    
    @PostMapping("/verificar-disponibilidad")
    @Operation(summary = "Verificar disponibilidad de herramienta - POST (público)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verificarDisponibilidadPost(
            @RequestBody Map<String, String> request) {
        
        try {
            System.out.println("=== VERIFICAR DISPONIBILIDAD (POST) ===");
            
            String herramientaId = request.get("herramientaId");
            String fechaInicio = request.get("fechaInicio");
            String fechaFin = request.get("fechaFin");
            
            System.out.println("Herramienta: " + herramientaId);
            System.out.println("Desde: " + fechaInicio + " hasta: " + fechaFin);
            
            LocalDate inicio = LocalDate.parse(fechaInicio);
            LocalDate fin = LocalDate.parse(fechaFin);
            
            boolean disponible = reservaService.verificarDisponibilidad(herramientaId, inicio, fin);
            
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("disponible", disponible);
            resultado.put("mensaje", disponible ? 
                "Herramienta disponible en estas fechas" : 
                "La herramienta ya está reservada en este período");
            
            System.out.println(disponible ? "✅ Disponible" : "❌ No disponible");
            
            return ResponseEntity.ok(ApiResponse.success(resultado));
            
        } catch (Exception e) {
            System.err.println("❌ Error: " + e.getMessage());
            
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("disponible", false);
            resultado.put("mensaje", "Error al verificar disponibilidad: " + e.getMessage());
            
            return ResponseEntity.ok(ApiResponse.success(resultado));
        }
    }
    
    // ========== MÉTODOS DE MAPEO ==========
    
    private Reserva mapearReservaDomain(ReservaRequest request) {
        return Reserva.builder()
                .clienteId(request.getClienteId())
                .herramientaId(request.getHerramientaId())
                .direccionEnvioId(request.getDireccionEnvioId())
                .fechaInicio(request.getFechaInicio())
                .fechaFin(request.getFechaFin())
                .notasCliente(request.getNotasCliente())
                .build();
    }
    
    private ReservaResponse mapearReservaResponse(Reserva reserva) {
        return ReservaResponse.builder()
                .id(reserva.getId())
                .numeroReserva(reserva.getNumeroReserva())
                .clienteId(reserva.getClienteId())
                .proveedorId(reserva.getProveedorId())
                .herramientaId(reserva.getHerramientaId())
                .instanciaId(reserva.getInstanciaId())
                .direccionEnvioId(reserva.getDireccionEnvioId())
                .fechaInicio(reserva.getFechaInicio())
                .fechaFin(reserva.getFechaFin())
                .diasTotales(reserva.getDiasTotales())
                .estado(reserva.getEstado().name())
                .fechaPago(reserva.getFechaPago())
                .fechaConfirmacion(reserva.getFechaConfirmacion())
                .fechaEnvio(reserva.getFechaEnvio())
                .fechaEntrega(reserva.getFechaEntrega())
                .fechaDevolucionProgramada(reserva.getFechaDevolucionProgramada())
                .fechaDevolucionReal(reserva.getFechaDevolucionReal())
                .fechaCompletada(reserva.getFechaCompletada())
                .fechaCancelacion(reserva.getFechaCancelacion())
                .motivoCancelacion(reserva.getMotivoCancelacion())
                .canceladoPor(reserva.getCanceladoPor())
                .trackingEnvioIda(reserva.getTrackingEnvioIda())
                .trackingEnvioVuelta(reserva.getTrackingEnvioVuelta())
                .notasCliente(reserva.getNotasCliente())
                .notasProveedor(reserva.getNotasProveedor())
                .createdAt(reserva.getCreatedAt())
                .updatedAt(reserva.getUpdatedAt())
                .build();
    }

    private VerificacionDevolucionResponse mapearVerificacionResponse(VerificacionDevolucion verificacion) {
        return VerificacionDevolucionResponse.builder()
                .id(verificacion.getId())
                .reservaId(verificacion.getReservaId())
                .tipo(verificacion.getTipo())
                .estadoHerramienta(verificacion.getEstadoHerramienta())
                .descripcion(verificacion.getDescripcion())
                .fotos(verificacion.getFotos())
                .costoReparacionEstimado(verificacion.getCostoReparacionEstimado())
                .fechaVerificacion(verificacion.getFechaVerificacion())
                .build();
    }
}
