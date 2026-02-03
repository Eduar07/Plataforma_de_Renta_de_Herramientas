package com.rentaherramientas.domain.model;

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
public class Factura {
    private Long id;
    private String numeroFactura;
    private Long reservaId;
    private Long clienteId;
    private Long proveedorId;
    private BigDecimal subtotal;
    private BigDecimal impuestos;
    private BigDecimal total;
    private LocalDateTime fechaEmision;
    private String rutaPdf;
}