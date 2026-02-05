package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.domain.model.Reserva;
import com.rentaherramientas.domain.model.enums.EstadoReserva;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.ReservaMapper;
import com.rentaherramientas.domain.ports.out.ReservaRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adaptador de Repositorio: Reserva
 */
@Component
@RequiredArgsConstructor
public class ReservaRepositoryAdapter implements ReservaRepositoryPort {
    
    private final ReservaJpaRepository jpaRepository;
    private final ReservaMapper mapper;
    
    @Override
    public Reserva save(Reserva reserva) {
        var entity = mapper.toEntity(reserva);
        var savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }
    
    @Override
    public Optional<Reserva> findById(String id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }
    
    @Override
    public Optional<Reserva> findByNumeroReserva(String numeroReserva) {
        return jpaRepository.findByNumeroReserva(numeroReserva)
                .map(mapper::toDomain);
    }
    
    @Override
    public List<Reserva> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Reserva> findByClienteId(String clienteId) {
        return jpaRepository.findByClienteId(clienteId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Reserva> findByProveedorId(String proveedorId) {
        return jpaRepository.findByProveedorId(proveedorId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Reserva> findByHerramientaId(String herramientaId) {
        return jpaRepository.findByHerramientaId(herramientaId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Reserva> findByEstado(EstadoReserva estado) {
        return jpaRepository.findByEstado(estado).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Reserva> findByFechaInicioBetween(LocalDate inicio, LocalDate fin) {
        return jpaRepository.findByFechaInicioBetween(inicio, fin).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public boolean existsByNumeroReserva(String numeroReserva) {
        return jpaRepository.existsByNumeroReserva(numeroReserva);
    }
}