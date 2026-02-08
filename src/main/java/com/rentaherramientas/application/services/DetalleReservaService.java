package com.rentaherramientas.application.services;

import com.rentaherramientas.domain.model.DetalleReserva;
import com.rentaherramientas.domain.ports.in.DetalleReservaUseCase;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.DetalleReservaEntity;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.DetalleReservaMapper;
import com.rentaherramientas.infrastructure.adapters.out.persistence.repository.DetalleReservaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Servicio: Gestión de Detalle de Reserva
 */
@Service
@RequiredArgsConstructor
public class DetalleReservaService implements DetalleReservaUseCase {
    
    private final DetalleReservaRepository repository;
    private final DetalleReservaMapper mapper;
    
    @Override
    @Transactional
    public DetalleReserva crearDetalleReserva(DetalleReserva detalle) {
        System.out.println("=== CREAR DETALLE DE RESERVA ===");
        System.out.println("Reserva ID: " + detalle.getReservaId());
        
        // Verificar que no exista ya un detalle para esta reserva
        if (repository.existsByReservaId(detalle.getReservaId())) {
            throw new RuntimeException("Ya existe un detalle para esta reserva");
        }
        
        // Calcular comisión del admin si no está establecida
        if (detalle.getComisionAdmin() == null && detalle.getTotalPagado() != null) {
            BigDecimal porcentaje = detalle.getPorcentajeComision() != null 
                    ? detalle.getPorcentajeComision() 
                    : new BigDecimal("10.00"); // 10% por defecto
            
            BigDecimal comision = detalle.getTotalPagado()
                    .multiply(porcentaje)
                    .divide(new BigDecimal("100"), 2, BigDecimal.ROUND_HALF_UP);
            
            detalle.setComisionAdmin(comision);
            detalle.setPorcentajeComision(porcentaje);
            
            System.out.println("Comisión admin calculada: " + comision + " (" + porcentaje + "%)");
        }
        
        // ✅ ELIMINADO: No calcular pagoProveedor (no existe en BD)
        
        detalle.setCreatedAt(LocalDateTime.now());
        
        DetalleReservaEntity entity = mapper.toEntity(detalle);
        DetalleReservaEntity guardada = repository.save(entity);
        
        System.out.println("✅ Detalle de reserva guardado con ID: " + guardada.getId());
        
        return mapper.toDomain(guardada);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<DetalleReserva> obtenerDetallePorReservaId(String reservaId) {
        System.out.println("=== OBTENER DETALLE POR RESERVA ID ===");
        System.out.println("Reserva ID: " + reservaId);
        
        Optional<DetalleReserva> detalle = repository.findByReservaId(reservaId)
                .map(mapper::toDomain);
        
        if (detalle.isPresent()) {
            System.out.println("✅ Detalle encontrado: " + detalle.get().getId());
        } else {
            System.out.println("⚠️ No se encontró detalle para la reserva");
        }
        
        return detalle;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<DetalleReserva> obtenerDetallePorId(String id) {
        System.out.println("=== OBTENER DETALLE POR ID ===");
        System.out.println("Detalle ID: " + id);
        
        Optional<DetalleReserva> detalle = repository.findById(id)
                .map(mapper::toDomain);
        
        if (detalle.isPresent()) {
            System.out.println("✅ Detalle encontrado");
        } else {
            System.out.println("⚠️ Detalle no encontrado");
        }
        
        return detalle;
    }
    
    @Override
    @Transactional
    public DetalleReserva actualizarDetalleReserva(String id, DetalleReserva detalle) {
        System.out.println("=== ACTUALIZAR DETALLE DE RESERVA ===");
        System.out.println("Detalle ID: " + id);
        
        DetalleReservaEntity existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Detalle de reserva no encontrado con ID: " + id));
        
        // Actualizar campos permitidos
        if (detalle.getPrecioDiaSnapshot() != null) {
            existente.setPrecioDiaSnapshot(detalle.getPrecioDiaSnapshot());
        }
        if (detalle.getSubtotalAlquiler() != null) {
            existente.setSubtotalAlquiler(detalle.getSubtotalAlquiler());
        }
        if (detalle.getCostoSeguro() != null) {
            existente.setCostoSeguro(detalle.getCostoSeguro());
        }
        
        // ✅ CAMBIO: costoEnvioIda y costoEnvioVuelta
        if (detalle.getCostoEnvioIda() != null) {
            existente.setCostoEnvioIda(detalle.getCostoEnvioIda());
        }
        if (detalle.getCostoEnvioVuelta() != null) {
            existente.setCostoEnvioVuelta(detalle.getCostoEnvioVuelta());
        }
        
        if (detalle.getDescuento() != null) {
            existente.setDescuento(detalle.getDescuento());
        }
        if (detalle.getCodigoCupon() != null) {
            existente.setCodigoCupon(detalle.getCodigoCupon());
        }
        if (detalle.getCuponId() != null) {
            existente.setCuponId(detalle.getCuponId());
        }
        if (detalle.getTotalPagado() != null) {
            existente.setTotalPagado(detalle.getTotalPagado());
        }
        if (detalle.getDepositoSeguridad() != null) {
            existente.setDepositoSeguridad(detalle.getDepositoSeguridad());
        }
        
        // ✅ ELIMINADO: depositoRetenido (no existe en BD)
        
        DetalleReservaEntity actualizada = repository.save(existente);
        
        System.out.println("✅ Detalle de reserva actualizado");
        
        return mapper.toDomain(actualizada);
    }
}