package com.rentaherramientas.application.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO Response: Favorito
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioFavoritoResponse {
    
    private String id;
    private String usuarioId;
    private String herramientaId;
    private LocalDateTime createdAt;
}