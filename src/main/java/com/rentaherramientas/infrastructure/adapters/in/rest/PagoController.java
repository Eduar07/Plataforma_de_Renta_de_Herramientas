package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.response.ApiResponse;
import com.rentaherramientas.domain.model.Pago;
import com.rentaherramientas.domain.ports.in.PagoUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST: Pago
 */
@RestController
@RequestMapping("/api/pagos")
@RequiredArgsConstructor
@Tag(name = "Pagos", description = "Gestión de pagos")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class PagoController {
    
    private final PagoUseCase pagoService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todos los pagos (Admin)")
    public ResponseEntity<ApiResponse<List<Pago>>> listarPagos() {
        List<Pago> pagos = pagoService.listarPagos();
        return ResponseEntity.ok(ApiResponse.success(pagos));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    @Operation(summary = "Obtener pago por ID")
    public ResponseEntity<ApiResponse<Pago>> obtenerPago(@PathVariable String id) {
        Pago pago = pagoService.obtenerPagoPorId(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        
        return ResponseEntity.ok(ApiResponse.success(pago));
    }
    
    @GetMapping("/transaccion/{numeroTransaccion}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    @Operation(summary = "Obtener pago por número de transacción")
    public ResponseEntity<ApiResponse<Pago>> obtenerPorTransaccion(@PathVariable String numeroTransaccion) {
        Pago pago = pagoService.obtenerPagoPorNumeroTransaccion(numeroTransaccion)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        
        return ResponseEntity.ok(ApiResponse.success(pago));
    }
    
    @GetMapping("/cliente/{clienteId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    @Operation(summary = "Listar pagos por cliente")
    public ResponseEntity<ApiResponse<List<Pago>>> listarPorCliente(@PathVariable String clienteId) {
        List<Pago> pagos = pagoService.listarPagosPorCliente(clienteId);
        return ResponseEntity.ok(ApiResponse.success(pagos));
    }
    
    @GetMapping("/reserva/{reservaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Listar pagos por reserva")
    public ResponseEntity<ApiResponse<List<Pago>>> listarPorReserva(@PathVariable String reservaId) {
        List<Pago> pagos = pagoService.listarPagosPorReserva(reservaId);
        return ResponseEntity.ok(ApiResponse.success(pagos));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    @Operation(summary = "Crear pago (Cliente)")
    public ResponseEntity<ApiResponse<Pago>> crearPago(@RequestBody Pago pago) {
        Pago creado = pagoService.crearPago(pago);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Pago creado", creado));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Actualizar pago (Admin)")
    public ResponseEntity<ApiResponse<Pago>> actualizarPago(
            @PathVariable String id,
            @RequestBody Pago pago) {
        
        Pago actualizado = pagoService.actualizarPago(id, pago);
        return ResponseEntity.ok(ApiResponse.success("Pago actualizado", actualizado));
    }
    
    @PostMapping("/{id}/procesar")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    @Operation(summary = "Procesar pago")
    public ResponseEntity<ApiResponse<Pago>> procesarPago(@PathVariable String id) {
        Pago procesado = pagoService.procesarPago(id);
        return ResponseEntity.ok(ApiResponse.success("Pago en proceso", procesado));
    }
    
    @PostMapping("/{id}/confirmar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Confirmar pago (Admin)")
    public ResponseEntity<ApiResponse<Pago>> confirmarPago(
            @PathVariable String id,
            @RequestParam String gatewayTransactionId) {
        
        Pago confirmado = pagoService.confirmarPago(id, gatewayTransactionId);
        return ResponseEntity.ok(ApiResponse.success("Pago confirmado", confirmado));
    }
    
    @PostMapping("/{id}/rechazar")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Rechazar pago (Admin)")
    public ResponseEntity<ApiResponse<Pago>> rechazarPago(
            @PathVariable String id,
            @RequestParam String motivo) {
        
        Pago rechazado = pagoService.rechazarPago(id, motivo);
        return ResponseEntity.ok(ApiResponse.success("Pago rechazado", rechazado));
    }
}