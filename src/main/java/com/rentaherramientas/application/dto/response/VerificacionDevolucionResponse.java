package com.rentaherramientas.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO Response: Verificacion de devolucion
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificacionDevolucionResponse {

    private String id;
    private String reservaId;
    private String tipo;
    private String estadoHerramienta;
    private String descripcion;
    private List<String> fotos;
    private BigDecimal costoReparacionEstimado;
    private LocalDateTime fechaVerificacion;
}
