package com.rentaherramientas.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO Response: Detalle Financiero de Reserva
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetalleReservaResponse {
    
    private String id;
    private String reservaId;
    
    // Snapshot de precios
    private BigDecimal precioDiaSnapshot;
    private BigDecimal subtotalAlquiler;
    
    // ✅ CAMBIO
    private BigDecimal costoEnvioIda;
    private BigDecimal costoEnvioVuelta;
    
    private BigDecimal costoSeguro;
    private BigDecimal depositoSeguridad;
    
    // Cupones
    private String cuponId;
    private String codigoCupon;
    private BigDecimal descuento;
    
    private BigDecimal totalPagado;
    
    // Comisiones
    private BigDecimal comisionAdmin;
    private BigDecimal porcentajeComision;
    
    // Fechas
    private LocalDateTime createdAt;
}