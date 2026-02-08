package com.rentaherramientas.application.services;

import com.rentaherramientas.domain.exceptions.BusinessException;
import com.rentaherramientas.domain.exceptions.ResourceNotFoundException;
import com.rentaherramientas.domain.exceptions.ValidationException;
import com.rentaherramientas.domain.model.PerfilProveedor;
import com.rentaherramientas.domain.model.Usuario;
import com.rentaherramientas.domain.model.enums.EstadoKyc;
import com.rentaherramientas.domain.model.enums.EstadoUsuario;
import com.rentaherramientas.domain.model.enums.Rol;
import com.rentaherramientas.domain.ports.in.UsuarioUseCase;
import com.rentaherramientas.domain.ports.out.PerfilProveedorRepositoryPort;
import com.rentaherramientas.domain.ports.out.UsuarioRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Servicio de Aplicación: Usuario
 * Implementa los casos de uso de Usuario
 */
@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioService implements UsuarioUseCase {
    
    private final UsuarioRepositoryPort usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final PerfilProveedorRepositoryPort perfilProveedorRepository;
    
    @Override
    public Usuario crearUsuario(Usuario usuario) {
        System.out.println("=== CREAR USUARIO - INICIO ===");
        System.out.println("Email: " + usuario.getEmail());
        System.out.println("Tipo: " + usuario.getTipo());
        
        // Validaciones
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new ValidationException("El email ya está registrado");
        }
        
        if (usuarioRepository.existsByDocumentoNumero(usuario.getDocumentoNumero())) {
            throw new ValidationException("El número de documento ya está registrado");
        }
        
        // Encriptar password
        usuario.setPasswordHash(passwordEncoder.encode(usuario.getPasswordHash()));
        
        // Valores por defecto
        usuario.setScore(100);
        usuario.setEstado(EstadoUsuario.ACTIVO);
        usuario.setAdvertencias(0);
        usuario.setFechaRegistro(LocalDateTime.now());
        usuario.setUltimaActividad(LocalDateTime.now());
        
        // Guardar usuario
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        System.out.println("✅ Usuario guardado con ID: " + usuarioGuardado.getId());
        
        // ✅ SI ES PROVEEDOR, CREAR AUTOMÁTICAMENTE SU PERFIL
        if (usuario.getTipo() == Rol.PROVEEDOR) {
            System.out.println("⚙️ Usuario es PROVEEDOR, creando perfil automáticamente...");
            crearPerfilProveedorAutomatico(usuarioGuardado);
        }
        
        return usuarioGuardado;
    }
    
    /**
     * ✅ MÉTODO PRIVADO: Crear perfil de proveedor automáticamente
     */
    private void crearPerfilProveedorAutomatico(Usuario usuario) {
        try {
            // Verificar si ya existe un perfil
            Optional<PerfilProveedor> perfilExistente = perfilProveedorRepository.findByUsuarioId(usuario.getId());
            
            if (perfilExistente.isPresent()) {
                System.out.println("⚠️ El usuario ya tiene un perfil de proveedor");
                return;
            }
            
            // Crear perfil nuevo
            PerfilProveedor perfil = PerfilProveedor.builder()
                    .id(UUID.randomUUID().toString())
                    .usuarioId(usuario.getId())
                    .nombreComercial(usuario.getNombre() + " " + usuario.getApellido())
                    .mision("Proveedor de herramientas de calidad")
                    .vision("Ser un proveedor confiable en la plataforma")
                    .calificacionPromedio(Double.valueOf(0.0))  // ✅ CORRECCIÓN: Conversión explícita
                    .totalCalificaciones(0)
                    .estadoKyc(EstadoKyc.PENDIENTE)
                    .verificado(false)
                    .build();

            PerfilProveedor perfilGuardado = perfilProveedorRepository.save(perfil);
            
            System.out.println("✅ Perfil de proveedor creado automáticamente");
            System.out.println("   - ID Perfil: " + perfilGuardado.getId());
            System.out.println("   - Usuario ID: " + perfilGuardado.getUsuarioId());
            System.out.println("   - Nombre Comercial: " + perfilGuardado.getNombreComercial());
            
        } catch (Exception e) {
            System.err.println("❌ Error al crear perfil de proveedor automático: " + e.getMessage());
            e.printStackTrace();
            // No lanzar excepción para que el registro de usuario no falle
        }
    }
    
    @Override
    public Usuario actualizarUsuario(String id, Usuario usuario) {
        Usuario existente = obtenerUsuarioPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
        
        // Validar email único si cambió
        if (!existente.getEmail().equals(usuario.getEmail()) && 
            usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new ValidationException("El email ya está registrado");
        }
        
        // Actualizar campos
        existente.setNombre(usuario.getNombre());
        existente.setApellido(usuario.getApellido());
        existente.setTelefono(usuario.getTelefono());
        existente.setDireccion(usuario.getDireccion());
        existente.setCiudad(usuario.getCiudad());
        existente.setDepartamento(usuario.getDepartamento());
        existente.setUltimaActividad(LocalDateTime.now());
        
        return usuarioRepository.save(existente);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorId(String id) {
        return usuarioRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Usuario> listarUsuariosPorTipo(String tipo) {
        return usuarioRepository.findByTipo(Rol.valueOf(tipo));
    }
    
    @Override
    public void eliminarUsuario(String id) {
        if (!usuarioRepository.findById(id).isPresent()) {
            throw new ResourceNotFoundException("Usuario", "id", id);
        }
        usuarioRepository.deleteById(id);
    }
    
    @Override
    public Usuario bloquearUsuario(String id, String razon) {
        Usuario usuario = obtenerUsuarioPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
        
        usuario.setEstado(EstadoUsuario.BLOQUEADO);
        usuario.setRazonBloqueo(razon);
        
        return usuarioRepository.save(usuario);
    }
    
    @Override
    public Usuario desbloquearUsuario(String id) {
        Usuario usuario = obtenerUsuarioPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
        
        usuario.setEstado(EstadoUsuario.ACTIVO);
        usuario.setRazonBloqueo(null);
        
        return usuarioRepository.save(usuario);
    }
    
    @Override
    public void cambiarPassword(String id, String passwordActual, String passwordNuevo) {
        Usuario usuario = obtenerUsuarioPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "id", id));
        
        if (!passwordEncoder.matches(passwordActual, usuario.getPasswordHash())) {
            throw new BusinessException("La contraseña actual es incorrecta");
        }
        
        usuario.setPasswordHash(passwordEncoder.encode(passwordNuevo));
        usuarioRepository.save(usuario);
    }
}