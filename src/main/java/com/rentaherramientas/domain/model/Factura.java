package com.rentaherramientas.domain.model;

import com.rentaherramientas.domain.model.enums.EstadoFactura;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Modelo de dominio: Factura
 * Representa una factura emitida por una reserva
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Factura {
    
    private String id;
    private String numeroFactura;
    private String reservaId;
    private String clienteId;
    private String proveedorId;
    private String clienteNombre;
    private String clienteDocumento;
    private String clienteDireccion;
    private String proveedorNombre;
    private String proveedorDocumento;
    private String proveedorDireccion;
    private BigDecimal subtotal;
    private BigDecimal descuentos;
    private BigDecimal impuestos;
    private BigDecimal total;
    private LocalDate fechaEmision;
    private LocalDate fechaVencimiento;
    private EstadoFactura estado;
    private String observaciones;
    private LocalDateTime createdAt;
    
    /**
     * Verifica si la factura está pagada
     */
    public boolean isPagada() {
        return EstadoFactura.PAGADA.equals(estado);
    }
    
    /**
     * Verifica si la factura está vencida
     */
    public boolean isVencida() {
        return fechaVencimiento != null && 
               LocalDate.now().isAfter(fechaVencimiento) &&
               !isPagada();
    }
    
    /**
     * Calcula el total final
     */
    public BigDecimal calcularTotal() {
        return subtotal.subtract(descuentos).add(impuestos);
    }
}