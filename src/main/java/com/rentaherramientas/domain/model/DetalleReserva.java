package com.rentaherramientas.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad de dominio: Detalle Financiero de Reserva
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetalleReserva {
    
    private String id;
    private String reservaId;
    
    // Snapshot de precios (en el momento de la reserva)
    private BigDecimal precioDiaSnapshot;
    private BigDecimal subtotalAlquiler;
    
    // ✅ CAMBIO: costo_envio_ida y costo_envio_vuelta (NO costoEnvio)
    private BigDecimal costoEnvioIda;
    private BigDecimal costoEnvioVuelta;
    
    private BigDecimal costoSeguro;
    private BigDecimal depositoSeguridad;
    
    // Cupones y descuentos
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