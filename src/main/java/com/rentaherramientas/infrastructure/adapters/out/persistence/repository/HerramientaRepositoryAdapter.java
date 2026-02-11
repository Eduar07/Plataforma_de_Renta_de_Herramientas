package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.domain.model.Herramienta;
import com.rentaherramientas.domain.model.enums.EstadoHerramienta;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.HerramientaMapper;
import com.rentaherramientas.domain.ports.out.HerramientaRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adaptador de Repositorio: Herramienta
 */
@Component
@RequiredArgsConstructor
public class HerramientaRepositoryAdapter implements HerramientaRepositoryPort {
    
    private final HerramientaJpaRepository jpaRepository;
    private final HerramientaMapper mapper;
    
    @Override
    public Herramienta save(Herramienta herramienta) {
        var entity = mapper.toEntity(herramienta);
        var savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }
    
    @Override
    public Optional<Herramienta> findById(String id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }
    
    @Override
    public Optional<Herramienta> findBySku(String sku) {
        return jpaRepository.findBySku(sku)
                .map(mapper::toDomain);
    }
    
    @Override
    public List<Herramienta> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Herramienta> findByProveedorId(String proveedorId) {
        return jpaRepository.findByProveedorId(proveedorId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Herramienta> findByCategoriaId(String categoriaId) {
        return jpaRepository.findByCategoriaId(categoriaId).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    // ✅ ESTE MÉTODO YA EXISTE - PERFECTO
    @Override
    public List<Herramienta> findByEstado(EstadoHerramienta estado) {
        return jpaRepository.findByEstado(estado).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<Herramienta> searchByNombreOrMarcaOrModelo(String termino) {
        return jpaRepository.searchByNombreOrMarcaOrModelo(termino).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Herramienta> findByNombreContainingIgnoreCase(String nombre) {
        return jpaRepository.findByNombreContainingIgnoreCase(nombre).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public boolean existsBySku(String sku) {
        return jpaRepository.existsBySku(sku);
    }
}