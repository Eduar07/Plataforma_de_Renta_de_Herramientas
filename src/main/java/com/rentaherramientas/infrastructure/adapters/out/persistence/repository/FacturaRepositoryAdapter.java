package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.domain.model.Factura;
import com.rentaherramientas.domain.model.enums.EstadoFactura;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.FacturaMapper;
import com.rentaherramientas.domain.ports.out.FacturaRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adaptador de Repositorio: Factura
 */
@Component
@RequiredArgsConstructor
public class FacturaRepositoryAdapter implements FacturaRepositoryPort {
    
    private final FacturaJpaRepository jpaRepository;
    private final FacturaMapper mapper;
    
    @Override
    public Factura save(Factura factura) {
        var entity = mapper.toEntity(factura);
        var savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }
    
    @Override
    public Optional<Factura> findById(String id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }
    
    @Override
    public Optional<Factura> findByNumeroFactura(String numeroFactura) {
        return jpaRepository.findByNumeroFactura(numeroFactura)
                .map(mapper::toDomain);
    }
    
    @Override
    public Optional<Factura> findByReservaId(String reservaId) {
        return jpaRepository.findByReservaId(reservaId)
                .map(mapper::toDomain);
    }
    
    @Override
    public List<Factura> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Factura> findByClienteId(String clienteId) {
        return jpaRepository.findByClienteId(clienteId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Factura> findByProveedorId(String proveedorId) {
        return jpaRepository.findByProveedorId(proveedorId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Factura> findByEstado(EstadoFactura estado) {
        return jpaRepository.findByEstado(estado).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public boolean existsByNumeroFactura(String numeroFactura) {
        return jpaRepository.existsByNumeroFactura(numeroFactura);
    }
}