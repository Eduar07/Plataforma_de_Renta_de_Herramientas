package com.rentaherramientas.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO Request: Perfil Proveedor
 * NO incluye usuarioId - viene como parámetro en el endpoint
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerfilProveedorRequest {
    
    // ❌ ELIMINADO - usuarioId viene en @RequestParam del controller
    
    @NotBlank(message = "El nombre comercial es obligatorio")
    @Size(max = 255, message = "El nombre comercial no puede exceder 255 caracteres")
    private String nombreComercial;
    
    @Size(max = 5000, message = "La misión no puede exceder 5000 caracteres")
    private String mision;
    
    @Size(max = 5000, message = "La visión no puede exceder 5000 caracteres")
    private String vision;
    
    @Size(max = 500, message = "La URL del logo no puede exceder 500 caracteres")
    private String logoUrl;
    
    // ✅ ESTOS CAMPOS NO DEBEN VENIR DEL CLIENTE (se setean automáticamente)
    // private String estadoKyc;  // Se setea en el backend
    // private Boolean verificado; // Se setea en el backend
}