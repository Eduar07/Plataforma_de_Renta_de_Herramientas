package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.domain.model.PerfilProveedor;
import com.rentaherramientas.domain.ports.out.PerfilProveedorRepositoryPort;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.PerfilProveedorEntity;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.PerfilProveedorMapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Adaptador de Persistencia: Perfil Proveedor
 * Implementa el puerto de salida usando JPA
 */
@Component
@RequiredArgsConstructor
public class PerfilProveedorRepositoryAdapter implements PerfilProveedorRepositoryPort {
    
    private final PerfilProveedorJpaRepository jpaRepository;
    private final PerfilProveedorMapper mapper;
    
    @Override
    public PerfilProveedor save(PerfilProveedor perfilProveedor) {
        PerfilProveedorEntity entity = mapper.toEntity(perfilProveedor);
        PerfilProveedorEntity savedEntity = jpaRepository.save(entity);
        return mapper.toDomain(savedEntity);
    }
    
    @Override
    public Optional<PerfilProveedor> findById(String id) {
        return jpaRepository.findById(id)
                .map(mapper::toDomain);
    }
    
    @Override
    public Optional<PerfilProveedor> findByUsuarioId(String usuarioId) {
        return jpaRepository.findByUsuarioId(usuarioId)
                .map(mapper::toDomain);
    }
    
    @Override
    public List<PerfilProveedor> findAll() {
        return jpaRepository.findAll().stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PerfilProveedor> findByVerificado(Boolean verificado) {
        return jpaRepository.findByVerificado(verificado).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PerfilProveedor> findByEstadoKyc(String estadoKyc) {
        return jpaRepository.findByEstadoKyc(estadoKyc).stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public void deleteById(String id) {
        jpaRepository.deleteById(id);
    }
    
    @Override
    public boolean existsByUsuarioId(String usuarioId) {
        return jpaRepository.existsByUsuarioId(usuarioId);
    }
}