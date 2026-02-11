package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.Herramienta;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de entrada para casos de uso de Herramienta
 */
public interface HerramientaUseCase {
    
    Herramienta crearHerramienta(Herramienta herramienta);
    
    Herramienta actualizarHerramienta(String id, Herramienta herramienta);
    
    Optional<Herramienta> obtenerHerramientaPorId(String id);
    
    List<Herramienta> listarHerramientas();
    
    List<Herramienta> listarHerramientasPorProveedor(String proveedorId);
    
    List<Herramienta> listarHerramientasPorCategoria(String categoriaId);
    
    // ========== En esta seccion se agrega el metodo, con el fin de buscarHerramientasPorNombre ==========
    List<Herramienta> listarHerramientasPorEstado(String estado);
    
    List<Herramienta> buscarHerramientasPorNombre(String nombre);

    List<Herramienta> buscarHerramientas(String termino);  
    
    void eliminarHerramienta(String id);
    
    Herramienta cambiarEstado(String id, String estado);
    
    void incrementarVistas(String id);
}
