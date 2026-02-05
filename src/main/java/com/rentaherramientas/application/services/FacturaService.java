package com.rentaherramientas.application.services;

import com.rentaherramientas.domain.exceptions.ResourceNotFoundException;
import com.rentaherramientas.domain.model.Factura;
import com.rentaherramientas.domain.model.enums.EstadoFactura;
import com.rentaherramientas.domain.ports.in.FacturaUseCase;
import com.rentaherramientas.domain.ports.out.FacturaRepositoryPort;
import com.rentaherramientas.domain.ports.out.ReservaRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * Servicio de Aplicación: Factura
 */
@Service
@RequiredArgsConstructor
@Transactional
public class FacturaService implements FacturaUseCase {
    
    private final FacturaRepositoryPort facturaRepository;
    private final ReservaRepositoryPort reservaRepository;
    
    @Override
    public Factura crearFactura(Factura factura) {
        // Validar reserva existe
        reservaRepository.findById(factura.getReservaId())
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", factura.getReservaId()));
        
        // Generar número de factura
        factura.setNumeroFactura(generarNumeroFactura());
        factura.setEstado(EstadoFactura.EMITIDA);
        
        return facturaRepository.save(factura);
    }
    
    @Override
    public Factura actualizarFactura(String id, Factura factura) {
        Factura existente = obtenerFacturaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Factura", "id", id));
        
        existente.setObservaciones(factura.getObservaciones());
        
        return facturaRepository.save(existente);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Factura> obtenerFacturaPorId(String id) {
        return facturaRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Factura> obtenerFacturaPorNumero(String numeroFactura) {
        return facturaRepository.findByNumeroFactura(numeroFactura);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Factura> obtenerFacturaPorReserva(String reservaId) {
        return facturaRepository.findByReservaId(reservaId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Factura> listarFacturas() {
        return facturaRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Factura> listarFacturasPorCliente(String clienteId) {
        return facturaRepository.findByClienteId(clienteId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Factura> listarFacturasPorProveedor(String proveedorId) {
        return facturaRepository.findByProveedorId(proveedorId);
    }
    
    @Override
    public Factura marcarComoPagada(String id) {
        Factura factura = obtenerFacturaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Factura", "id", id));
        
        factura.setEstado(EstadoFactura.PAGADA);
        return facturaRepository.save(factura);
    }
    
    @Override
    public Factura anularFactura(String id, String motivo) {
        Factura factura = obtenerFacturaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Factura", "id", id));
        
        factura.setEstado(EstadoFactura.ANULADA);
        factura.setObservaciones(motivo);
        
        return facturaRepository.save(factura);
    }
    
    private String generarNumeroFactura() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return "FACT-" + timestamp + "-" + System.currentTimeMillis() % 10000;
    }
}