package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.DetalleReserva;

import java.util.Optional;

/**
 * Puerto de entrada: Casos de uso de Detalle de Reserva
 */
public interface DetalleReservaUseCase {
    
    /**
     * Crear detalle financiero de reserva
     */
    DetalleReserva crearDetalleReserva(DetalleReserva detalle);
    
    /**
     * Obtener detalle por ID de reserva
     */
    Optional<DetalleReserva> obtenerDetallePorReservaId(String reservaId);
    
    /**
     * Obtener detalle por ID
     */
    Optional<DetalleReserva> obtenerDetallePorId(String id);
    
    /**
     * Actualizar detalle de reserva
     */
    DetalleReserva actualizarDetalleReserva(String id, DetalleReserva detalle);
}