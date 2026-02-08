package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.response.ApiResponse;
import com.rentaherramientas.application.dto.response.DetalleReservaResponse;
import com.rentaherramientas.domain.model.DetalleReserva;
import com.rentaherramientas.domain.ports.in.DetalleReservaUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST: Detalle de Reserva
 */
@RestController
@RequestMapping("/api/detalle-reserva")
@RequiredArgsConstructor
@Tag(name = "Detalle de Reserva", description = "Información financiera detallada de las reservas")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class DetalleReservaController {
    
    private final DetalleReservaUseCase detalleReservaService;
    
    @GetMapping("/reserva/{reservaId}")
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROVEEDOR', 'ADMIN')")
    @Operation(summary = "Obtener detalle financiero por ID de reserva")
    public ResponseEntity<ApiResponse<DetalleReservaResponse>> obtenerDetallePorReservaId(
            @PathVariable String reservaId) {
        
        try {
            System.out.println("=== OBTENER DETALLE DE RESERVA ===");
            System.out.println("Reserva ID: " + reservaId);
            
            DetalleReserva detalle = detalleReservaService.obtenerDetallePorReservaId(reservaId)
                    .orElseThrow(() -> new RuntimeException("No se encontró detalle para la reserva ID: " + reservaId));
            
            System.out.println("✅ Detalle encontrado: " + detalle.getId());
            
            return ResponseEntity.ok(ApiResponse.success(mapearDomainAResponse(detalle)));
            
        } catch (RuntimeException e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error inesperado: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener detalle: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROVEEDOR', 'ADMIN')")
    @Operation(summary = "Obtener detalle por ID")
    public ResponseEntity<ApiResponse<DetalleReservaResponse>> obtenerDetallePorId(
            @PathVariable String id) {
        
        try {
            System.out.println("=== OBTENER DETALLE POR ID ===");
            System.out.println("Detalle ID: " + id);
            
            DetalleReserva detalle = detalleReservaService.obtenerDetallePorId(id)
                    .orElseThrow(() -> new RuntimeException("Detalle no encontrado con ID: " + id));
            
            System.out.println("✅ Detalle encontrado");
            
            return ResponseEntity.ok(ApiResponse.success(mapearDomainAResponse(detalle)));
            
        } catch (RuntimeException e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error inesperado: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener detalle: " + e.getMessage()));
        }
    }
    
    // ========== MÉTODO DE MAPEO ==========
    
    private DetalleReservaResponse mapearDomainAResponse(DetalleReserva domain) {
        return DetalleReservaResponse.builder()
                .id(domain.getId())
                .reservaId(domain.getReservaId())
                .precioDiaSnapshot(domain.getPrecioDiaSnapshot())
                .subtotalAlquiler(domain.getSubtotalAlquiler())
                .costoSeguro(domain.getCostoSeguro())
                .costoEnvioIda(domain.getCostoEnvioIda())           // ✅ CAMBIO
                .costoEnvioVuelta(domain.getCostoEnvioVuelta())     // ✅ CAMBIO
                .depositoSeguridad(domain.getDepositoSeguridad())
                .cuponId(domain.getCuponId())                        // ✅ AGREGADO
                .codigoCupon(domain.getCodigoCupon())
                .descuento(domain.getDescuento())
                .totalPagado(domain.getTotalPagado())
                .comisionAdmin(domain.getComisionAdmin())
                .porcentajeComision(domain.getPorcentajeComision())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}