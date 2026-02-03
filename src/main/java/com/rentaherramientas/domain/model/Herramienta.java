package com.rentaherramientas.domain.model;

import com.rentaherramientas.domain.model.enums.EstadoHerramienta;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Herramienta {
    private Long id;
    private String nombre;
    private String descripcion;
    private String marca;
    private String modelo;
    private String categoria;
    private BigDecimal precioDia;
    private BigDecimal precioSemana;
    private BigDecimal precioMes;
    private Integer stockDisponible;
    private EstadoHerramienta estado;
    private String imagenUrl;
    private String especificaciones;
    private Long proveedorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}