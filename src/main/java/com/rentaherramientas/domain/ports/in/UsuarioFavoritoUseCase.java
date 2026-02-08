package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.UsuarioFavorito;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de entrada: Casos de uso de Favoritos
 */
public interface UsuarioFavoritoUseCase {
    
    /**
     * Agregar herramienta a favoritos
     */
    UsuarioFavorito agregarFavorito(String usuarioId, String herramientaId);
    
    /**
     * Obtener todos los favoritos de un usuario
     */
    List<UsuarioFavorito> obtenerFavoritosPorUsuario(String usuarioId);
    
    /**
     * Verificar si una herramienta está en favoritos
     */
    boolean esFavorito(String usuarioId, String herramientaId);
    
    /**
     * Eliminar de favoritos
     */
    void eliminarFavorito(String id);
    
    /**
     * Eliminar de favoritos por usuario y herramienta
     */
    void eliminarFavoritoPorUsuarioYHerramienta(String usuarioId, String herramientaId);
}