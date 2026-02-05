package com.rentaherramientas.infrastructure.adapters.out.persistence.mapper;

import com.rentaherramientas.domain.model.Pago;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.PagoEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper: Pago Domain <-> PagoEntity
 */
@Component
public class PagoMapper {
    
    public Pago toDomain(PagoEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return Pago.builder()
                .id(entity.getId())
                .numeroTransaccion(entity.getNumeroTransaccion())
                .reservaId(entity.getReservaId())
                .clienteId(entity.getClienteId())
                .metodoPagoId(entity.getMetodoPagoId())
                .monto(entity.getMonto())
                .tipo(entity.getTipo())
                .metodo(entity.getMetodo())
                .estado(entity.getEstado())
                .gateway(entity.getGateway())
                .gatewayTransactionId(entity.getGatewayTransactionId())
                .gatewayResponse(entity.getGatewayResponse())
                .ipCliente(entity.getIpCliente())
                .fechaPago(entity.getFechaPago())
                .createdAt(entity.getCreatedAt())
                .build();
    }
    
    public PagoEntity toEntity(Pago domain) {
        if (domain == null) {
            return null;
        }
        
        return PagoEntity.builder()
                .id(domain.getId())
                .numeroTransaccion(domain.getNumeroTransaccion())
                .reservaId(domain.getReservaId())
                .clienteId(domain.getClienteId())
                .metodoPagoId(domain.getMetodoPagoId())
                .monto(domain.getMonto())
                .tipo(domain.getTipo())
                .metodo(domain.getMetodo())
                .estado(domain.getEstado())
                .gateway(domain.getGateway())
                .gatewayTransactionId(domain.getGatewayTransactionId())
                .gatewayResponse(domain.getGatewayResponse())
                .ipCliente(domain.getIpCliente())
                .fechaPago(domain.getFechaPago())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}