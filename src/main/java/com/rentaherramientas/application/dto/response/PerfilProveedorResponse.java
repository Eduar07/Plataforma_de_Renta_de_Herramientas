package com.rentaherramientas.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO Response: Perfil Proveedor
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerfilProveedorResponse {
    
    private String id;
    private String usuarioId;
    private String nombreComercial;
    private String mision;
    private String vision;
    private String logoUrl;
    private Double calificacionPromedio;
    private Integer totalCalificaciones;
    private String estadoKyc;
    private Boolean verificado;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}