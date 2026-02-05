package com.rentaherramientas.infrastructure.adapters.out.persistence.mapper;

import com.rentaherramientas.domain.model.Reserva;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.ReservaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper: Reserva Domain <-> ReservaEntity
 */
@Component
public class ReservaMapper {
    
    public Reserva toDomain(ReservaEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return Reserva.builder()
                .id(entity.getId())
                .numeroReserva(entity.getNumeroReserva())
                .clienteId(entity.getClienteId())
                .proveedorId(entity.getProveedorId())
                .herramientaId(entity.getHerramientaId())
                .instanciaId(entity.getInstanciaId())
                .direccionEnvioId(entity.getDireccionEnvioId())
                .fechaInicio(entity.getFechaInicio())
                .fechaFin(entity.getFechaFin())
                .diasTotales(entity.getDiasTotales())
                .estado(entity.getEstado())
                .fechaPago(entity.getFechaPago())
                .fechaConfirmacion(entity.getFechaConfirmacion())
                .fechaEnvio(entity.getFechaEnvio())
                .fechaEntrega(entity.getFechaEntrega())
                .fechaDevolucionProgramada(entity.getFechaDevolucionProgramada())
                .fechaDevolucionReal(entity.getFechaDevolucionReal())
                .fechaCompletada(entity.getFechaCompletada())
                .fechaCancelacion(entity.getFechaCancelacion())
                .motivoCancelacion(entity.getMotivoCancelacion())
                .canceladoPor(entity.getCanceladoPor())
                .trackingEnvioIda(entity.getTrackingEnvioIda())
                .trackingEnvioVuelta(entity.getTrackingEnvioVuelta())
                .notasCliente(entity.getNotasCliente())
                .notasProveedor(entity.getNotasProveedor())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    public ReservaEntity toEntity(Reserva domain) {
        if (domain == null) {
            return null;
        }
        
        return ReservaEntity.builder()
                .id(domain.getId())
                .numeroReserva(domain.getNumeroReserva())
                .clienteId(domain.getClienteId())
                .proveedorId(domain.getProveedorId())
                .herramientaId(domain.getHerramientaId())
                .instanciaId(domain.getInstanciaId())
                .direccionEnvioId(domain.getDireccionEnvioId())
                .fechaInicio(domain.getFechaInicio())
                .fechaFin(domain.getFechaFin())
                .diasTotales(domain.getDiasTotales())
                .estado(domain.getEstado())
                .fechaPago(domain.getFechaPago())
                .fechaConfirmacion(domain.getFechaConfirmacion())
                .fechaEnvio(domain.getFechaEnvio())
                .fechaEntrega(domain.getFechaEntrega())
                .fechaDevolucionProgramada(domain.getFechaDevolucionProgramada())
                .fechaDevolucionReal(domain.getFechaDevolucionReal())
                .fechaCompletada(domain.getFechaCompletada())
                .fechaCancelacion(domain.getFechaCancelacion())
                .motivoCancelacion(domain.getMotivoCancelacion())
                .canceladoPor(domain.getCanceladoPor())
                .trackingEnvioIda(domain.getTrackingEnvioIda())
                .trackingEnvioVuelta(domain.getTrackingEnvioVuelta())
                .notasCliente(domain.getNotasCliente())
                .notasProveedor(domain.getNotasProveedor())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}