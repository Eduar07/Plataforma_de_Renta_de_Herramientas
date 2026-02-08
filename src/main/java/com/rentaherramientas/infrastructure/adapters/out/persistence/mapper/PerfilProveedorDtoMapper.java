package com.rentaherramientas.infrastructure.adapters.out.persistence.mapper;

import com.rentaherramientas.application.dto.request.PerfilProveedorRequest;
import com.rentaherramientas.application.dto.response.PerfilProveedorResponse;
import com.rentaherramientas.domain.model.PerfilProveedor;
import org.springframework.stereotype.Component;

/**
 * Mapper: PerfilProveedor ↔ DTOs (Request/Response)
 */
@Component
public class PerfilProveedorDtoMapper {
    
    /**
     * Convierte Request → Domain
     * NO incluye id ni usuarioId - se setean desde el controller
     */
    public PerfilProveedor toDomain(PerfilProveedorRequest request) {
        if (request == null) return null;
        
        return PerfilProveedor.builder()
                // ❌ NO setear id aquí - se setea en el controller
                // ❌ NO setear usuarioId aquí - viene del @RequestParam
                .nombreComercial(request.getNombreComercial())
                .mision(request.getMision())
                .vision(request.getVision())
                .logoUrl(request.getLogoUrl())
                // ❌ NO setear campos autogenerados aquí
                .build();
    }
    
    /**
     * Convierte Domain → Response
     */
    public PerfilProveedorResponse toResponse(PerfilProveedor domain) {
        if (domain == null) return null;
        
        return PerfilProveedorResponse.builder()
                .id(domain.getId())
                .usuarioId(domain.getUsuarioId())
                .nombreComercial(domain.getNombreComercial())
                .mision(domain.getMision())
                .vision(domain.getVision())
                .logoUrl(domain.getLogoUrl())
                .calificacionPromedio(domain.getCalificacionPromedio())
                .totalCalificaciones(domain.getTotalCalificaciones())
                .estadoKyc(domain.getEstadoKyc() != null ? domain.getEstadoKyc().name() : null)
                .verificado(domain.getVerificado())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}