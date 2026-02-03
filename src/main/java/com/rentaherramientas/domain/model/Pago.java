package com.rentaherramientas.domain.model;

import com.rentaherramientas.domain.model.enums.EstadoPago;
import com.rentaherramientas.domain.model.enums.MetodoPago;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Pago {
    private Long id;
    private Long reservaId;
    private Long clienteId;
    private BigDecimal monto;
    private MetodoPago metodoPago;
    private EstadoPago estado;
    private String referencia;
    private String comprobante;
    private LocalDateTime fechaPago;
    private String observaciones;
}