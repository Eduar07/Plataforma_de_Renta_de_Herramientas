package com.rentaherramientas.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad de dominio: Usuario Favorito
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioFavorito {
    
    private String id;
    private String usuarioId;
    private String herramientaId;
    private LocalDateTime createdAt;
}