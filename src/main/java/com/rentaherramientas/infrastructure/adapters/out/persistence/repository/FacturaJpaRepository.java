package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.domain.model.enums.EstadoFactura;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.FacturaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA: Factura
 */
@Repository
public interface FacturaJpaRepository extends JpaRepository<FacturaEntity, String> {
    
    Optional<FacturaEntity> findByNumeroFactura(String numeroFactura);
    
    Optional<FacturaEntity> findByReservaId(String reservaId);
    
    List<FacturaEntity> findByClienteId(String clienteId);
    
    List<FacturaEntity> findByProveedorId(String proveedorId);
    
    List<FacturaEntity> findByEstado(EstadoFactura estado);
    
    boolean existsByNumeroFactura(String numeroFactura);
}