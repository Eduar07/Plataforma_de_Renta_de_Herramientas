package com.rentaherramientas.infrastructure.adapters.out.persistence.entity;

import com.rentaherramientas.domain.model.enums.EstadoPago;
import com.rentaherramientas.domain.model.enums.MetodoPago;
import com.rentaherramientas.domain.model.enums.TipoPago;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad JPA: Pago
 */
@Entity
@Table(name = "pagos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class PagoEntity {
    
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(name = "UUID", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", length = 36, updatable = false, nullable = false)
    private String id;
    
    @Column(name = "numero_transaccion", nullable = false, unique = true, length = 50)
    private String numeroTransaccion;
    
    @Column(name = "reserva_id", length = 36)
    private String reservaId;
    
    @Column(name = "cliente_id", nullable = false, length = 36)
    private String clienteId;
    
    @Column(name = "metodo_pago_id", length = 36)
    private String metodoPagoId;
    
    @Column(name = "monto", nullable = false, precision = 12, scale = 2)
    private BigDecimal monto;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private TipoPago tipo;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "metodo", nullable = false)
    private MetodoPago metodo;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoPago estado = EstadoPago.PENDIENTE;
    
    @Column(name = "gateway", nullable = false, length = 50)
    private String gateway;
    
    @Column(name = "gateway_transaction_id", length = 255)
    private String gatewayTransactionId;
    
    @Column(name = "gateway_response", columnDefinition = "JSON")
    private String gatewayResponse;
    
    @Column(name = "ip_cliente", length = 45)
    private String ipCliente;
    
    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;
    
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}