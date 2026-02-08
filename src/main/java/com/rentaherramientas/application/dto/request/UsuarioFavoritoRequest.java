package com.rentaherramientas.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO Request: Agregar Favorito
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioFavoritoRequest {
    
    @NotBlank(message = "El ID del usuario es obligatorio")
    private String usuarioId;
    
    @NotBlank(message = "El ID de la herramienta es obligatorio")
    private String herramientaId;
}