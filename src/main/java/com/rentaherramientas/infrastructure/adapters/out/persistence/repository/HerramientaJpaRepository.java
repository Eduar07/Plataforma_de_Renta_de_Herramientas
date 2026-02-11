package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.domain.model.enums.EstadoHerramienta;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.HerramientaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio JPA: Herramienta
 */
@Repository
public interface HerramientaJpaRepository extends JpaRepository<HerramientaEntity, String> {
    
    Optional<HerramientaEntity> findBySku(String sku);
    
    List<HerramientaEntity> findByProveedorId(String proveedorId);
    
    List<HerramientaEntity> findByCategoriaId(String categoriaId);
    
    // ✅ ESTE MÉTODO YA EXISTE - NO MODIFICAR

    /*En esta seccion agregamos el metodo para ignorar el nombre */
    List<HerramientaEntity> findByEstado(EstadoHerramienta estado);

    List<HerramientaEntity> findByNombreContainingIgnoreCase(String nombre);

    
    @Query("SELECT h FROM HerramientaEntity h WHERE " +
           "LOWER(h.nombre) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(h.marca) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
           "LOWER(h.modelo) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<HerramientaEntity> searchByNombreOrMarcaOrModelo(@Param("termino") String termino);
    
    boolean existsBySku(String sku);
}
