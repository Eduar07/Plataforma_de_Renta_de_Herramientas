package com.rentaherramientas.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

/**
 * Entidad JPA: Usuario Favorito
 */
@Entity
@Table(name = "usuarios_favoritos", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"usuario_id", "herramienta_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioFavoritoEntity {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    private String id;
    
    @Column(name = "usuario_id", nullable = false, length = 36)
    private String usuarioId;
    
    @Column(name = "herramienta_id", nullable = false, length = 36)
    private String herramientaId;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}