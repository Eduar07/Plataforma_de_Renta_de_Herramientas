package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.PerfilProveedor;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de Entrada: Casos de Uso de Perfil Proveedor
 */
public interface PerfilProveedorUseCase {
    
    PerfilProveedor crearPerfilProveedor(PerfilProveedor perfilProveedor);
    
    PerfilProveedor actualizarPerfilProveedor(String id, PerfilProveedor perfilProveedor);
    
    Optional<PerfilProveedor> obtenerPerfilProveedorPorId(String id);
    
    Optional<PerfilProveedor> obtenerPerfilProveedorPorUsuarioId(String usuarioId);
    
    List<PerfilProveedor> listarPerfilesProveedor();
    
    List<PerfilProveedor> listarPerfilesVerificados(Boolean verificado);
    
    void eliminarPerfilProveedor(String id);
}