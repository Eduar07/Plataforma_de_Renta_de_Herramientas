package com.rentaherramientas.domain.exceptions;

/**
 * Excepción para violaciones de reglas de negocio
 */
public class BusinessException extends DomainException {
    
    public BusinessException(String message) {
        super(message);
    }
    
    public BusinessException(String message, Throwable cause) {
        super(message, cause);
    }
}