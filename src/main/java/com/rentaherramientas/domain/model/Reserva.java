package com.rentaherramientas.domain.model;

import com.rentaherramientas.domain.model.enums.EstadoReserva;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 * Modelo de dominio: Reserva
 * Representa una reserva de herramienta
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reserva {
    
    private String id;
    private String numeroReserva;
    private String clienteId;
    private String proveedorId;
    private String herramientaId;
    private String instanciaId;
    private String direccionEnvioId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer diasTotales;
    private EstadoReserva estado;
    private LocalDateTime fechaPago;
    private LocalDateTime fechaConfirmacion;
    private LocalDateTime fechaEnvio;
    private LocalDateTime fechaEntrega;
    private LocalDateTime fechaDevolucionProgramada;
    private LocalDateTime fechaDevolucionReal;
    private LocalDateTime fechaCompletada;
    private LocalDateTime fechaCancelacion;
    private String motivoCancelacion;
    private String canceladoPor;
    private String trackingEnvioIda;
    private String trackingEnvioVuelta;
    private String notasCliente;
    private String notasProveedor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Calcula los días totales de la reserva
     */
    public int calcularDiasTotales() {
        return (int) ChronoUnit.DAYS.between(fechaInicio, fechaFin) + 1;
    }
    
    /**
     * Verifica si la reserva está activa
     */
    public boolean isActiva() {
        return estado != null && 
               !estado.equals(EstadoReserva.CANCELADA_CLIENTE) &&
               !estado.equals(EstadoReserva.CANCELADA_PROVEEDOR) &&
               !estado.equals(EstadoReserva.CANCELADA_SISTEMA) &&
               !estado.equals(EstadoReserva.COMPLETADA);
    }
    
    /**
     * Verifica si la reserva puede ser cancelada
     */
    public boolean puedeCancelarse() {
        return estado.equals(EstadoReserva.PENDIENTE_PAGO) ||
               estado.equals(EstadoReserva.PAGADA) ||
               estado.equals(EstadoReserva.CONFIRMADA);
    }
    
    /**
     * Verifica si la reserva está en mora
     */
    public boolean isEnMora() {
        return estado.equals(EstadoReserva.MORA);
    }
}