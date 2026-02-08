package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.request.PerfilProveedorRequest;
import com.rentaherramientas.application.dto.response.ApiResponse;
import com.rentaherramientas.application.dto.response.PerfilProveedorResponse;
import com.rentaherramientas.domain.model.PerfilProveedor;
import com.rentaherramientas.domain.model.enums.EstadoKyc;
import com.rentaherramientas.domain.ports.in.PerfilProveedorUseCase;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.PerfilProveedorDtoMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * REST Controller: Perfil Proveedor
 */
@RestController
@RequestMapping("/api/perfiles-proveedor")
@Tag(name = "Perfiles de Proveedor", description = "Gestión de perfiles de proveedores")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class PerfilProveedorController {
    
    private final PerfilProveedorUseCase perfilProveedorUseCase;
    private final PerfilProveedorDtoMapper mapper;
    
    // Constructor manual
    public PerfilProveedorController(
            PerfilProveedorUseCase perfilProveedorUseCase,
            PerfilProveedorDtoMapper mapper) {
        this.perfilProveedorUseCase = perfilProveedorUseCase;
        this.mapper = mapper;
    }
    
    @GetMapping
    @Operation(summary = "Listar todos los perfiles de proveedor")
    public ResponseEntity<ApiResponse<List<PerfilProveedorResponse>>> listarPerfiles() {
        try {
            List<PerfilProveedorResponse> perfiles = perfilProveedorUseCase.listarPerfilesProveedor()
                    .stream()
                    .map(mapper::toResponse)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success(perfiles));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al listar perfiles: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener perfil por ID")
    public ResponseEntity<ApiResponse<PerfilProveedorResponse>> obtenerPerfilPorId(@PathVariable String id) {
        try {
            PerfilProveedor perfil = perfilProveedorUseCase.obtenerPerfilProveedorPorId(id)
                    .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
            
            return ResponseEntity.ok(ApiResponse.success(mapper.toResponse(perfil)));
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener perfil: " + e.getMessage()));
        }
    }
    
    @GetMapping("/usuario/{usuarioId}")
    @Operation(summary = "Obtener perfil por usuario ID")
    public ResponseEntity<ApiResponse<PerfilProveedorResponse>> obtenerPerfilPorUsuarioId(
            @PathVariable String usuarioId) {
        
        try {
            System.out.println("=== OBTENER PERFIL POR USUARIO - CONTROLLER ===");
            System.out.println("Usuario ID: " + usuarioId);
            
            PerfilProveedor perfil = perfilProveedorUseCase.obtenerPerfilProveedorPorUsuarioId(usuarioId)
                    .orElseThrow(() -> new RuntimeException("No existe perfil para este usuario"));
            
            return ResponseEntity.ok(ApiResponse.success(mapper.toResponse(perfil)));
            
        } catch (RuntimeException e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error inesperado: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener perfil: " + e.getMessage()));
        }
    }
    
    @PostMapping
    @PreAuthorize("hasRole('PROVEEDOR')")
    @Operation(summary = "Crear perfil de proveedor")
    public ResponseEntity<ApiResponse<PerfilProveedorResponse>> crearPerfilProveedor(
            @Valid @RequestBody PerfilProveedorRequest request,
            @RequestParam String usuarioId) {
        
        try {
            System.out.println("=== CREAR PERFIL - CONTROLLER ===");
            System.out.println("Usuario ID: " + usuarioId);
            System.out.println("Nombre Comercial: " + request.getNombreComercial());
            
            // Convertir Request → Domain
            PerfilProveedor perfil = mapper.toDomain(request);
            
            // ✅ SETEAR CAMPOS OBLIGATORIOS AQUÍ (no en el mapper)
            perfil.setId(UUID.randomUUID().toString());
            perfil.setUsuarioId(usuarioId);
            perfil.setCalificacionPromedio(0.0);
            perfil.setTotalCalificaciones(0);
            perfil.setEstadoKyc(EstadoKyc.PENDIENTE);
            perfil.setVerificado(false);
            
            PerfilProveedor creado = perfilProveedorUseCase.crearPerfilProveedor(perfil);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Perfil creado exitosamente", mapper.toResponse(creado)));
                    
        } catch (RuntimeException e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error inesperado: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear perfil: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('PROVEEDOR', 'ADMIN')")
    @Operation(summary = "Actualizar perfil de proveedor")
    public ResponseEntity<ApiResponse<PerfilProveedorResponse>> actualizarPerfil(
            @PathVariable String id,
            @Valid @RequestBody PerfilProveedorRequest request) {
        
        try {
            System.out.println("=== ACTUALIZAR PERFIL - CONTROLLER ===");
            System.out.println("ID: " + id);
            
            PerfilProveedor perfil = mapper.toDomain(request);
            PerfilProveedor actualizado = perfilProveedorUseCase.actualizarPerfilProveedor(id, perfil);
            
            return ResponseEntity.ok(
                    ApiResponse.success("Perfil actualizado exitosamente", mapper.toResponse(actualizado)));
                    
        } catch (RuntimeException e) {
            System.err.println("❌ Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Error inesperado: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar perfil: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Eliminar perfil de proveedor (Admin)")
    public ResponseEntity<ApiResponse<Void>> eliminarPerfil(@PathVariable String id) {
        try {
            perfilProveedorUseCase.eliminarPerfilProveedor(id);
            return ResponseEntity.ok(ApiResponse.success("Perfil eliminado exitosamente", null));
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar perfil: " + e.getMessage()));
        }
    }
}