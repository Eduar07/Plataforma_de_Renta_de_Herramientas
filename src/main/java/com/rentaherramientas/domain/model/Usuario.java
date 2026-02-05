package com.rentaherramientas.domain.model;

import com.rentaherramientas.domain.model.enums.EstadoUsuario;
import com.rentaherramientas.domain.model.enums.Rol;
import com.rentaherramientas.domain.model.enums.TipoDocumento;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Modelo de dominio: Usuario
 * Representa a cualquier usuario del sistema (Cliente, Proveedor o Admin)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {
    
    private String id;
    private String email;
    private String passwordHash;
    private Rol tipo;
    private String nombre;
    private String apellido;
    private String telefono;
    private String direccion;
    private String ciudad;
    private String departamento;
    private TipoDocumento documentoTipo;
    private String documentoNumero;
    private Integer score;
    private EstadoUsuario estado;
    private String razonBloqueo;
    private Integer advertencias;
    private LocalDateTime fechaRegistro;
    private LocalDateTime ultimaActividad;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    /**
     * Obtiene el nombre completo del usuario
     */
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
    
    /**
     * Verifica si el usuario está activo
     */
    public boolean isActivo() {
        return EstadoUsuario.ACTIVO.equals(estado);
    }
    
    /**
     * Verifica si el usuario es administrador
     */
    public boolean isAdmin() {
        return Rol.ADMIN.equals(tipo);
    }
    
    /**
     * Verifica si el usuario es proveedor
     */
    public boolean isProveedor() {
        return Rol.PROVEEDOR.equals(tipo);
    }
    
    /**
     * Verifica si el usuario es cliente
     */
    public boolean isCliente() {
        return Rol.CLIENTE.equals(tipo);
    }
}