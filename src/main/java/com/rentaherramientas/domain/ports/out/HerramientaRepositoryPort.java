package com.rentaherramientas.domain.ports.out;

import com.rentaherramientas.domain.model.Herramienta;
import com.rentaherramientas.domain.model.enums.EstadoHerramienta;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de salida para persistencia de Herramienta
 */
public interface HerramientaRepositoryPort {
    
    Herramienta save(Herramienta herramienta);
    
    Optional<Herramienta> findById(String id);
    
    Optional<Herramienta> findBySku(String sku);
    
    List<Herramienta> findAll();
    
    List<Herramienta> findByProveedorId(String proveedorId);
    
    List<Herramienta> findByCategoriaId(String categoriaId);
    
    // ✅ ESTE MÉTODO YA EXISTE - PERFECTO
    List<Herramienta> findByEstado(EstadoHerramienta estado);

    /*Aqui ajustamos */

    List<Herramienta> findByNombreContainingIgnoreCase(String nombre);
    
    List<Herramienta> searchByNombreOrMarcaOrModelo(String termino);
    
    void deleteById(String id);
    
    boolean existsBySku(String sku);
}