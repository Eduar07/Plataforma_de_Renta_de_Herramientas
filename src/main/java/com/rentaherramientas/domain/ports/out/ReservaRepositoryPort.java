package com.rentaherramientas.domain.ports.out;

import com.rentaherramientas.domain.model.Reserva;
import com.rentaherramientas.domain.model.enums.EstadoReserva;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para persistencia de Reserva
 */
public interface ReservaRepositoryPort {
    
    Reserva save(Reserva reserva);
    
    Optional<Reserva> findById(String id);
    
    Optional<Reserva> findByNumeroReserva(String numeroReserva);
    
    List<Reserva> findAll();
    
    List<Reserva> findByClienteId(String clienteId);
    
    List<Reserva> findByProveedorId(String proveedorId);
    
    List<Reserva> findByHerramientaId(String herramientaId);
    
    List<Reserva> findByEstado(EstadoReserva estado);
    
    List<Reserva> findByFechaInicioBetween(LocalDate inicio, LocalDate fin);
    
    void deleteById(String id);
    
    boolean existsByNumeroReserva(String numeroReserva);
}