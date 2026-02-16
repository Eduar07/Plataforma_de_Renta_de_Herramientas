package com.rentaherramientas.application.dto.request;

import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO Request: completar devolucion de reserva
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DevolucionReservaRequest {

    @Builder.Default
    private Boolean reportarDanos = false;

    private String estadoHerramienta;

    private String descripcion;

    private List<String> fotos;

    @DecimalMin(value = "0.00", message = "El costo estimado no puede ser negativo")
    private BigDecimal costoReparacionEstimado;
}
