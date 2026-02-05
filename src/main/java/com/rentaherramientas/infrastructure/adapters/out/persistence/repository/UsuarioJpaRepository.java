package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.domain.model.enums.Rol;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.UsuarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA: Usuario
 */
@Repository
public interface UsuarioJpaRepository extends JpaRepository<UsuarioEntity, String> {
    
    Optional<UsuarioEntity> findByEmail(String email);
    
    Optional<UsuarioEntity> findByDocumentoNumero(String documentoNumero);
    
    List<UsuarioEntity> findByTipo(Rol tipo);
    
    boolean existsByEmail(String email);
    
    boolean existsByDocumentoNumero(String documentoNumero);
}