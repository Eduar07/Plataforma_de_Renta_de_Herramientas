package com.rentaherramientas.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO Request: Registro de Usuario
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistroRequest {
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe ser válido")
    private String email;
    
    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
    private String password;
    
    @NotBlank(message = "El tipo de usuario es obligatorio")
    @Pattern(regexp = "CLIENTE|PROVEEDOR", message = "El tipo debe ser CLIENTE o PROVEEDOR")
    private String tipo;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;
    
    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100, message = "El apellido no puede exceder 100 caracteres")
    private String apellido;
    
    @NotBlank(message = "El teléfono es obligatorio")
    @Size(max = 20, message = "El teléfono no puede exceder 20 caracteres")
    private String telefono;
    
    private String direccion;
    private String ciudad;
    private String departamento;
    
    @NotBlank(message = "El tipo de documento es obligatorio")
    @Pattern(regexp = "CC|NIT|CE|PASAPORTE", message = "Tipo de documento inválido")
    private String documentoTipo;
    
    @NotBlank(message = "El número de documento es obligatorio")
    @Size(max = 50, message = "El número de documento no puede exceder 50 caracteres")
    private String documentoNumero;
}