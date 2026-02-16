package com.rentaherramientas.infrastructure.adapters.out.persistence.mapper;

import com.rentaherramientas.domain.model.VerificacionDevolucion;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.VerificacionDevolucionEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper: VerificacionDevolucion Domain <-> Entity
 */
@Component
public class VerificacionDevolucionMapper {

    public VerificacionDevolucion toDomain(VerificacionDevolucionEntity entity) {
        if (entity == null) {
            return null;
        }

        return VerificacionDevolucion.builder()
                .id(entity.getId())
                .reservaId(entity.getReservaId())
                .tipo(entity.getTipo())
                .estadoHerramienta(entity.getEstadoHerramienta())
                .descripcion(entity.getDescripcion())
                .fotos(entity.getFotos())
                .costoReparacionEstimado(entity.getCostoReparacionEstimado())
                .fechaVerificacion(entity.getFechaVerificacion())
                .createdAt(entity.getCreatedAt())
                .build();
    }

    public VerificacionDevolucionEntity toEntity(VerificacionDevolucion domain) {
        if (domain == null) {
            return null;
        }

        return VerificacionDevolucionEntity.builder()
                .id(domain.getId())
                .reservaId(domain.getReservaId())
                .tipo(domain.getTipo())
                .estadoHerramienta(domain.getEstadoHerramienta())
                .descripcion(domain.getDescripcion())
                .fotos(domain.getFotos())
                .costoReparacionEstimado(domain.getCostoReparacionEstimado())
                .fechaVerificacion(domain.getFechaVerificacion())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}
