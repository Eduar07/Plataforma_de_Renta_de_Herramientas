package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.domain.model.enums.EstadoPago;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.PagoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA: Pago
 */
@Repository
public interface PagoJpaRepository extends JpaRepository<PagoEntity, String> {
    
    Optional<PagoEntity> findByNumeroTransaccion(String numeroTransaccion);
    
    List<PagoEntity> findByClienteId(String clienteId);
    
    List<PagoEntity> findByReservaId(String reservaId);
    
    List<PagoEntity> findByEstado(EstadoPago estado);
    
    boolean existsByNumeroTransaccion(String numeroTransaccion);
}