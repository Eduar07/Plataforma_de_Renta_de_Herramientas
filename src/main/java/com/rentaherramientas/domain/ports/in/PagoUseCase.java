package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.Pago;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de entrada para casos de uso de Pago
 */
public interface PagoUseCase {
    
    Pago crearPago(Pago pago);
    
    Pago actualizarPago(String id, Pago pago);
    
    Optional<Pago> obtenerPagoPorId(String id);
    
    Optional<Pago> obtenerPagoPorNumeroTransaccion(String numeroTransaccion);
    
    List<Pago> listarPagos();
    
    List<Pago> listarPagosPorCliente(String clienteId);
    
    List<Pago> listarPagosPorReserva(String reservaId);
    
    Pago procesarPago(String id);
    
    Pago confirmarPago(String id, String gatewayTransactionId);
    
    Pago rechazarPago(String id, String motivo);
}