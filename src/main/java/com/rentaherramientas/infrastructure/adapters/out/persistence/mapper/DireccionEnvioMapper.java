package com.rentaherramientas.infrastructure.adapters.out.persistence.mapper;

import com.rentaherramientas.domain.model.DireccionEnvio;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.DireccionEnvioEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper: DireccionEnvio Domain ↔ DireccionEnvioEntity JPA
 */
@Component
public class DireccionEnvioMapper {
    
    /**
     * Convertir entidad JPA a modelo de dominio
     */
    public DireccionEnvio toDomain(DireccionEnvioEntity entity) {
        if (entity == null) return null;
        
        return DireccionEnvio.builder()
                .id(entity.getId())
                .usuarioId(entity.getUsuarioId())
                .alias(entity.getAlias())
                .nombreCompleto(entity.getNombreCompleto())
                .telefono(entity.getTelefono())
                .direccion(entity.getDireccion())
                .ciudad(entity.getCiudad())
                .departamento(entity.getDepartamento())
                .codigoPostal(entity.getCodigoPostal())
                .referencia(entity.getReferencia())
                .esPredeterminada(entity.getEsPredeterminada())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    /**
     * Convertir modelo de dominio a entidad JPA
     */
    public DireccionEnvioEntity toEntity(DireccionEnvio domain) {
        if (domain == null) return null;
        
        return DireccionEnvioEntity.builder()
                .id(domain.getId())
                .usuarioId(domain.getUsuarioId())
                .alias(domain.getAlias())
                .nombreCompleto(domain.getNombreCompleto())
                .telefono(domain.getTelefono())
                .direccion(domain.getDireccion())
                .ciudad(domain.getCiudad())
                .departamento(domain.getDepartamento())
                .codigoPostal(domain.getCodigoPostal())
                .referencia(domain.getReferencia())
                .esPredeterminada(domain.getEsPredeterminada())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}