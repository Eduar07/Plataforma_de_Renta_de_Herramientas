package com.rentaherramientas.domain.model;

import com.rentaherramientas.domain.model.enums.EstadoReserva;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Reserva {
    private Long id;
    private Long clienteId;
    private Long herramientaId;
    private Long proveedorId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer diasAlquiler;
    private BigDecimal costoTotal;
    private EstadoReserva estado;
    private String observaciones;
    private LocalDateTime fechaReserva;
    private LocalDateTime fechaAprobacion;
    private LocalDateTime fechaEntrega;
    private LocalDateTime fechaDevolucion;
}