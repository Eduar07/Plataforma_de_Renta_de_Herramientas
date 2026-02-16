package com.rentaherramientas.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Modelo de dominio: Verificacion de Devolucion
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VerificacionDevolucion {

    private String id;
    private String reservaId;
    private String tipo;
    private String estadoHerramienta;
    private String descripcion;
    private List<String> fotos;
    private BigDecimal costoReparacionEstimado;
    private LocalDateTime fechaVerificacion;
    private LocalDateTime createdAt;
}
