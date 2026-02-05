package com.rentaherramientas.domain.model;

import com.rentaherramientas.domain.model.enums.EstadoHerramienta;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Modelo de dominio: Herramienta
 * Representa una herramienta disponible para renta
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Herramienta {
    
    private String id;
    private String proveedorId;
    private String categoriaId;
    private String nombre;
    private String marca;
    private String modelo;
    private String sku;
    private String descripcion;
    private List<String> fotos;
    private BigDecimal precioBaseDia;
    private Boolean envioIncluido;
    private Integer diasMinimoAlquiler;
    private Integer diasMaximoAlquiler;
    private BigDecimal depositoSeguridad;
    private EstadoHerramienta estado;
    private BigDecimal calificacionPromedio;
    private Integer totalCalificaciones;
    private Integer totalAlquileres;
    private Integer vistas;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Verifica si la herramienta está activa
     */
    public boolean isActiva() {
        return EstadoHerramienta.ACTIVO.equals(estado);
    }
    
    /**
     * Calcula el precio total para un número de días
     */
    public BigDecimal calcularPrecioTotal(int dias) {
        if (dias < diasMinimoAlquiler) {
            throw new IllegalArgumentException("El número de días no puede ser menor al mínimo");
        }
        if (dias > diasMaximoAlquiler) {
            throw new IllegalArgumentException("El número de días no puede ser mayor al máximo");
        }
        return precioBaseDia.multiply(BigDecimal.valueOf(dias));
    }
    
    /**
     * Incrementa el contador de vistas
     */
    public void incrementarVistas() {
        this.vistas = (this.vistas == null ? 0 : this.vistas) + 1;
    }
}