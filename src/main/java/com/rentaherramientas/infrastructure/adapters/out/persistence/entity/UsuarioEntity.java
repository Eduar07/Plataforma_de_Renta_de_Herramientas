package com.rentaherramientas.infrastructure.adapters.out.persistence.entity;

import com.rentaherramientas.domain.model.enums.EstadoUsuario;
import com.rentaherramientas.domain.model.enums.Rol;
import com.rentaherramientas.domain.model.enums.TipoDocumento;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
// import org.hibernate.annotations.GenericGenerator;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Entidad JPA: Usuario
 */
@Entity
@Table(name = "usuarios")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class UsuarioEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", length = 36, updatable = false, nullable = false)
    private String id;
    
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo", nullable = false)
    private Rol tipo;
    
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;
    
    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;
    
    @Column(name = "telefono", length = 20)
    private String telefono;
    
    @Column(name = "direccion", columnDefinition = "TEXT")
    private String direccion;
    
    @Column(name = "ciudad", length = 100)
    private String ciudad;
    
    @Column(name = "departamento", length = 100)
    private String departamento;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "documento_tipo", nullable = false)
    private TipoDocumento documentoTipo;
    
    @Column(name = "documento_numero", nullable = false, unique = true, length = 50)
    private String documentoNumero;
    
    @Builder.Default
    @Column(name = "score")
    private Integer score = 100;
    
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoUsuario estado = EstadoUsuario.ACTIVO;
    
    @Column(name = "razon_bloqueo", columnDefinition = "TEXT")
    private String razonBloqueo;
    
    @Builder.Default
    @Column(name = "advertencias")
    private Integer advertencias = 0;
    
    @Builder.Default
    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro = LocalDateTime.now();
    
    @Builder.Default
    @Column(name = "ultima_actividad")
    private LocalDateTime ultimaActividad = LocalDateTime.now();
        
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}