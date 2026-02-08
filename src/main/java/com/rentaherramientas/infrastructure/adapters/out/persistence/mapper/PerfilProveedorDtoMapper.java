package com.rentaherramientas.infrastructure.adapters.out.persistence.mapper;

import com.rentaherramientas.domain.model.PerfilProveedor;
import com.rentaherramientas.domain.model.enums.EstadoKyc;
import com.rentaherramientas.application.dto.request.PerfilProveedorRequest;
import com.rentaherramientas.application.dto.response.PerfilProveedorResponse;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Mapper: PerfilProveedor DTO
 */
@Component
public class PerfilProveedorDtoMapper {
    
    public PerfilProveedor toDomain(PerfilProveedorRequest request) {
        if (request == null) return null;
        
        return PerfilProveedor.builder()
                .id(UUID.randomUUID().toString())
                .usuarioId(request.getUsuarioId())
                .nombreComercial(request.getNombreComercial())
                .mision(request.getMision())
                .vision(request.getVision())
                .logoUrl(request.getLogoUrl())
                .calificacionPromedio(0.0)
                .totalCalificaciones(0)
                .estadoKyc(request.getEstadoKyc() != null ? 
                    EstadoKyc.valueOf(request.getEstadoKyc()) : EstadoKyc.PENDIENTE)
                .verificado(request.getVerificado() != null ? request.getVerificado() : false)
                .build();
    }
    
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