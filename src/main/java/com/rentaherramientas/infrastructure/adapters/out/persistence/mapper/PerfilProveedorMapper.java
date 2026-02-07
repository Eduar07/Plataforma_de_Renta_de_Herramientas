package com.rentaherramientas.infrastructure.adapters.out.persistence.mapper;

import com.rentaherramientas.domain.model.PerfilProveedor;
import com.rentaherramientas.domain.model.enums.EstadoKyc;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.PerfilProveedorEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper: Perfil Proveedor
 * Convierte entre entidades JPA y modelos de dominio
 */
@Component
public class PerfilProveedorMapper {
    
    public PerfilProveedorEntity toEntity(PerfilProveedor domain) {
        if (domain == null) return null;
        
        return PerfilProveedorEntity.builder()
                .id(domain.getId())
                .usuarioId(domain.getUsuarioId())
                .nombreComercial(domain.getNombreComercial())
                .mision(domain.getMision())
                .vision(domain.getVision())
                .logoUrl(domain.getLogoUrl())
                .calificacionPromedio(domain.getCalificacionPromedio())
                .totalCalificaciones(domain.getTotalCalificaciones())
                .estadoKyc(mapEstadoKycToEntity(domain.getEstadoKyc()))
                .documentosKyc(domain.getDocumentosKyc())
                .verificado(domain.getVerificado())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
    
    public PerfilProveedor toDomain(PerfilProveedorEntity entity) {
        if (entity == null) return null;
        
        return PerfilProveedor.builder()
                .id(entity.getId())
                .usuarioId(entity.getUsuarioId())
                .nombreComercial(entity.getNombreComercial())
                .mision(entity.getMision())
                .vision(entity.getVision())
                .logoUrl(entity.getLogoUrl())
                .calificacionPromedio(entity.getCalificacionPromedio())
                .totalCalificaciones(entity.getTotalCalificaciones())
                .estadoKyc(mapEstadoKycToDomain(entity.getEstadoKyc()))
                .documentosKyc(entity.getDocumentosKyc())
                .verificado(entity.getVerificado())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    private PerfilProveedorEntity.EstadoKycEntity mapEstadoKycToEntity(EstadoKyc estadoKyc) {
        if (estadoKyc == null) return null;
        return PerfilProveedorEntity.EstadoKycEntity.valueOf(estadoKyc.name());
    }
    
    private EstadoKyc mapEstadoKycToDomain(PerfilProveedorEntity.EstadoKycEntity estadoKyc) {
        if (estadoKyc == null) return null;
        return EstadoKyc.valueOf(estadoKyc.name());
    }
}