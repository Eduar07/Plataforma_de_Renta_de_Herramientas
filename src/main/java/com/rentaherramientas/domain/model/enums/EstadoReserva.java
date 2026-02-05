package com.rentaherramientas.domain.model.enums;

/**
 * Estados del ciclo de vida de una reserva
 */
public enum EstadoReserva {
    PENDIENTE_PAGO,
    PAGADA,
    CONFIRMADA,
    EN_PREPARACION,
    ENVIADA,
    ENTREGADA,
    EN_USO,
    DEVUELTA,
    COMPLETADA,
    CANCELADA_CLIENTE,
    CANCELADA_PROVEEDOR,
    CANCELADA_SISTEMA,
    MORA,
    PERDIDA,
    ROBADA
}