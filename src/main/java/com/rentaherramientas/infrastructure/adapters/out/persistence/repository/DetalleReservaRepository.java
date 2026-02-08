package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.DetalleReservaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio JPA: Detalle de Reserva
 */
@Repository
public interface DetalleReservaRepository extends JpaRepository<DetalleReservaEntity, String> {
    
    /**
     * Buscar detalle por ID de reserva
     */
    Optional<DetalleReservaEntity> findByReservaId(String reservaId);
    
    /**
     * Verificar si existe detalle para una reserva
     */
    boolean existsByReservaId(String reservaId);
}