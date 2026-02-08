package com.rentaherramientas.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO Request: Crear/Actualizar Dirección de Envío
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DireccionEnvioRequest {
    
    @NotBlank(message = "El ID del usuario es obligatorio")
    private String usuarioId;
    
    @Size(max = 50, message = "El alias no puede exceder 50 caracteres")
    private String alias;
    
    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(max = 200, message = "El nombre completo no puede exceder 200 caracteres")
    private String nombreCompleto;
    
    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String telefono;
    
    @NotBlank(message = "La dirección es obligatoria")
    @Size(max = 500, message = "La dirección no puede exceder 500 caracteres")
    private String direccion;
    
    @NotBlank(message = "La ciudad es obligatoria")
    @Size(max = 100, message = "La ciudad no puede exceder 100 caracteres")
    private String ciudad;
    
    @Size(max = 100, message = "El departamento no puede exceder 100 caracteres")
    private String departamento;
    
    @Size(max = 10, message = "El código postal no puede exceder 10 caracteres")
    private String codigoPostal;
    
    @Size(max = 500, message = "La referencia no puede exceder 500 caracteres")
    private String referencia;
    
    @NotNull(message = "Debe especificar si es predeterminada")
    private Boolean esPredeterminada;
}