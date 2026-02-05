package com.rentaherramientas.infrastructure.adapters.out.persistence.mapper;

import com.rentaherramientas.domain.model.Herramienta;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.HerramientaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper: Herramienta Domain <-> HerramientaEntity
 */
@Component
public class HerramientaMapper {
    
    public Herramienta toDomain(HerramientaEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return Herramienta.builder()
                .id(entity.getId())
                .proveedorId(entity.getProveedorId())
                .categoriaId(entity.getCategoriaId())
                .nombre(entity.getNombre())
                .marca(entity.getMarca())
                .modelo(entity.getModelo())
                .sku(entity.getSku())
                .descripcion(entity.getDescripcion())
                .fotos(entity.getFotos())
                .precioBaseDia(entity.getPrecioBaseDia())
                .envioIncluido(entity.getEnvioIncluido())
                .diasMinimoAlquiler(entity.getDiasMinimoAlquiler())
                .diasMaximoAlquiler(entity.getDiasMaximoAlquiler())
                .depositoSeguridad(entity.getDepositoSeguridad())
                .estado(entity.getEstado())
                .calificacionPromedio(entity.getCalificacionPromedio())
                .totalCalificaciones(entity.getTotalCalificaciones())
                .totalAlquileres(entity.getTotalAlquileres())
                .vistas(entity.getVistas())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    public HerramientaEntity toEntity(Herramienta domain) {
        if (domain == null) {
            return null;
        }
        
        return HerramientaEntity.builder()
                .id(domain.getId())
                .proveedorId(domain.getProveedorId())
                .categoriaId(domain.getCategoriaId())
                .nombre(domain.getNombre())
                .marca(domain.getMarca())
                .modelo(domain.getModelo())
                .sku(domain.getSku())
                .descripcion(domain.getDescripcion())
                .fotos(domain.getFotos())
                .precioBaseDia(domain.getPrecioBaseDia())
                .envioIncluido(domain.getEnvioIncluido())
                .diasMinimoAlquiler(domain.getDiasMinimoAlquiler())
                .diasMaximoAlquiler(domain.getDiasMaximoAlquiler())
                .depositoSeguridad(domain.getDepositoSeguridad())
                .estado(domain.getEstado())
                .calificacionPromedio(domain.getCalificacionPromedio())
                .totalCalificaciones(domain.getTotalCalificaciones())
                .totalAlquileres(domain.getTotalAlquileres())
                .vistas(domain.getVistas())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}