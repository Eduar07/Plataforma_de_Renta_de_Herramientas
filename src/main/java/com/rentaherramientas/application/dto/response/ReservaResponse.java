package com.rentaherramientas.application.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * DTO Response: Reserva
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReservaResponse {
    
    private String id;
    private String numeroReserva;
    private String clienteId;
    private String proveedorId;
    private String herramientaId;
    private String instanciaId;
    private String direccionEnvioId;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Integer diasTotales;
    private String estado;
    private LocalDateTime fechaPago;
    private LocalDateTime fechaConfirmacion;
    private LocalDateTime fechaEnvio;
    private LocalDateTime fechaEntrega;
    private LocalDateTime fechaDevolucionProgramada;
    private LocalDateTime fechaDevolucionReal;
    private LocalDateTime fechaCompletada;
    private LocalDateTime fechaCancelacion;
    private String motivoCancelacion;
    private String canceladoPor;
    private String trackingEnvioIda;
    private String trackingEnvioVuelta;
    private String notasCliente;
    private String notasProveedor;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}