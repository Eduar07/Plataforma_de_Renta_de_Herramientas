package com.rentaherramientas.domain.exceptions;

/**
 * Excepción base para todas las excepciones de dominio
 */
public class DomainException extends RuntimeException {
    
    public DomainException(String message) {
        super(message);
    }
    
    public DomainException(String message, Throwable cause) {
        super(message, cause);
    }
}