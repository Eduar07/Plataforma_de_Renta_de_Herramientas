package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.UsuarioFavoritoEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA: Usuario Favorito
 */
@Repository
public interface UsuarioFavoritoRepository extends JpaRepository<UsuarioFavoritoEntity, String> {
    
    /**
     * Buscar todos los favoritos de un usuario
     */
    List<UsuarioFavoritoEntity> findByUsuarioIdOrderByCreatedAtDesc(String usuarioId);
    
    /**
     * Buscar un favorito específico por usuario y herramienta
     */
    Optional<UsuarioFavoritoEntity> findByUsuarioIdAndHerramientaId(String usuarioId, String herramientaId);
    
    /**
     * Verificar si existe un favorito
     */
    boolean existsByUsuarioIdAndHerramientaId(String usuarioId, String herramientaId);
    
    /**
     * Eliminar un favorito por usuario y herramienta
     */
    void deleteByUsuarioIdAndHerramientaId(String usuarioId, String herramientaId);
}