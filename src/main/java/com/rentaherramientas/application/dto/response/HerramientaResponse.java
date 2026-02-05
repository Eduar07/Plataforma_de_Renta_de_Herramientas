package com.rentaherramientas.application.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO Response: Herramienta
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class HerramientaResponse {
    
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
    private String estado;
    private BigDecimal calificacionPromedio;
    private Integer totalCalificaciones;
    private Integer totalAlquileres;
    private Integer vistas;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}