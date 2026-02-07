package com.rentaherramientas.domain.model;

import com.rentaherramientas.domain.model.enums.EstadoKyc;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad de Dominio: Perfil Proveedor
 * Representa el perfil comercial de un proveedor en el marketplace
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerfilProveedor {
    
    private String id;
    private String usuarioId; // FK a Usuario
    private String nombreComercial;
    private String mision;
    private String vision;
    private String logoUrl;
    
    private Double calificacionPromedio;
    private Integer totalCalificaciones;
    
    private EstadoKyc estadoKyc;
    private String documentosKyc; // JSON con documentos KYC
    private Boolean verificado;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}