package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.DireccionEnvioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA: Direcciones de Envío
 */
@Repository
public interface DireccionEnvioRepository extends JpaRepository<DireccionEnvioEntity, String> {
    
    /**
     * Buscar todas las direcciones de un usuario
     */
    List<DireccionEnvioEntity> findByUsuarioIdOrderByEsPredeterminadaDescCreatedAtDesc(String usuarioId);
    
    /**
     * Buscar la dirección predeterminada de un usuario
     */
    Optional<DireccionEnvioEntity> findByUsuarioIdAndEsPredeterminadaTrue(String usuarioId);
    
    /**
     * Verificar si el usuario ya tiene una dirección predeterminada
     */
    boolean existsByUsuarioIdAndEsPredeterminadaTrue(String usuarioId);
    
    /**
     * Quitar la marca de predeterminada a todas las direcciones de un usuario
     * (para establecer una nueva como predeterminada)
     */
    @Modifying
    @Query("UPDATE DireccionEnvioEntity d SET d.esPredeterminada = false WHERE d.usuarioId = :usuarioId")
    void quitarPredeterminadaDeTodasLasDirecciones(@Param("usuarioId") String usuarioId);
}