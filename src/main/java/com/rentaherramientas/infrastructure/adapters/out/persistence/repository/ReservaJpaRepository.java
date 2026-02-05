package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.domain.model.enums.EstadoReserva;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.ReservaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA: Reserva
 */
@Repository
public interface ReservaJpaRepository extends JpaRepository<ReservaEntity, String> {
    
    Optional<ReservaEntity> findByNumeroReserva(String numeroReserva);
    
    List<ReservaEntity> findByClienteId(String clienteId);
    
    List<ReservaEntity> findByProveedorId(String proveedorId);
    
    List<ReservaEntity> findByHerramientaId(String herramientaId);
    
    List<ReservaEntity> findByEstado(EstadoReserva estado);
    
    List<ReservaEntity> findByFechaInicioBetween(LocalDate inicio, LocalDate fin);
    
    boolean existsByNumeroReserva(String numeroReserva);
}