package com.rentaherramientas.application.services;

import com.rentaherramientas.domain.exceptions.BusinessException;
import com.rentaherramientas.domain.exceptions.ResourceNotFoundException;
import com.rentaherramientas.domain.exceptions.ValidationException;
import com.rentaherramientas.domain.model.Herramienta;
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
import java.time.temporal.ChronoUnit;
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
        System.out.println("=== CREAR RESERVA - INICIO ===");
        System.out.println("Cliente ID: " + reserva.getClienteId());
        System.out.println("Herramienta ID: " + reserva.getHerramientaId());
        System.out.println("Proveedor ID recibido: " + reserva.getProveedorId());
        
        // PASO 1: Validar que la herramienta existe
        Herramienta herramienta = herramientaRepository.findById(reserva.getHerramientaId())
                .orElseThrow(() -> new ResourceNotFoundException("Herramienta", "id", reserva.getHerramientaId()));
        
        System.out.println("Herramienta encontrada: " + herramienta.getNombre());
        System.out.println("Proveedor ID de la herramienta: " + herramienta.getProveedorId());
        
        // PASO 2: ✅ OBTENER EL PERFIL_PROVEEDOR_ID A PARTIR DEL USUARIO_ID
        // La herramienta.getProveedorId() ya devuelve el perfil_proveedor_id (660e8400...)
        // Pero si el frontend envía usuario_id (550e8400...), debemos convertirlo
        
        String perfilProveedorId = herramienta.getProveedorId(); // Este YA es el correcto
        
        if (perfilProveedorId == null || perfilProveedorId.trim().isEmpty()) {
            throw new ValidationException("La herramienta no tiene un proveedor asignado");
        }
        
        System.out.println("Perfil Proveedor ID a usar: " + perfilProveedorId);
        
        // PASO 3: Asignar el perfil_proveedor_id CORRECTO a la reserva
        reserva.setProveedorId(perfilProveedorId);
        
        // PASO 4: Validar disponibilidad
        if (!verificarDisponibilidad(reserva.getHerramientaId(), reserva.getFechaInicio(), reserva.getFechaFin())) {
            throw new ValidationException("La herramienta no está disponible en las fechas seleccionadas");
        }
        
        // PASO 5: Calcular días totales (ya está como GENERATED COLUMN, pero lo dejamos por si acaso)
        long diasTotales = ChronoUnit.DAYS.between(reserva.getFechaInicio(), reserva.getFechaFin()) + 1;
        // No necesitamos setear diasTotales porque es GENERATED ALWAYS
        
        // PASO 6: Generar número de reserva único
        reserva.setNumeroReserva(generarNumeroReserva());
        
        // PASO 7: Estado inicial
        reserva.setEstado(EstadoReserva.PENDIENTE_PAGO);
        
        System.out.println("=== DATOS FINALES DE RESERVA ===");
        System.out.println("Número Reserva: " + reserva.getNumeroReserva());
        System.out.println("Cliente ID: " + reserva.getClienteId());
        System.out.println("Proveedor ID (perfil): " + reserva.getProveedorId());
        System.out.println("Herramienta ID: " + reserva.getHerramientaId());
        System.out.println("Estado: " + reserva.getEstado());
        
        // PASO 8: Guardar reserva
        Reserva reservaGuardada = reservaRepository.save(reserva);
        
        System.out.println("=== RESERVA CREADA EXITOSAMENTE ===");
        System.out.println("ID Reserva: " + reservaGuardada.getId());
        
        return reservaGuardada;
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