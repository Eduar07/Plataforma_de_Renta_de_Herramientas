package com.rentaherramientas.domain.ports.out;

import com.rentaherramientas.domain.model.Factura;
import com.rentaherramientas.domain.model.enums.EstadoFactura;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para persistencia de Factura
 */
public interface FacturaRepositoryPort {
    
    Factura save(Factura factura);
    
    Optional<Factura> findById(String id);
    
    Optional<Factura> findByNumeroFactura(String numeroFactura);
    
    Optional<Factura> findByReservaId(String reservaId);
    
    List<Factura> findAll();
    
    List<Factura> findByClienteId(String clienteId);
    
    List<Factura> findByProveedorId(String proveedorId);
    
    List<Factura> findByEstado(EstadoFactura estado);
    
    void deleteById(String id);
    
    boolean existsByNumeroFactura(String numeroFactura);
}