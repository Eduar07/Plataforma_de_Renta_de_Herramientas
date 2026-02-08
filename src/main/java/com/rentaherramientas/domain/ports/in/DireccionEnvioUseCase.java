package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.DireccionEnvio;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de entrada: Casos de uso de Direcciones de Envío
 */
public interface DireccionEnvioUseCase {
    
    /**
     * Crear nueva dirección de envío
     */
    DireccionEnvio crearDireccion(DireccionEnvio direccion);
    
    /**
     * Obtener todas las direcciones de un usuario
     */
    List<DireccionEnvio> obtenerDireccionesPorUsuario(String usuarioId);
    
    /**
     * Obtener una dirección por ID
     */
    Optional<DireccionEnvio> obtenerDireccionPorId(String id);
    
    /**
     * Obtener la dirección predeterminada de un usuario
     */
    Optional<DireccionEnvio> obtenerDireccionPredeterminada(String usuarioId);
    
    /**
     * Actualizar dirección existente
     */
    DireccionEnvio actualizarDireccion(String id, DireccionEnvio direccion);
    
    /**
     * Establecer una dirección como predeterminada
     */
    DireccionEnvio establecerComoPredeterminada(String id, String usuarioId);
    
    /**
     * Eliminar dirección
     */
    void eliminarDireccion(String id);
}