package com.rentaherramientas.domain.ports.out;

import com.rentaherramientas.domain.model.Usuario;
import com.rentaherramientas.domain.model.enums.Rol;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para persistencia de Usuario
 */
public interface UsuarioRepositoryPort {
    
    Usuario save(Usuario usuario);
    
    Optional<Usuario> findById(String id);
    
    Optional<Usuario> findByEmail(String email);
    
    Optional<Usuario> findByDocumentoNumero(String documentoNumero);
    
    List<Usuario> findAll();
    
    List<Usuario> findByTipo(Rol tipo);
    
    void deleteById(String id);
    
    boolean existsByEmail(String email);
    
    boolean existsByDocumentoNumero(String documentoNumero);
}