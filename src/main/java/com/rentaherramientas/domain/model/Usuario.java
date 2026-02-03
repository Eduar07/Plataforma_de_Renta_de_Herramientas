package com.rentaherramientas.domain.model;

import com.rentaherramientas.domain.model.enums.Rol;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    private Long id;
    private String username;
    private String email;
    private String password;
    private String nombreCompleto;
    private String telefono;
    private String direccion;
    private String ciudad;
    private String documento;
    private Rol rol;
    private Boolean activo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}