package com.rentaherramientas.infrastructure.adapters.out.persistence.mapper;

import com.rentaherramientas.domain.model.Factura;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.FacturaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper: Factura Domain <-> FacturaEntity
 */
@Component
public class FacturaMapper {
    
    public Factura toDomain(FacturaEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return Factura.builder()
                .id(entity.getId())
                .numeroFactura(entity.getNumeroFactura())
                .reservaId(entity.getReservaId())
                .clienteId(entity.getClienteId())
                .proveedorId(entity.getProveedorId())
                .clienteNombre(entity.getClienteNombre())
                .clienteDocumento(entity.getClienteDocumento())
                .clienteDireccion(entity.getClienteDireccion())
                .proveedorNombre(entity.getProveedorNombre())
                .proveedorDocumento(entity.getProveedorDocumento())
                .proveedorDireccion(entity.getProveedorDireccion())
                .subtotal(entity.getSubtotal())
                .descuentos(entity.getDescuentos())
                .impuestos(entity.getImpuestos())
                .total(entity.getTotal())
                .fechaEmision(entity.getFechaEmision())
                .fechaVencimiento(entity.getFechaVencimiento())
                .estado(entity.getEstado())
                .observaciones(entity.getObservaciones())
                .createdAt(entity.getCreatedAt())
                .build();
    }
    
    public FacturaEntity toEntity(Factura domain) {
        if (domain == null) {
            return null;
        }
        
        return FacturaEntity.builder()
                .id(domain.getId())
                .numeroFactura(domain.getNumeroFactura())
                .reservaId(domain.getReservaId())
                .clienteId(domain.getClienteId())
                .proveedorId(domain.getProveedorId())
                .clienteNombre(domain.getClienteNombre())
                .clienteDocumento(domain.getClienteDocumento())
                .clienteDireccion(domain.getClienteDireccion())
                .proveedorNombre(domain.getProveedorNombre())
                .proveedorDocumento(domain.getProveedorDocumento())
                .proveedorDireccion(domain.getProveedorDireccion())
                .subtotal(domain.getSubtotal())
                .descuentos(domain.getDescuentos())
                .impuestos(domain.getImpuestos())
                .total(domain.getTotal())
                .fechaEmision(domain.getFechaEmision())
                .fechaVencimiento(domain.getFechaVencimiento())
                .estado(domain.getEstado())
                .observaciones(domain.getObservaciones())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}