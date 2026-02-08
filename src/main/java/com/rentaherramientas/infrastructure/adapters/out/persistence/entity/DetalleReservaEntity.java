package com.rentaherramientas.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad JPA: Detalle Financiero de Reserva
 */
@Entity
@Table(name = "detalle_reserva")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DetalleReservaEntity {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    private String id;
    
    @Column(name = "reserva_id", nullable = false, unique = true, length = 36)
    private String reservaId;
    
    // Snapshot de precios
    @Column(name = "precio_dia_snapshot", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioDiaSnapshot;
    
    @Column(name = "subtotal_alquiler", nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotalAlquiler;
    
    // ✅ CAMBIO: costo_envio_ida y costo_envio_vuelta
    @Column(name = "costo_envio_ida", precision = 12, scale = 2)
    private BigDecimal costoEnvioIda;
    
    @Column(name = "costo_envio_vuelta", precision = 12, scale = 2)
    private BigDecimal costoEnvioVuelta;
    
    @Column(name = "costo_seguro", nullable = false, precision = 12, scale = 2)
    private BigDecimal costoSeguro;
    
    @Column(name = "deposito_seguridad", precision = 12, scale = 2)
    private BigDecimal depositoSeguridad;
    
    // Cupones
    @Column(name = "cupon_id", length = 36)
    private String cuponId;
    
    @Column(name = "codigo_cupon", length = 50)
    private String codigoCupon;
    
    @Column(name = "descuento", precision = 12, scale = 2)
    private BigDecimal descuento;
    
    @Column(name = "total_pagado", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPagado;
    
    // Comisiones
    @Column(name = "comision_admin", nullable = false, precision = 12, scale = 2)
    private BigDecimal comisionAdmin;
    
    @Column(name = "porcentaje_comision", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentajeComision;
    
    // Fechas
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        
        // Inicializar valores por defecto si son null
        if (costoEnvioIda == null) costoEnvioIda = BigDecimal.ZERO;
        if (costoEnvioVuelta == null) costoEnvioVuelta = BigDecimal.ZERO;
        if (costoSeguro == null) costoSeguro = BigDecimal.ZERO;
        if (descuento == null) descuento = BigDecimal.ZERO;
        if (depositoSeguridad == null) depositoSeguridad = BigDecimal.ZERO;
        if (porcentajeComision == null) porcentajeComision = new BigDecimal("10.00");
    }
}