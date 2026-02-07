package com.rentaherramientas.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * Entidad JPA: Perfil Proveedor
 */
@Entity
@Table(name = "perfiles_proveedor")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerfilProveedorEntity {
    
    @Id
    @Column(length = 36)
    private String id;
    
    @Column(name = "usuario_id", nullable = false, unique = true, length = 36)
    private String usuarioId;
    
    @Column(name = "nombre_comercial", nullable = false)
    private String nombreComercial;
    
    @Column(columnDefinition = "TEXT")
    private String mision;
    
    @Column(columnDefinition = "TEXT")
    private String vision;
    
    @Column(name = "logo_url", length = 500)
    private String logoUrl;
    
    // ✅ CORRECCIÓN: Remover precision y scale para DOUBLE
    @Column(name = "calificacion_promedio")
    private Double calificacionPromedio;
    
    @Column(name = "total_calificaciones")
    private Integer totalCalificaciones;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_kyc", nullable = false, length = 20)
    private EstadoKycEntity estadoKyc;
    
    @Column(name = "documentos_kyc", columnDefinition = "JSON")
    private String documentosKyc;
    
    @Column(nullable = false)
    private Boolean verificado;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    /**
     * Enum interno para JPA
     */
    public enum EstadoKycEntity {
        PENDIENTE,
        APROBADO,
        RECHAZADO
    }
}