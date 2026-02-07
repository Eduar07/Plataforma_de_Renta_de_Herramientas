package com.rentaherramientas.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO Request: Perfil Proveedor
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerfilProveedorRequest {
    
    @NotBlank(message = "El ID de usuario es obligatorio")
    private String usuarioId;
    
    @NotBlank(message = "El nombre comercial es obligatorio")
    private String nombreComercial;
    
    private String mision;
    private String vision;
    private String logoUrl;
    private String estadoKyc;
    private Boolean verificado;
}