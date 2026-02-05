package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.request.LoginRequest;
import com.rentaherramientas.application.dto.request.RegistroRequest;
import com.rentaherramientas.application.dto.response.ApiResponse;
import com.rentaherramientas.application.dto.response.AuthResponse;
import com.rentaherramientas.application.dto.response.UsuarioResponse;
import com.rentaherramientas.domain.model.Usuario;
// import com.rentaherramientas.domain.model.enums.EstadoUsuario;
import com.rentaherramientas.domain.model.enums.Rol;
import com.rentaherramientas.domain.model.enums.TipoDocumento;
import com.rentaherramientas.domain.ports.in.UsuarioUseCase;
import com.rentaherramientas.infrastructure.security.JwtTokenProvider;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST: Autenticación
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Endpoints para registro y login")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final UsuarioUseCase usuarioService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/registro")
    @Operation(summary = "Registrar nuevo usuario")
    public ResponseEntity<ApiResponse<AuthResponse>> registro(@Valid @RequestBody RegistroRequest request) {
        // Convertir DTO a modelo de dominio
        Usuario usuario = Usuario.builder()
                .email(request.getEmail())
                .passwordHash(request.getPassword())
                .tipo(Rol.valueOf(request.getTipo()))
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .telefono(request.getTelefono())
                .direccion(request.getDireccion())
                .ciudad(request.getCiudad())
                .departamento(request.getDepartamento())
                .documentoTipo(TipoDocumento.valueOf(request.getDocumentoTipo()))
                .documentoNumero(request.getDocumentoNumero())
                .build();
        
        Usuario usuarioCreado = usuarioService.crearUsuario(usuario);
        
        // Generar token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        String token = jwtTokenProvider.generateToken((UserDetails) authentication.getPrincipal());
        
        // Preparar respuesta
        UsuarioResponse usuarioResponse = mapearUsuarioResponse(usuarioCreado);
        AuthResponse authResponse = AuthResponse.builder()
                .token(token)
                .tipo("Bearer")
                .usuario(usuarioResponse)
                .build();
        
        return ResponseEntity.ok(ApiResponse.success("Usuario registrado exitosamente", authResponse));
    }
    
    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        // Autenticar
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        // Generar token
        String token = jwtTokenProvider.generateToken((UserDetails) authentication.getPrincipal());
        
        // Obtener usuario
        Usuario usuario = usuarioService.obtenerUsuarioPorEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        // Preparar respuesta
        UsuarioResponse usuarioResponse = mapearUsuarioResponse(usuario);
        AuthResponse authResponse = AuthResponse.builder()
                .token(token)
                .tipo("Bearer")
                .usuario(usuarioResponse)
                .build();
        
        return ResponseEntity.ok(ApiResponse.success("Login exitoso", authResponse));
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
                .advertencias(usuario.getAdvertencias())
                .fechaRegistro(usuario.getFechaRegistro())
                .ultimaActividad(usuario.getUltimaActividad())
                .build();
    }
}