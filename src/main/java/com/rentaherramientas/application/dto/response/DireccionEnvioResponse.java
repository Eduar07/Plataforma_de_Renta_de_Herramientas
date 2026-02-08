package com.rentaherramientas.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO Response: Dirección de Envío
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DireccionEnvioResponse {
    
    private String id;
    private String usuarioId;
    private String alias;
    private String nombreCompleto;
    private String telefono;
    private String direccion;
    private String ciudad;
    private String departamento;
    private String codigoPostal;
    private String referencia;
    private Boolean esPredeterminada;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}