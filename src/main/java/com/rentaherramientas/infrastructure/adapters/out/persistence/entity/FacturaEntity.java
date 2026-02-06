package com.rentaherramientas.infrastructure.adapters.out.persistence.entity;

import com.rentaherramientas.domain.model.enums.EstadoFactura;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
// import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Entidad JPA: Factura
 */
@Entity
@Table(name = "facturas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class FacturaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36, updatable = false, nullable = false)
    private String id;
    
    @Column(name = "numero_factura", nullable = false, unique = true, length = 50)
    private String numeroFactura;
    
    @Column(name = "reserva_id", nullable = false, unique = true, length = 36)
    private String reservaId;
    
    @Column(name = "cliente_id", nullable = false, length = 36)
    private String clienteId;
    
    @Column(name = "proveedor_id", nullable = false, length = 36)
    private String proveedorId;
    
    @Column(name = "cliente_nombre", nullable = false, length = 255)
    private String clienteNombre;
    
    @Column(name = "cliente_documento", nullable = false, length = 50)
    private String clienteDocumento;
    
    @Column(name = "cliente_direccion", columnDefinition = "TEXT")
    private String clienteDireccion;
    
    @Column(name = "proveedor_nombre", nullable = false, length = 255)
    private String proveedorNombre;
    
    @Column(name = "proveedor_documento", nullable = false, length = 50)
    private String proveedorDocumento;
    
    @Column(name = "proveedor_direccion", columnDefinition = "TEXT")
    private String proveedorDireccion;
    
    @Column(name = "subtotal", nullable = false, precision = 12, scale = 2)
    private BigDecimal subtotal;
    
    @Builder.Default
    @Column(name = "descuentos", precision = 12, scale = 2)
    private BigDecimal descuentos = BigDecimal.ZERO;

    @Builder.Default
    @Column(name = "impuestos", precision = 12, scale = 2)
    private BigDecimal impuestos = BigDecimal.ZERO;
    
    @Column(name = "total", nullable = false, precision = 12, scale = 2)
    private BigDecimal total;
    
    @Column(name = "fecha_emision", nullable = false)
    private LocalDate fechaEmision;
    
    @Column(name = "fecha_vencimiento")
    private LocalDate fechaVencimiento;
    
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoFactura estado = EstadoFactura.EMITIDA;
    
    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}