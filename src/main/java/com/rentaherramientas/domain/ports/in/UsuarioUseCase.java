package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.Usuario;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de entrada para casos de uso de Usuario
 */
public interface UsuarioUseCase {
    
    Usuario crearUsuario(Usuario usuario);
    
    Usuario actualizarUsuario(String id, Usuario usuario);
    
    Optional<Usuario> obtenerUsuarioPorId(String id);
    
    Optional<Usuario> obtenerUsuarioPorEmail(String email);
    
    List<Usuario> listarUsuarios();
    
    List<Usuario> listarUsuariosPorTipo(String tipo);
    
    void eliminarUsuario(String id);
    
    Usuario bloquearUsuario(String id, String razon);
    
    Usuario desbloquearUsuario(String id);
    
    void cambiarPassword(String id, String passwordActual, String passwordNuevo);
}