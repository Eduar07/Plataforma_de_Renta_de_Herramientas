package com.rentaherramientas.infrastructure.adapters.out.persistence.mapper;

import com.rentaherramientas.domain.model.DetalleReserva;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.DetalleReservaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper: DetalleReserva Domain ↔ DetalleReservaEntity JPA
 */
@Component
public class DetalleReservaMapper {
    
    /**
     * Convertir entidad JPA a modelo de dominio
     */
    public DetalleReserva toDomain(DetalleReservaEntity entity) {
        if (entity == null) return null;
        
        return DetalleReserva.builder()
                .id(entity.getId())
                .reservaId(entity.getReservaId())
                .precioDiaSnapshot(entity.getPrecioDiaSnapshot())
                .subtotalAlquiler(entity.getSubtotalAlquiler())
                .costoEnvioIda(entity.getCostoEnvioIda())           // ✅ CAMBIO
                .costoEnvioVuelta(entity.getCostoEnvioVuelta())     // ✅ CAMBIO
                .costoSeguro(entity.getCostoSeguro())
                .depositoSeguridad(entity.getDepositoSeguridad())
                .cuponId(entity.getCuponId())
                .codigoCupon(entity.getCodigoCupon())
                .descuento(entity.getDescuento())
                .totalPagado(entity.getTotalPagado())
                .comisionAdmin(entity.getComisionAdmin())
                .porcentajeComision(entity.getPorcentajeComision())
                .createdAt(entity.getCreatedAt())
                .build();
    }
    
    /**
     * Convertir modelo de dominio a entidad JPA
     */
    public DetalleReservaEntity toEntity(DetalleReserva domain) {
        if (domain == null) return null;
        
        return DetalleReservaEntity.builder()
                .id(domain.getId())
                .reservaId(domain.getReservaId())
                .precioDiaSnapshot(domain.getPrecioDiaSnapshot())
                .subtotalAlquiler(domain.getSubtotalAlquiler())
                .costoEnvioIda(domain.getCostoEnvioIda())           // ✅ CAMBIO
                .costoEnvioVuelta(domain.getCostoEnvioVuelta())     // ✅ CAMBIO
                .costoSeguro(domain.getCostoSeguro())
                .depositoSeguridad(domain.getDepositoSeguridad())
                .cuponId(domain.getCuponId())
                .codigoCupon(domain.getCodigoCupon())
                .descuento(domain.getDescuento())
                .totalPagado(domain.getTotalPagado())
                .comisionAdmin(domain.getComisionAdmin())
                .porcentajeComision(domain.getPorcentajeComision())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}