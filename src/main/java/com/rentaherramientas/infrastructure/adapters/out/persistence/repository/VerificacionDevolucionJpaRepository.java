package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.VerificacionDevolucionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio JPA: Verificacion de Devolucion
 */
@Repository
public interface VerificacionDevolucionJpaRepository extends JpaRepository<VerificacionDevolucionEntity, String> {

    Optional<VerificacionDevolucionEntity> findByReservaId(String reservaId);

    boolean existsByReservaId(String reservaId);
}
