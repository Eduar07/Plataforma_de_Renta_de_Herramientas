package com.rentaherramientas.application.services;

import com.rentaherramientas.domain.exceptions.BusinessException;
import com.rentaherramientas.domain.exceptions.ResourceNotFoundException;
import com.rentaherramientas.domain.model.Reserva;
import com.rentaherramientas.domain.model.enums.EstadoReserva;
import com.rentaherramientas.domain.ports.in.ReservaUseCase;
import com.rentaherramientas.domain.ports.out.HerramientaRepositoryPort;
import com.rentaherramientas.domain.ports.out.ReservaRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

/**
 * Servicio de Aplicación: Reserva
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ReservaService implements ReservaUseCase {
    
    private final ReservaRepositoryPort reservaRepository;
    private final HerramientaRepositoryPort herramientaRepository;
    
    @Override
    public Reserva crearReserva(Reserva reserva) {
        // Validar herramienta existe
        herramientaRepository.findById(reserva.getHerramientaId())
                .orElseThrow(() -> new ResourceNotFoundException("Herramienta", "id", reserva.getHerramientaId()));
        
        // Validar fechas
        if (reserva.getFechaFin().isBefore(reserva.getFechaInicio())) {
            throw new BusinessException("La fecha de fin no puede ser anterior a la fecha de inicio");
        }
        
        // Validar disponibilidad
        if (!verificarDisponibilidad(reserva.getHerramientaId(), reserva.getFechaInicio(), reserva.getFechaFin())) {
            throw new BusinessException("La herramienta no está disponible en las fechas seleccionadas");
        }
        
        // Generar número de reserva
        reserva.setNumeroReserva(generarNumeroReserva());
        reserva.setEstado(EstadoReserva.PENDIENTE_PAGO);
        
        return reservaRepository.save(reserva);
    }
    
    @Override
    public Reserva actualizarReserva(String id, Reserva reserva) {
        Reserva existente = obtenerReservaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", id));
        
        // Actualizar campos permitidos
        existente.setNotasCliente(reserva.getNotasCliente());
        existente.setNotasProveedor(reserva.getNotasProveedor());
        existente.setTrackingEnvioIda(reserva.getTrackingEnvioIda());
        existente.setTrackingEnvioVuelta(reserva.getTrackingEnvioVuelta());
        
        return reservaRepository.save(existente);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Reserva> obtenerReservaPorId(String id) {
        return reservaRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Reserva> obtenerReservaPorNumero(String numeroReserva) {
        return reservaRepository.findByNumeroReserva(numeroReserva);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Reserva> listarReservas() {
        return reservaRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Reserva> listarReservasPorCliente(String clienteId) {
        return reservaRepository.findByClienteId(clienteId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Reserva> listarReservasPorProveedor(String proveedorId) {
        return reservaRepository.findByProveedorId(proveedorId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Reserva> listarReservasPorEstado(String estado) {
        return reservaRepository.findByEstado(EstadoReserva.valueOf(estado));
    }
    
    @Override
    public Reserva cambiarEstado(String id, String nuevoEstado) {
        Reserva reserva = obtenerReservaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", id));
        
        EstadoReserva estadoEnum = EstadoReserva.valueOf(nuevoEstado);
        reserva.setEstado(estadoEnum);
        
        switch (estadoEnum) {
            case PAGADA -> reserva.setFechaPago(LocalDateTime.now());
            case CONFIRMADA -> reserva.setFechaConfirmacion(LocalDateTime.now());
            case ENVIADA -> reserva.setFechaEnvio(LocalDateTime.now());
            case ENTREGADA -> reserva.setFechaEntrega(LocalDateTime.now());
            case DEVUELTA -> reserva.setFechaDevolucionReal(LocalDateTime.now());
            case COMPLETADA -> reserva.setFechaCompletada(LocalDateTime.now());
            default -> {
                // Estados que no requieren timestamp
            }
}

        
        return reservaRepository.save(reserva);
    }
    
    @Override
    public Reserva cancelarReserva(String id, String motivo, String canceladoPor) {
        Reserva reserva = obtenerReservaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", id));
        
        if (!reserva.puedeCancelarse()) {
            throw new BusinessException("La reserva no puede ser cancelada en su estado actual");
        }
        
        reserva.setEstado(EstadoReserva.CANCELADA_CLIENTE);
        reserva.setMotivoCancelacion(motivo);
        reserva.setCanceladoPor(canceladoPor);
        reserva.setFechaCancelacion(LocalDateTime.now());
        
        return reservaRepository.save(reserva);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean verificarDisponibilidad(String herramientaId, LocalDate fechaInicio, LocalDate fechaFin) {
        List<Reserva> reservasExistentes = reservaRepository.findByHerramientaId(herramientaId);
        
        return reservasExistentes.stream()
                .filter(r -> r.isActiva())
                .noneMatch(r -> 
                    !(fechaFin.isBefore(r.getFechaInicio()) || fechaInicio.isAfter(r.getFechaFin()))
                );
    }
    
    private String generarNumeroReserva() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "RES-" + timestamp;
    }
}