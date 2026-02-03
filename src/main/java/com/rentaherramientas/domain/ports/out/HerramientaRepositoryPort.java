package com.rentaherramientas.domain.ports.out;

import com.rentaherramientas.domain.model.Herramienta;
import java.util.List;
import java.util.Optional;

public interface HerramientaRepositoryPort {
    Herramienta save(Herramienta herramienta);
    Optional<Herramienta> findById(Long id);
    List<Herramienta> findAll();
    List<Herramienta> findByCategoria(String categoria);
    List<Herramienta> findByProveedorId(Long proveedorId);
    List<Herramienta> findByEstado(String estado);
    void deleteById(Long id);
}