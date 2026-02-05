package com.rentaherramientas.application.services;

import com.rentaherramientas.domain.exceptions.BusinessException;
import com.rentaherramientas.domain.exceptions.ResourceNotFoundException;
import com.rentaherramientas.domain.model.Pago;
import com.rentaherramientas.domain.model.enums.EstadoPago;
import com.rentaherramientas.domain.ports.in.PagoUseCase;
import com.rentaherramientas.domain.ports.out.PagoRepositoryPort;
import com.rentaherramientas.domain.ports.out.ReservaRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * Servicio de Aplicación: Pago
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PagoService implements PagoUseCase {
    
    private final PagoRepositoryPort pagoRepository;
    private final ReservaRepositoryPort reservaRepository;
    
    @Override
    public Pago crearPago(Pago pago) {
        // Validar reserva si existe
        if (pago.getReservaId() != null) {
            reservaRepository.findById(pago.getReservaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", pago.getReservaId()));
        }
        
        // Generar número de transacción
        pago.setNumeroTransaccion(generarNumeroTransaccion());
        pago.setEstado(EstadoPago.PENDIENTE);
        
        return pagoRepository.save(pago);
    }
    
    @Override
    public Pago actualizarPago(String id, Pago pago) {
        Pago existente = obtenerPagoPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago", "id", id));
        
        existente.setEstado(pago.getEstado());
        existente.setGatewayTransactionId(pago.getGatewayTransactionId());
        existente.setGatewayResponse(pago.getGatewayResponse());
        
        return pagoRepository.save(existente);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Pago> obtenerPagoPorId(String id) {
        return pagoRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Pago> obtenerPagoPorNumeroTransaccion(String numeroTransaccion) {
        return pagoRepository.findByNumeroTransaccion(numeroTransaccion);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Pago> listarPagos() {
        return pagoRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Pago> listarPagosPorCliente(String clienteId) {
        return pagoRepository.findByClienteId(clienteId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Pago> listarPagosPorReserva(String reservaId) {
        return pagoRepository.findByReservaId(reservaId);
    }
    
    @Override
    public Pago procesarPago(String id) {
        Pago pago = obtenerPagoPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago", "id", id));
        
        if (!pago.isPendiente()) {
            throw new BusinessException("El pago no está en estado pendiente");
        }
        
        pago.setEstado(EstadoPago.PROCESANDO);
        return pagoRepository.save(pago);
    }
    
    @Override
    public Pago confirmarPago(String id, String gatewayTransactionId) {
        Pago pago = obtenerPagoPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago", "id", id));
        
        pago.setEstado(EstadoPago.EXITOSO);
        pago.setGatewayTransactionId(gatewayTransactionId);
        pago.setFechaPago(LocalDateTime.now());
        
        return pagoRepository.save(pago);
    }
    
    @Override
    public Pago rechazarPago(String id, String motivo) {
        Pago pago = obtenerPagoPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pago", "id", id));
        
        pago.setEstado(EstadoPago.FALLIDO);
        pago.setGatewayResponse(motivo);
        
        return pagoRepository.save(pago);
    }
    
    private String generarNumeroTransaccion() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "TXN-" + timestamp;
    }
}