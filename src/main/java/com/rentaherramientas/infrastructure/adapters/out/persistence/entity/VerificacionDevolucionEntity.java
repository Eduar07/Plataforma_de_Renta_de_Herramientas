package com.rentaherramientas.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad JPA: Verificacion de Devolucion
 */
@Entity
@Table(name = "verificaciones_devolucion")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificacionDevolucionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36, updatable = false, nullable = false)
    private String id;

    @Column(name = "reserva_id", nullable = false, unique = true, length = 36)
    private String reservaId;

    @Column(name = "tipo", nullable = false, length = 30)
    private String tipo;

    @Column(name = "estado_herramienta", nullable = false, length = 20)
    private String estadoHerramienta;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "fotos", columnDefinition = "JSON")
    private List<String> fotos;

    @Column(name = "costo_reparacion_estimado", precision = 12, scale = 2)
    private BigDecimal costoReparacionEstimado;

    @Column(name = "fecha_verificacion")
    private LocalDateTime fechaVerificacion;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        if (fechaVerificacion == null) {
            fechaVerificacion = now;
        }
        if (createdAt == null) {
            createdAt = now;
        }
        if (costoReparacionEstimado == null) {
            costoReparacionEstimado = BigDecimal.ZERO;
        }
    }
}
