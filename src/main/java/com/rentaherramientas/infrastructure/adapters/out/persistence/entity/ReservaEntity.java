package com.rentaherramientas.infrastructure.adapters.out.persistence.entity;

import com.rentaherramientas.domain.model.enums.EstadoDevolucion;
import com.rentaherramientas.domain.model.enums.EstadoReserva;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
// import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Entidad JPA: Reserva
 */
@Entity
@Table(name = "reservas")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class ReservaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36, updatable = false, nullable = false)
    private String id;
    
    @Column(name = "numero_reserva", nullable = false, unique = true, length = 50)
    private String numeroReserva;
    
    @Column(name = "cliente_id", nullable = false, length = 36)
    private String clienteId;
    
    @Column(name = "proveedor_id", nullable = false, length = 36)
    private String proveedorId;
    
    @Column(name = "herramienta_id", nullable = false, length = 36)
    private String herramientaId;
    
    @Column(name = "instancia_id", length = 36)
    private String instanciaId;
    
    @Column(name = "direccion_envio_id", length = 36)
    private String direccionEnvioId;
    
    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;
    
    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;
    
    @Column(name = "dias_totales", insertable = false, updatable = false)
    private Integer diasTotales;
    
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoReserva estado = EstadoReserva.PENDIENTE_PAGO;
    
    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;
    
    @Column(name = "fecha_confirmacion")
    private LocalDateTime fechaConfirmacion;
    
    @Column(name = "fecha_envio")
    private LocalDateTime fechaEnvio;
    
    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;
    
    @Column(name = "fecha_devolucion_programada")
    private LocalDateTime fechaDevolucionProgramada;
    
    @Column(name = "fecha_devolucion_real")
    private LocalDateTime fechaDevolucionReal;
    
    @Column(name = "fecha_completada")
    private LocalDateTime fechaCompletada;
    
    @Column(name = "fecha_cancelacion")
    private LocalDateTime fechaCancelacion;
    
    @Column(name = "motivo_cancelacion", columnDefinition = "TEXT")
    private String motivoCancelacion;
    
    @Column(name = "cancelado_por", length = 36)
    private String canceladoPor;
    
    @Column(name = "tracking_envio_ida", length = 255)
    private String trackingEnvioIda;
    
    @Column(name = "tracking_envio_vuelta", length = 255)
    private String trackingEnvioVuelta;
    
    @Column(name = "notas_cliente", columnDefinition = "TEXT")
    private String notasCliente;
    
    @Column(name = "notas_proveedor", columnDefinition = "TEXT")
    private String notasProveedor;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @Enumerated(EnumType.STRING)
@Column(nullable = false)

private EstadoDevolucion estadoDevolucion = EstadoDevolucion.PENDIENTE_DEVOLUCION;

@OneToMany(mappedBy = "reserva", cascade = CascadeType.ALL)
private List<ReporteDano> reportesDano;




}