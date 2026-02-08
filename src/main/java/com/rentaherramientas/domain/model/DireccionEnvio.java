package com.rentaherramientas.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad de dominio: Dirección de Envío
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DireccionEnvio {
    
    private String id;
    private String usuarioId;
    private String alias;              // Ej: "Casa", "Oficina", "Taller"
    private String nombreCompleto;
    private String telefono;
    private String direccion;
    private String ciudad;
    private String departamento;
    private String codigoPostal;
    private String referencia;         // Ej: "Portón azul, al lado de la panadería"
    private Boolean esPredeterminada;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}