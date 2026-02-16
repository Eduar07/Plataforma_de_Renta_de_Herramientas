package com.rentaherramientas.infrastructure.adapters.out.persistence.repository;

import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.CategoriaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio JPA: Categoria
 */
@Repository
public interface CategoriaJpaRepository extends JpaRepository<CategoriaEntity, String> {

    List<CategoriaEntity> findByActivaTrueOrderByOrdenAscNombreAsc();
}
