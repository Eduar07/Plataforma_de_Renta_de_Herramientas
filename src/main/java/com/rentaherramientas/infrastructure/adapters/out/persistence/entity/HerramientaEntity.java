package com.rentaherramientas.infrastructure.adapters.out.persistence.entity;

import com.rentaherramientas.domain.model.enums.EstadoHerramienta;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad JPA: Herramienta
 */
@Entity
@Table(name = "herramientas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class HerramientaEntity {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", length = 36, updatable = false, nullable = false)
    private String id;
    
    @Column(name = "proveedor_id", nullable = false, length = 36)
    private String proveedorId;
    
    @Column(name = "categoria_id", nullable = false, length = 36)
    private String categoriaId;
    
    @Column(name = "nombre", nullable = false, length = 255)
    private String nombre;
    
    @Column(name = "marca", length = 100)
    private String marca;
    
    @Column(name = "modelo", length = 100)
    private String modelo;
    
    @Column(name = "sku", unique = true, length = 100)
    private String sku;
    
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "fotos", columnDefinition = "JSON")
    private List<String> fotos;
    
    @Column(name = "precio_base_dia", nullable = false, precision = 12, scale = 2)
    private BigDecimal precioBaseDia;
    
    @Column(name = "envio_incluido")
    private Boolean envioIncluido = true;
    
    @Column(name = "dias_minimo_alquiler")
    private Integer diasMinimoAlquiler = 1;
    
    @Column(name = "dias_maximo_alquiler")
    private Integer diasMaximoAlquiler = 90;
    
    @Column(name = "deposito_seguridad", precision = 12, scale = 2)
    private BigDecimal depositoSeguridad = BigDecimal.ZERO;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoHerramienta estado = EstadoHerramienta.ACTIVO;
    
    @Column(name = "calificacion_promedio", precision = 3, scale = 2)
    private BigDecimal calificacionPromedio = BigDecimal.ZERO;
    
    @Column(name = "total_calificaciones")
    private Integer totalCalificaciones = 0;
    
    @Column(name = "total_alquileres")
    private Integer totalAlquileres = 0;
    
    @Column(name = "vistas")
    private Integer vistas = 0;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}