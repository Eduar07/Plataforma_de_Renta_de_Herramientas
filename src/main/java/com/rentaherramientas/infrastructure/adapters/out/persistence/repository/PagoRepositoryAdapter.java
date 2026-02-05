package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.domain.model.Pago;
import com.rentaherramientas.domain.model.enums.EstadoPago;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.PagoMapper;
import com.rentaherramientas.domain.ports.out.PagoRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adaptador de Repositorio: Pago
 */
@Component
@RequiredArgsConstructor
public class PagoRepositoryAdapter implements PagoRepositoryPort {
    
    private final PagoJpaRepository jpaRepository;
    private final PagoMapper mapper;
    
    @Override
    public Pago save(Pago pago) {
        var entity = mapper.toEntity(pago);
        var savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }
    
    @Override
    public Optional<Pago> findById(String id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }
    
    @Override
    public Optional<Pago> findByNumeroTransaccion(String numeroTransaccion) {
        return jpaRepository.findByNumeroTransaccion(numeroTransaccion)
                .map(mapper::toDomain);
    }
    
    @Override
    public List<Pago> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Pago> findByClienteId(String clienteId) {
        return jpaRepository.findByClienteId(clienteId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Pago> findByReservaId(String reservaId) {
        return jpaRepository.findByReservaId(reservaId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Pago> findByEstado(EstadoPago estado) {
        return jpaRepository.findByEstado(estado).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public boolean existsByNumeroTransaccion(String numeroTransaccion) {
        return jpaRepository.existsByNumeroTransaccion(numeroTransaccion);
    }
}