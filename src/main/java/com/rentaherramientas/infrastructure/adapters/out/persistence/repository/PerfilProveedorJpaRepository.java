package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.PerfilProveedorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA: Perfil Proveedor
 */
@Repository
public interface PerfilProveedorJpaRepository extends JpaRepository<PerfilProveedorEntity, String> {
    
    Optional<PerfilProveedorEntity> findByUsuarioId(String usuarioId);
    
    List<PerfilProveedorEntity> findByVerificado(Boolean verificado);
    
    List<PerfilProveedorEntity> findByEstadoKyc(String estadoKyc);
    
    boolean existsByUsuarioId(String usuarioId);
}