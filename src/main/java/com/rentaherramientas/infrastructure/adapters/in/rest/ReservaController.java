package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.request.ReservaRequest;
import com.rentaherramientas.application.dto.response.ApiResponse;
import com.rentaherramientas.application.dto.response.ReservaResponse;
import com.rentaherramientas.domain.model.Reserva;
import com.rentaherramientas.domain.ports.in.ReservaUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todas las reservas (Admin)")
    public ResponseEntity<ApiResponse<List<ReservaResponse>>> listarReservas() {
        List<ReservaResponse> reservas = reservaService.listarReservas().stream()
                .map(this::mapearReservaResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(reservas));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Obtener reserva por ID")
    public ResponseEntity<ApiResponse<ReservaResponse>> obtenerReserva(@PathVariable String id) {
        Reserva reserva = reservaService.obtenerReservaPorId(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        
        return ResponseEntity.ok(ApiResponse.success(mapearReservaResponse(reserva)));
    }
    
    @GetMapping("/numero/{numeroReserva}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Obtener reserva por número")
    public ResponseEntity<ApiResponse<ReservaResponse>> obtenerPorNumero(@PathVariable String numeroReserva) {
        Reserva reserva = reservaService.obtenerReservaPorNumero(numeroReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
        
        return ResponseEntity.ok(ApiResponse.success(mapearReservaResponse(reserva)));
    }
    
    @GetMapping("/cliente/{clienteId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    @Operation(summary = "Listar reservas por cliente")
    public ResponseEntity<ApiResponse<List<ReservaResponse>>> listarPorCliente(@PathVariable String clienteId) {
        List<ReservaResponse> reservas = reservaService.listarReservasPorCliente(clienteId).stream()
                .map(this::mapearReservaResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(reservas));
    }
    
    @GetMapping("/proveedor/{proveedorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @Operation(summary = "Listar reservas por proveedor")
    public ResponseEntity<ApiResponse<List<ReservaResponse>>> listarPorProveedor(@PathVariable String proveedorId) {
        List<ReservaResponse> reservas = reservaService.listarReservasPorProveedor(proveedorId).stream()
                .map(this::mapearReservaResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(reservas));
    }
    
    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar reservas por estado (Admin)")
    public ResponseEntity<ApiResponse<List<ReservaResponse>>> listarPorEstado(@PathVariable String estado) {
        List<ReservaResponse> reservas = reservaService.listarReservasPorEstado(estado).stream()
                .map(this::mapearReservaResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(reservas));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    @Operation(summary = "Crear reserva (Cliente)")
    public ResponseEntity<ApiResponse<ReservaResponse>> crearReserva(@Valid @RequestBody ReservaRequest request) {
        Reserva reserva = mapearReservaDomain(request);
        Reserva creada = reservaService.crearReserva(reserva);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Reserva creada exitosamente", mapearReservaResponse(creada)));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Actualizar reserva")
    public ResponseEntity<ApiResponse<ReservaResponse>> actualizarReserva(
            @PathVariable String id,
            @RequestBody Reserva reserva) {
        
        Reserva actualizada = reservaService.actualizarReserva(id, reserva);
        return ResponseEntity.ok(ApiResponse.success("Reserva actualizada", mapearReservaResponse(actualizada)));
    }
    
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @Operation(summary = "Cambiar estado de reserva")
    public ResponseEntity<ApiResponse<ReservaResponse>> cambiarEstado(
            @PathVariable String id,
            @RequestParam String nuevoEstado) {
        
        Reserva actualizada = reservaService.cambiarEstado(id, nuevoEstado);
        return ResponseEntity.ok(ApiResponse.success("Estado actualizado", mapearReservaResponse(actualizada)));
    }
    
    @PostMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    @Operation(summary = "Cancelar reserva")
    public ResponseEntity<ApiResponse<ReservaResponse>> cancelarReserva(
            @PathVariable String id,
            @RequestParam String motivo,
            @RequestParam String canceladoPor) {
        
        Reserva cancelada = reservaService.cancelarReserva(id, motivo, canceladoPor);
        return ResponseEntity.ok(ApiResponse.success("Reserva cancelada", mapearReservaResponse(cancelada)));
    }
    
    @GetMapping("/disponibilidad")
    @Operation(summary = "Verificar disponibilidad de herramienta (público)")
    public ResponseEntity<ApiResponse<Boolean>> verificarDisponibilidad(
            @RequestParam String herramientaId,
            @RequestParam String fechaInicio,
            @RequestParam String fechaFin) {
        
        LocalDate inicio = LocalDate.parse(fechaInicio);
        LocalDate fin = LocalDate.parse(fechaFin);
        
        boolean disponible = reservaService.verificarDisponibilidad(herramientaId, inicio, fin);
        
        return ResponseEntity.ok(ApiResponse.success(disponible));
    }
    
    // ========== NUEVO ENDPOINT AGREGADO ==========
    @PostMapping("/verificar-disponibilidad")
    @Operation(summary = "Verificar disponibilidad de herramienta - POST (público)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verificarDisponibilidadPost(
            @RequestBody Map<String, String> request) {
        
        try {
            String herramientaId = request.get("herramientaId");
            String fechaInicio = request.get("fechaInicio");
            String fechaFin = request.get("fechaFin");
            
            LocalDate inicio = LocalDate.parse(fechaInicio);
            LocalDate fin = LocalDate.parse(fechaFin);
            
            boolean disponible = reservaService.verificarDisponibilidad(herramientaId, inicio, fin);
            
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("disponible", disponible);
            resultado.put("mensaje", disponible ? 
                "Herramienta disponible en estas fechas" : 
                "La herramienta ya está reservada en este período");
            
            return ResponseEntity.ok(ApiResponse.success(resultado));
            
        } catch (Exception e) {
            Map<String, Object> resultado = new HashMap<>();
            resultado.put("disponible", false);
            resultado.put("mensaje", "Error al verificar disponibilidad: " + e.getMessage());
            
            return ResponseEntity.ok(ApiResponse.success(resultado));
        }
    }
    
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
}