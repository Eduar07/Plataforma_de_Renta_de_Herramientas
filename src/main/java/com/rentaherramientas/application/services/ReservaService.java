package com.rentaherramientas.application.services;

import com.rentaherramientas.domain.exceptions.BusinessException;
import com.rentaherramientas.domain.exceptions.ResourceNotFoundException;
import com.rentaherramientas.domain.exceptions.ValidationException;
import com.rentaherramientas.domain.model.DetalleReserva;
import com.rentaherramientas.domain.model.Herramienta;
import com.rentaherramientas.domain.model.Reserva;
import com.rentaherramientas.domain.model.VerificacionDevolucion;
import com.rentaherramientas.domain.model.enums.EstadoReserva;
import com.rentaherramientas.domain.ports.in.DetalleReservaUseCase;
import com.rentaherramientas.domain.ports.in.HerramientaUseCase;
import com.rentaherramientas.domain.ports.in.ReservaUseCase;
import com.rentaherramientas.domain.ports.out.ReservaRepositoryPort;
import com.rentaherramientas.domain.ports.out.VerificacionDevolucionRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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
    private final HerramientaUseCase herramientaService;
    private final DetalleReservaUseCase detalleReservaService;
    private final VerificacionDevolucionRepositoryPort verificacionDevolucionRepository;
    
    @Override
    public Reserva crearReserva(Reserva reserva) {
        System.out.println("=== CREAR RESERVA - INICIO ===");
        System.out.println("Cliente ID: " + reserva.getClienteId());
        System.out.println("Herramienta ID: " + reserva.getHerramientaId());
        System.out.println("Proveedor ID recibido: " + reserva.getProveedorId());
        
        // PASO 1: Validar que la herramienta existe
        Herramienta herramienta = herramientaService.obtenerHerramientaPorId(reserva.getHerramientaId())
                .orElseThrow(() -> new ResourceNotFoundException("Herramienta", "id", reserva.getHerramientaId()));
        
        System.out.println("Herramienta encontrada: " + herramienta.getNombre());
        System.out.println("Proveedor ID de la herramienta: " + herramienta.getProveedorId());
        
        // PASO 2: OBTENER EL PERFIL_PROVEEDOR_ID DE LA HERRAMIENTA
        String perfilProveedorId = herramienta.getProveedorId();
        
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
        
        // PASO 5: Calcular días totales
        long diasTotales = ChronoUnit.DAYS.between(reserva.getFechaInicio(), reserva.getFechaFin());
        if (diasTotales <= 0) {
            throw new ValidationException("El período de reserva debe ser de al menos 1 día");
        }
        
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
        System.out.println("Días totales: " + diasTotales);
        
        // PASO 8: Guardar reserva
        Reserva reservaGuardada = reservaRepository.save(reserva);
        
        System.out.println("=== RESERVA CREADA EXITOSAMENTE ===");
        System.out.println("ID Reserva: " + reservaGuardada.getId());
        
        // PASO 9: CREAR DETALLE FINANCIERO AUTOMÁTICAMENTE
        try {
            System.out.println("=== CREANDO DETALLE FINANCIERO ===");
            
            // Calcular costos
            BigDecimal precioDia = herramienta.getPrecioBaseDia();
            BigDecimal subtotal = precioDia.multiply(new BigDecimal(diasTotales));
            BigDecimal seguro = subtotal.multiply(new BigDecimal("0.05")); // 5% seguro
            BigDecimal costoEnvioIda = BigDecimal.ZERO;
            BigDecimal costoEnvioVuelta = BigDecimal.ZERO;
            BigDecimal descuento = BigDecimal.ZERO;
            
            // Total = subtotal + seguro (sin envío por ahora)
            BigDecimal total = subtotal.add(seguro).subtract(descuento);
            
            // Calcular comisión admin (10%)
            BigDecimal porcentajeComision = new BigDecimal("10.00");
            BigDecimal comisionAdmin = total.multiply(porcentajeComision)
                    .divide(new BigDecimal("100"), 2, BigDecimal.ROUND_HALF_UP);
            
            System.out.println("Precio/día: " + precioDia);
            System.out.println("Subtotal: " + subtotal);
            System.out.println("Seguro: " + seguro);
            System.out.println("Total: " + total);
            System.out.println("Comisión admin: " + comisionAdmin);
            
            // Crear detalle financiero
            DetalleReserva detalle = DetalleReserva.builder()
                    .reservaId(reservaGuardada.getId())
                    .precioDiaSnapshot(precioDia)
                    .subtotalAlquiler(subtotal)
                    .costoSeguro(seguro)
                    .costoEnvioIda(costoEnvioIda)
                    .costoEnvioVuelta(costoEnvioVuelta)
                    .descuento(descuento)
                    .codigoCupon(null)
                    .cuponId(null)
                    .totalPagado(total)
                    .comisionAdmin(comisionAdmin)
                    .porcentajeComision(porcentajeComision)
                    .depositoSeguridad(herramienta.getDepositoSeguridad() != null 
                            ? herramienta.getDepositoSeguridad() 
                            : BigDecimal.ZERO)
                    .build();
            
            DetalleReserva detalleGuardado = detalleReservaService.crearDetalleReserva(detalle);
            
            System.out.println("✅ Detalle financiero creado exitosamente");
            System.out.println("ID Detalle: " + detalleGuardado.getId());
            
        } catch (Exception e) {
            System.err.println("⚠️ Error al crear detalle financiero: " + e.getMessage());
            e.printStackTrace();
        }
        
        return reservaGuardada;
    }
    
    @Override
    public Reserva actualizarReserva(String id, Reserva reserva) {
        Reserva existente = obtenerReservaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", id));
        
        System.out.println("=== ACTUALIZAR RESERVA ===");
        System.out.println("ID: " + id);
        
        // Actualizar campos permitidos
        if (reserva.getNotasCliente() != null) {
            existente.setNotasCliente(reserva.getNotasCliente());
        }
        if (reserva.getNotasProveedor() != null) {
            existente.setNotasProveedor(reserva.getNotasProveedor());
        }
        if (reserva.getTrackingEnvioIda() != null) {
            existente.setTrackingEnvioIda(reserva.getTrackingEnvioIda());
        }
        if (reserva.getTrackingEnvioVuelta() != null) {
            existente.setTrackingEnvioVuelta(reserva.getTrackingEnvioVuelta());
        }
        if (reserva.getDireccionEnvioId() != null) {
            existente.setDireccionEnvioId(reserva.getDireccionEnvioId());
        }
        
        Reserva actualizada = reservaRepository.save(existente);
        System.out.println("✅ Reserva actualizada exitosamente");
        
        return actualizada;
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
        System.out.println("=== CAMBIAR ESTADO DE RESERVA ===");
        System.out.println("ID: " + id);
        System.out.println("Nuevo estado: " + nuevoEstado);
        
        Reserva reserva = obtenerReservaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", id));
        
        System.out.println("Estado actual: " + reserva.getEstado());
        
        EstadoReserva estadoEnum;
        try {
            estadoEnum = EstadoReserva.valueOf(nuevoEstado);
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Estado inválido: " + nuevoEstado);
        }
        
        reserva.setEstado(estadoEnum);
        
        // Actualizar timestamps según el estado
        switch (estadoEnum) {
            case PAGADA -> {
                reserva.setFechaPago(LocalDateTime.now());
                System.out.println("✅ Estado cambiado a PAGADA - Fecha de pago registrada");
            }
            case CONFIRMADA -> {
                reserva.setFechaConfirmacion(LocalDateTime.now());
                System.out.println("✅ Estado cambiado a CONFIRMADA - Fecha de confirmación registrada");
            }
            case ENVIADA -> {
                reserva.setFechaEnvio(LocalDateTime.now());
                System.out.println("✅ Estado cambiado a ENVIADA - Fecha de envío registrada");
            }
            case ENTREGADA -> {
                reserva.setFechaEntrega(LocalDateTime.now());
                System.out.println("✅ Estado cambiado a ENTREGADA - Fecha de entrega registrada");
            }
            case DEVUELTA -> {
                reserva.setFechaDevolucionReal(LocalDateTime.now());
                System.out.println("✅ Estado cambiado a DEVUELTA - Fecha de devolución registrada");
            }
            case COMPLETADA -> {
                reserva.setFechaCompletada(LocalDateTime.now());
                System.out.println("✅ Estado cambiado a COMPLETADA - Fecha de completado registrada");
            }
            case CANCELADA_CLIENTE, CANCELADA_PROVEEDOR, CANCELADA_SISTEMA -> {
                if (reserva.getFechaCancelacion() == null) {
                    reserva.setFechaCancelacion(LocalDateTime.now());
                }
                System.out.println("✅ Estado cambiado a " + estadoEnum + " - Fecha de cancelación registrada");
            }
            default -> {
                System.out.println("✅ Estado cambiado a " + estadoEnum);
            }
        }
        
        Reserva actualizada = reservaRepository.save(reserva);
        System.out.println("✅ Estado actualizado exitosamente");
        
        return actualizada;
    }

    @Override
    public Reserva completarDevolucion(
            String reservaId,
            String proveedorId,
            Boolean reportarDanos,
            String estadoHerramienta,
            String descripcion,
            List<String> fotos,
            BigDecimal costoReparacionEstimado) {
        Reserva reserva = obtenerReservaPorId(reservaId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", reservaId));

        if (!reserva.getProveedorId().equals(proveedorId)) {
            throw new BusinessException("No puedes completar la devolucion de una reserva de otro proveedor");
        }

        if (reserva.getEstado() == EstadoReserva.COMPLETADA) {
            throw new BusinessException("La reserva ya fue completada");
        }

        if (reserva.getEstado() != EstadoReserva.EN_USO &&
                reserva.getEstado() != EstadoReserva.ENTREGADA &&
                reserva.getEstado() != EstadoReserva.DEVUELTA) {
            throw new BusinessException("Solo se puede completar devolucion para reservas en estado ENTREGADA o EN_USO");
        }

        boolean crearReporteDanos = Boolean.TRUE.equals(reportarDanos);
        if (crearReporteDanos) {
            if (estadoHerramienta == null || estadoHerramienta.isBlank()) {
                throw new ValidationException("Debe especificar el estado de la herramienta para reportar danos");
            }

            String estadoNormalizado = estadoHerramienta.trim().toUpperCase();
            if (!estadoNormalizado.equals("DANADO") &&
                    !estadoNormalizado.equals("PERDIDO") &&
                    !estadoNormalizado.equals("ROBADO")) {
                throw new ValidationException("Para reporte de danos el estado debe ser DANADO, PERDIDO o ROBADO");
            }

            VerificacionDevolucion verificacion = verificacionDevolucionRepository.findByReservaId(reservaId)
                    .orElse(VerificacionDevolucion.builder().reservaId(reservaId).build());
            verificacion.setTipo("RECEPCION_PROVEEDOR");
            verificacion.setEstadoHerramienta(estadoNormalizado);
            verificacion.setDescripcion(descripcion);
            verificacion.setFotos(fotos);
            verificacion.setCostoReparacionEstimado(costoReparacionEstimado != null ? costoReparacionEstimado : BigDecimal.ZERO);
            verificacionDevolucionRepository.save(verificacion);
        }

        LocalDateTime now = LocalDateTime.now();
        reserva.setFechaDevolucionReal(now);
        reserva.setFechaCompletada(now);
        reserva.setEstado(EstadoReserva.COMPLETADA);

        return reservaRepository.save(reserva);
    }

    @Override
    public Reserva solicitarDevolucionCliente(
            String reservaId,
            String clienteId,
            Boolean cancelarAlProveedor,
            String motivo,
            Boolean reportarDanos,
            String estadoHerramienta,
            String descripcion,
            List<String> fotos,
            BigDecimal costoReparacionEstimado) {
        Reserva reserva = obtenerReservaPorId(reservaId)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", reservaId));

        if (!reserva.getClienteId().equals(clienteId)) {
            throw new BusinessException("No puedes gestionar la devolucion de una reserva que no te pertenece");
        }

        if (reserva.getEstado() == EstadoReserva.COMPLETADA) {
            throw new BusinessException("La reserva ya fue completada");
        }

        boolean esCancelacion = Boolean.TRUE.equals(cancelarAlProveedor);
        if (esCancelacion) {
            if (!reserva.puedeCancelarse()) {
                throw new BusinessException("La reserva no puede cancelarse en su estado actual");
            }
            reserva.setEstado(EstadoReserva.CANCELADA_CLIENTE);
            reserva.setMotivoCancelacion(motivo != null ? motivo : "Cancelacion solicitada por cliente");
            reserva.setCanceladoPor(clienteId);
            reserva.setFechaCancelacion(LocalDateTime.now());
            return reservaRepository.save(reserva);
        }

        if (reserva.getEstado() != EstadoReserva.ENTREGADA &&
                reserva.getEstado() != EstadoReserva.EN_USO &&
                reserva.getEstado() != EstadoReserva.DEVUELTA) {
            throw new BusinessException("Solo puedes solicitar devolucion cuando la reserva esta ENTREGADA o EN_USO");
        }

        boolean crearReporteDanos = Boolean.TRUE.equals(reportarDanos);
        if (crearReporteDanos) {
            if (estadoHerramienta == null || estadoHerramienta.isBlank()) {
                throw new ValidationException("Debe especificar el estado de la herramienta para reportar danos");
            }
            String estadoNormalizado = estadoHerramienta.trim().toUpperCase();
            if (!estadoNormalizado.equals("DANADO") &&
                    !estadoNormalizado.equals("PERDIDO") &&
                    !estadoNormalizado.equals("ROBADO") &&
                    !estadoNormalizado.equals("BUENO") &&
                    !estadoNormalizado.equals("PERFECTO")) {
                throw new ValidationException("Estado de herramienta invalido para devolucion");
            }

            VerificacionDevolucion verificacion = verificacionDevolucionRepository.findByReservaId(reservaId)
                    .orElse(VerificacionDevolucion.builder().reservaId(reservaId).build());
            verificacion.setTipo("ENVIO_CLIENTE");
            verificacion.setEstadoHerramienta(estadoNormalizado);
            verificacion.setDescripcion(descripcion != null ? descripcion : motivo);
            verificacion.setFotos(fotos);
            verificacion.setCostoReparacionEstimado(costoReparacionEstimado != null ? costoReparacionEstimado : BigDecimal.ZERO);
            verificacionDevolucionRepository.save(verificacion);
        }

        reserva.setEstado(EstadoReserva.DEVUELTA);
        reserva.setFechaDevolucionReal(LocalDateTime.now());

        if (motivo != null && !motivo.isBlank()) {
            String notasActuales = reserva.getNotasCliente() == null ? "" : reserva.getNotasCliente() + "\n";
            reserva.setNotasCliente(notasActuales + "Solicitud devolucion cliente: " + motivo);
        }

        return reservaRepository.save(reserva);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<VerificacionDevolucion> obtenerVerificacionDevolucion(String reservaId) {
        return verificacionDevolucionRepository.findByReservaId(reservaId);
    }
    
    @Override
    public Reserva cancelarReserva(String id, String motivo, String canceladoPor) {
        System.out.println("=== CANCELAR RESERVA ===");
        System.out.println("ID: " + id);
        System.out.println("Motivo: " + motivo);
        System.out.println("Cancelado por: " + canceladoPor);
        
        Reserva reserva = obtenerReservaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva", "id", id));
        
        System.out.println("Estado actual: " + reserva.getEstado());
        
        // Validar que la reserva pueda ser cancelada
        if (!reserva.puedeCancelarse()) {
            throw new BusinessException("La reserva no puede ser cancelada en su estado actual: " + reserva.getEstado());
        }
        
        reserva.setEstado(EstadoReserva.CANCELADA_CLIENTE);
        reserva.setMotivoCancelacion(motivo);
        reserva.setCanceladoPor(canceladoPor);
        reserva.setFechaCancelacion(LocalDateTime.now());
        
        Reserva cancelada = reservaRepository.save(reserva);
        System.out.println("✅ Reserva cancelada exitosamente");
        
        return cancelada;
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean verificarDisponibilidad(String herramientaId, LocalDate fechaInicio, LocalDate fechaFin) {
        System.out.println("=== VERIFICAR DISPONIBILIDAD ===");
        System.out.println("Herramienta ID: " + herramientaId);
        System.out.println("Fecha inicio: " + fechaInicio);
        System.out.println("Fecha fin: " + fechaFin);
        
        List<Reserva> reservasExistentes = reservaRepository.findByHerramientaId(herramientaId);
        
        System.out.println("Reservas existentes: " + reservasExistentes.size());
        
        // Filtrar solo reservas activas
        List<Reserva> reservasActivas = reservasExistentes.stream()
                .filter(Reserva::isActiva)
                .toList();
        
        System.out.println("Reservas activas: " + reservasActivas.size());
        
        // Verificar si hay solapamiento de fechas
        boolean disponible = reservasActivas.stream()
                .noneMatch(r -> {
                    boolean solapa = !(fechaFin.isBefore(r.getFechaInicio()) || fechaInicio.isAfter(r.getFechaFin()));
                    if (solapa) {
                        System.out.println("❌ Conflicto con reserva: " + r.getNumeroReserva() + 
                                " (" + r.getFechaInicio() + " - " + r.getFechaFin() + ")");
                    }
                    return solapa;
                });
        
        System.out.println(disponible ? "✅ Disponible" : "❌ No disponible");
        
        return disponible;
    }
    
    /**
     * Generar número único de reserva
     * MÉTODO PRIVADO - No forma parte de la interfaz
     */
    private String generarNumeroReserva() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return "RES-" + timestamp;
    }
}
