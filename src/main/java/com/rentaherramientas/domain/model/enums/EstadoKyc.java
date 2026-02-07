package com.rentaherramientas.domain.model.enums;

/**
 * Enum: Estado KYC (Know Your Customer)
 * Estados posibles para la verificación de identidad del proveedor
 */
public enum EstadoKyc {
    PENDIENTE,   // No ha enviado documentos
    APROBADO,    // Verificado exitosamente
    RECHAZADO    // Documentos rechazados
}