package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.domain.model.VerificacionDevolucion;
import com.rentaherramientas.domain.ports.out.VerificacionDevolucionRepositoryPort;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.VerificacionDevolucionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Adaptador de persistencia para VerificacionDevolucion
 */
@Component
@RequiredArgsConstructor
public class VerificacionDevolucionRepositoryAdapter implements VerificacionDevolucionRepositoryPort {

    private final VerificacionDevolucionJpaRepository jpaRepository;
    private final VerificacionDevolucionMapper mapper;

    @Override
    public VerificacionDevolucion save(VerificacionDevolucion verificacion) {
        var savedEntity = jpaRepository.save(mapper.toEntity(verificacion));
        return mapper.toDomain(savedEntity);
    }

    @Override
    public Optional<VerificacionDevolucion> findByReservaId(String reservaId) {
        return jpaRepository.findByReservaId(reservaId).map(mapper::toDomain);
    }

    @Override
    public boolean existsByReservaId(String reservaId) {
        return jpaRepository.existsByReservaId(reservaId);
    }
}
