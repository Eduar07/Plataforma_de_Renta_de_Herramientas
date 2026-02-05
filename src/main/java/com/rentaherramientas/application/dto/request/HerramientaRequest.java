package com.rentaherramientas.application.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO Request: Herramienta
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HerramientaRequest {
    
    @NotBlank(message = "El ID del proveedor es obligatorio")
    private String proveedorId;
    
    @NotBlank(message = "El ID de la categoría es obligatorio")
    private String categoriaId;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
    private String nombre;
    
    @Size(max = 100, message = "La marca no puede exceder 100 caracteres")
    private String marca;
    
    @Size(max = 100, message = "El modelo no puede exceder 100 caracteres")
    private String modelo;
    
    @Size(max = 100, message = "El SKU no puede exceder 100 caracteres")
    private String sku;
    
    private String descripcion;
    
    private List<String> fotos;
    
    @NotNull(message = "El precio base por día es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private BigDecimal precioBaseDia;
    
    private Boolean envioIncluido;
    
    @Min(value = 1, message = "Los días mínimos deben ser al menos 1")
    private Integer diasMinimoAlquiler;
    
    @Min(value = 1, message = "Los días máximos deben ser al menos 1")
    private Integer diasMaximoAlquiler;
    
    @DecimalMin(value = "0.00", message = "El depósito no puede ser negativo")
    private BigDecimal depositoSeguridad;
    
    @Pattern(regexp = "ACTIVO|PAUSADO|ELIMINADO", message = "Estado inválido")
    private String estado;
}