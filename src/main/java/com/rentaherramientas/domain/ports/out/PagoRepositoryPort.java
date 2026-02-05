package com.rentaherramientas.domain.ports.out;

import com.rentaherramientas.domain.model.Pago;
import com.rentaherramientas.domain.model.enums.EstadoPago;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para persistencia de Pago
 */
public interface PagoRepositoryPort {
    
    Pago save(Pago pago);
    
    Optional<Pago> findById(String id);
    
    Optional<Pago> findByNumeroTransaccion(String numeroTransaccion);
    
    List<Pago> findAll();
    
    List<Pago> findByClienteId(String clienteId);
    
    List<Pago> findByReservaId(String reservaId);
    
    List<Pago> findByEstado(EstadoPago estado);
    
    void deleteById(String id);
    
    boolean existsByNumeroTransaccion(String numeroTransaccion);
}