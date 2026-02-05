package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.response.ApiResponse;
import com.rentaherramientas.domain.model.Factura;
import com.rentaherramientas.domain.ports.in.FacturaUseCase;
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
 * Controlador REST: Factura
 */
@RestController
@RequestMapping("/api/facturas")
@RequiredArgsConstructor
@Tag(name = "Facturas", description = "Gestión de facturas")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class FacturaController {
    
    private final FacturaUseCase facturaService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todas las facturas (Admin)")
    public ResponseEntity<ApiResponse<List<Factura>>> listarFacturas() {
        List<Factura> facturas = facturaService.listarFacturas();
        return ResponseEntity.ok(ApiResponse.success(facturas));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Obtener factura por ID")
    public ResponseEntity<ApiResponse<Factura>> obtenerFactura(@PathVariable String id) {
        Factura factura = facturaService.obtenerFacturaPorId(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));
        
        return ResponseEntity.ok(ApiResponse.success(factura));
    }
    
    @GetMapping("/numero/{numeroFactura}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Obtener factura por número")
    public ResponseEntity<ApiResponse<Factura>> obtenerPorNumero(@PathVariable String numeroFactura) {
        Factura factura = facturaService.obtenerFacturaPorNumero(numeroFactura)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));
        
        return ResponseEntity.ok(ApiResponse.success(factura));
    }
    
    @GetMapping("/reserva/{reservaId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Obtener factura por reserva")
    public ResponseEntity<ApiResponse<Factura>> obtenerPorReserva(@PathVariable String reservaId) {
        Factura factura = facturaService.obtenerFacturaPorReserva(reservaId)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));
        
        return ResponseEntity.ok(ApiResponse.success(factura));
    }
    
    @GetMapping("/cliente/{clienteId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE')")
    @Operation(summary = "Listar facturas por cliente")
    public ResponseEntity<ApiResponse<List<Factura>>> listarPorCliente(@PathVariable String clienteId) {
        List<Factura> facturas = facturaService.listarFacturasPorCliente(clienteId);
        return ResponseEntity.ok(ApiResponse.success(facturas));
    }
    
    @GetMapping("/proveedor/{proveedorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @Operation(summary = "Listar facturas por proveedor")
    public ResponseEntity<ApiResponse<List<Factura>>> listarPorProveedor(@PathVariable String proveedorId) {
        List<Factura> facturas = facturaService.listarFacturasPorProveedor(proveedorId);
        return ResponseEntity.ok(ApiResponse.success(facturas));
    }
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @Operation(summary = "Crear factura")
    public ResponseEntity<ApiResponse<Factura>> crearFactura(@RequestBody Factura factura) {
        Factura creada = facturaService.crearFactura(factura);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Factura creada", creada));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @Operation(summary = "Actualizar factura")
    public ResponseEntity<ApiResponse<Factura>> actualizarFactura(
            @PathVariable String id,
            @RequestBody Factura factura) {
        
        Factura actualizada = facturaService.actualizarFactura(id, factura);
        return ResponseEntity.ok(ApiResponse.success("Factura actualizada", actualizada));
    }
    
    @PostMapping("/{id}/marcar-pagada")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Marcar factura como pagada (Admin)")
    public ResponseEntity<ApiResponse<Factura>> marcarComoPagada(@PathVariable String id) {
        Factura pagada = facturaService.marcarComoPagada(id);
        return ResponseEntity.ok(ApiResponse.success("Factura marcada como pagada", pagada));
    }
    
    @PostMapping("/{id}/anular")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Anular factura (Admin)")
    public ResponseEntity<ApiResponse<Factura>> anularFactura(
            @PathVariable String id,
            @RequestParam String motivo) {
        
        Factura anulada = facturaService.anularFactura(id, motivo);
        return ResponseEntity.ok(ApiResponse.success("Factura anulada", anulada));
    }
}