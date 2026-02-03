package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.Usuario;
import java.util.List;
import java.util.Optional;

public interface UsuarioUseCase {
    Usuario crearUsuario(Usuario usuario);
    Usuario actualizarUsuario(Long id, Usuario usuario);
    void eliminarUsuario(Long id);
    Optional<Usuario> buscarPorId(Long id);
    Optional<Usuario> buscarPorUsername(String username);
    Optional<Usuario> buscarPorEmail(String email);
    List<Usuario> listarTodos();
    List<Usuario> buscarPorRol(String rol);
}