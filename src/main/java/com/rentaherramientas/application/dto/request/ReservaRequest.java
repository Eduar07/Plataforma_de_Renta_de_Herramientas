package com.rentaherramientas.application.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO Request: Reserva
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservaRequest {
    
    @NotBlank(message = "El ID del cliente es obligatorio")
    private String clienteId;
    
    @NotBlank(message = "El ID de la herramienta es obligatorio")
    private String herramientaId;
    
    private String direccionEnvioId;
    
    @NotNull(message = "La fecha de inicio es obligatoria")
    @Future(message = "La fecha de inicio debe ser futura")
    private LocalDate fechaInicio;
    
    @NotNull(message = "La fecha de fin es obligatoria")
    @Future(message = "La fecha de fin debe ser futura")
    private LocalDate fechaFin;
    
    private String notasCliente;
}