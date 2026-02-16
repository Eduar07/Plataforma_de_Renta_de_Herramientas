package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.Reserva;
import com.rentaherramientas.domain.model.VerificacionDevolucion;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Puerto de entrada para casos de uso de Reserva
 */
public interface ReservaUseCase {
    
    Reserva crearReserva(Reserva reserva);
    
    Reserva actualizarReserva(String id, Reserva reserva);
    
    Optional<Reserva> obtenerReservaPorId(String id);
    
    Optional<Reserva> obtenerReservaPorNumero(String numeroReserva);
    
    List<Reserva> listarReservas();
    
    List<Reserva> listarReservasPorCliente(String clienteId);
    
    List<Reserva> listarReservasPorProveedor(String proveedorId);
    
    List<Reserva> listarReservasPorEstado(String estado);
    
    Reserva cambiarEstado(String id, String nuevoEstado);

    Reserva completarDevolucion(
            String reservaId,
            String proveedorId,
            Boolean reportarDanos,
            String estadoHerramienta,
            String descripcion,
            List<String> fotos,
            BigDecimal costoReparacionEstimado
    );

    Reserva solicitarDevolucionCliente(
            String reservaId,
            String clienteId,
            Boolean cancelarAlProveedor,
            String motivo,
            Boolean reportarDanos,
            String estadoHerramienta,
            String descripcion,
            List<String> fotos,
            BigDecimal costoReparacionEstimado
    );

    Optional<VerificacionDevolucion> obtenerVerificacionDevolucion(String reservaId);
    
    Reserva cancelarReserva(String id, String motivo, String canceladoPor);
    
    boolean verificarDisponibilidad(String herramientaId, LocalDate fechaInicio, LocalDate fechaFin);
}
