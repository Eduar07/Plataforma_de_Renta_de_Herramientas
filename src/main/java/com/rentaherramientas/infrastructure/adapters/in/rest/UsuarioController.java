package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.response.ApiResponse;
import com.rentaherramientas.application.dto.response.UsuarioResponse;
import com.rentaherramientas.domain.model.Usuario;
import com.rentaherramientas.domain.ports.in.UsuarioUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador REST: Usuario
 */
@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Gestión de usuarios")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class UsuarioController {
    
    private final UsuarioUseCase usuarioService;
    
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar todos los usuarios (Admin)")
    public ResponseEntity<ApiResponse<List<UsuarioResponse>>> listarUsuarios() {
        List<UsuarioResponse> usuarios = usuarioService.listarUsuarios().stream()
                .map(this::mapearUsuarioResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(usuarios));
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Obtener usuario por ID")
    public ResponseEntity<ApiResponse<UsuarioResponse>> obtenerUsuario(@PathVariable String id) {
        Usuario usuario = usuarioService.obtenerUsuarioPorId(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        return ResponseEntity.ok(ApiResponse.success(mapearUsuarioResponse(usuario)));
    }
    
    @GetMapping("/tipo/{tipo}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar usuarios por tipo (Admin)")
    public ResponseEntity<ApiResponse<List<UsuarioResponse>>> listarPorTipo(@PathVariable String tipo) {
        List<UsuarioResponse> usuarios = usuarioService.listarUsuariosPorTipo(tipo).stream()
                .map(this::mapearUsuarioResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(usuarios));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Actualizar usuario")
    public ResponseEntity<ApiResponse<UsuarioResponse>> actualizarUsuario(
            @PathVariable String id,
            @RequestBody Usuario usuario) {
        
        Usuario actualizado = usuarioService.actualizarUsuario(id, usuario);
        return ResponseEntity.ok(ApiResponse.success("Usuario actualizado", mapearUsuarioResponse(actualizado)));
    }
    
    @PostMapping("/{id}/bloquear")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Bloquear usuario (Admin)")
    public ResponseEntity<ApiResponse<UsuarioResponse>> bloquearUsuario(
            @PathVariable String id,
            @RequestParam String razon) {
        
        Usuario bloqueado = usuarioService.bloquearUsuario(id, razon);
        return ResponseEntity.ok(ApiResponse.success("Usuario bloqueado", mapearUsuarioResponse(bloqueado)));
    }
    
    @PostMapping("/{id}/desbloquear")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Desbloquear usuario (Admin)")
    public ResponseEntity<ApiResponse<UsuarioResponse>> desbloquearUsuario(@PathVariable String id) {
        Usuario desbloqueado = usuarioService.desbloquearUsuario(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario desbloqueado", mapearUsuarioResponse(desbloqueado)));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar usuario (Admin)")
    public ResponseEntity<ApiResponse<Void>> eliminarUsuario(@PathVariable String id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.ok(ApiResponse.success("Usuario eliminado exitosamente", null));
    }
    
    @PostMapping("/{id}/cambiar-password")
    @PreAuthorize("hasAnyRole('ADMIN', 'CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Cambiar contraseña")
    public ResponseEntity<ApiResponse<Void>> cambiarPassword(
            @PathVariable String id,
            @RequestParam String passwordActual,
            @RequestParam String passwordNuevo) {
        
        usuarioService.cambiarPassword(id, passwordActual, passwordNuevo);
        return ResponseEntity.ok(ApiResponse.success("Contraseña actualizada", null));
    }
    
    private UsuarioResponse mapearUsuarioResponse(Usuario usuario) {
        return UsuarioResponse.builder()
                .id(usuario.getId())
                .email(usuario.getEmail())
                .tipo(usuario.getTipo().name())
                .nombre(usuario.getNombre())
                .apellido(usuario.getApellido())
                .telefono(usuario.getTelefono())
                .direccion(usuario.getDireccion())
                .ciudad(usuario.getCiudad())
                .departamento(usuario.getDepartamento())
                .documentoTipo(usuario.getDocumentoTipo().name())
                .documentoNumero(usuario.getDocumentoNumero())
                .score(usuario.getScore())
                .estado(usuario.getEstado().name())
                .razonBloqueo(usuario.getRazonBloqueo())
                .advertencias(usuario.getAdvertencias())
                .fechaRegistro(usuario.getFechaRegistro())
                .ultimaActividad(usuario.getUltimaActividad())
                .build();
    }
}