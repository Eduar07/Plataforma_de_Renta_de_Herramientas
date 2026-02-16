package com.rentaherramientas.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad JPA: Categoria
 */
@Entity
@Table(name = "categorias")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoriaEntity {

    @Id
    @Column(name = "id", length = 36)
    private String id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "slug", nullable = false, length = 100)
    private String slug;

    @Column(name = "orden")
    private Integer orden;

    @Column(name = "activa")
    private Boolean activa;
}
