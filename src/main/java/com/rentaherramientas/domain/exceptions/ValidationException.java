package com.rentaherramientas.domain.exceptions;

/**
 * Excepción para errores de validación
 */
public class ValidationException extends DomainException {
    
    public ValidationException(String message) {
        super(message);
    }
    
    public ValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}