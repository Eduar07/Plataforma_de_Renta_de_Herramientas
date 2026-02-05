package com.rentaherramientas.application.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO Response: Usuario
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UsuarioResponse {
    
    private String id;
    private String email;
    private String tipo;
    private String nombre;
    private String apellido;
    private String telefono;
    private String direccion;
    private String ciudad;
    private String departamento;
    private String documentoTipo;
    private String documentoNumero;
    private Integer score;
    private String estado;
    private String razonBloqueo;
    private Integer advertencias;
    private LocalDateTime fechaRegistro;
    private LocalDateTime ultimaActividad;
}