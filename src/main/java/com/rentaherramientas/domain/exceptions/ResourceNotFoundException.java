package com.rentaherramientas.domain.exceptions;

/**
 * Excepción cuando no se encuentra un recurso solicitado
 */
public class ResourceNotFoundException extends DomainException {
    
    public ResourceNotFoundException(String message) {
        super(message);
    }
    
    public ResourceNotFoundException(String resourceName, String fieldName, Object fieldValue) {
        super(String.format("%s no encontrado con %s: '%s'", resourceName, fieldName, fieldValue));
    }
}