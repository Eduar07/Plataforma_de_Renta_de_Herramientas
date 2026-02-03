package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.Herramienta;
import java.util.List;
import java.util.Optional;

public interface HerramientaUseCase {
    Herramienta crearHerramienta(Herramienta herramienta);
    Herramienta actualizarHerramienta(Long id, Herramienta herramienta);
    void eliminarHerramienta(Long id);
    Optional<Herramienta> buscarPorId(Long id);
    List<Herramienta> listarTodas();
    List<Herramienta> buscarPorCategoria(String categoria);
    List<Herramienta> buscarPorProveedor(Long proveedorId);
    List<Herramienta> buscarDisponibles();
}