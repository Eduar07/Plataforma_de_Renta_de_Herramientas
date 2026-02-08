package com.rentaherramientas.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDateTime;

/**
 * Entidad JPA: Direcciones de Envío
 */
@Entity
@Table(name = "direcciones_envio")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DireccionEnvioEntity {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", updatable = false, nullable = false, length = 36)
    private String id;
    
    @Column(name = "usuario_id", nullable = false, length = 36)
    private String usuarioId;
    
    @Column(name = "alias", length = 50)
    private String alias;
    
    @Column(name = "nombre_completo", nullable = false, length = 200)
    private String nombreCompleto;
    
    @Column(name = "telefono", nullable = false, length = 20)
    private String telefono;
    
    @Column(name = "direccion", nullable = false, length = 500)
    private String direccion;
    
    @Column(name = "ciudad", nullable = false, length = 100)
    private String ciudad;
    
    @Column(name = "departamento", length = 100)
    private String departamento;
    
    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;
    
    @Column(name = "referencia", length = 500)
    private String referencia;
    
    @Column(name = "es_predeterminada", nullable = false)
    private Boolean esPredeterminada;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (esPredeterminada == null) {
            esPredeterminada = false;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}