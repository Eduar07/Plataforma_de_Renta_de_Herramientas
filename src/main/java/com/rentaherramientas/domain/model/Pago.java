package com.rentaherramientas.domain.model;

import com.rentaherramientas.domain.model.enums.EstadoPago;
import com.rentaherramientas.domain.model.enums.MetodoPago;
import com.rentaherramientas.domain.model.enums.TipoPago;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Modelo de dominio: Pago
 * Representa un pago realizado en el sistema
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pago {
    
    private String id;
    private String numeroTransaccion;
    private String reservaId;
    private String clienteId;
    private String metodoPagoId;
    private BigDecimal monto;
    private TipoPago tipo;
    private MetodoPago metodo;
    private EstadoPago estado;
    private String gateway;
    private String gatewayTransactionId;
    private String gatewayResponse;
    private String ipCliente;
    private LocalDateTime fechaPago;
    private LocalDateTime createdAt;
    
    /**
     * Verifica si el pago fue exitoso
     */
    public boolean isExitoso() {
        return EstadoPago.EXITOSO.equals(estado);
    }
    
    /**
     * Verifica si el pago está pendiente
     */
    public boolean isPendiente() {
        return EstadoPago.PENDIENTE.equals(estado) || 
               EstadoPago.PROCESANDO.equals(estado);
    }
    
    /**
     * Verifica si el pago falló
     */
    public boolean isFallido() {
        return EstadoPago.FALLIDO.equals(estado);
    }
}