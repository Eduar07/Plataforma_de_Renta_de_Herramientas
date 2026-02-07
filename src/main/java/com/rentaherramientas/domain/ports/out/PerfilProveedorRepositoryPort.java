package com.rentaherramientas.domain.ports.out;

import com.rentaherramientas.domain.model.PerfilProveedor;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de Salida: Repositorio de Perfil Proveedor
 * Define las operaciones de persistencia para PerfilProveedor
 */
public interface PerfilProveedorRepositoryPort {
    
    PerfilProveedor save(PerfilProveedor perfilProveedor);
    
    Optional<PerfilProveedor> findById(String id);
    
    Optional<PerfilProveedor> findByUsuarioId(String usuarioId);
    
    List<PerfilProveedor> findAll();
    
    List<PerfilProveedor> findByVerificado(Boolean verificado);
    
    List<PerfilProveedor> findByEstadoKyc(String estadoKyc);
    
    void deleteById(String id);
    
    boolean existsByUsuarioId(String usuarioId);
}