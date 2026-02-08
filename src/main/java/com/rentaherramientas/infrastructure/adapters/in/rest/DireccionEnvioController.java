package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.request.DireccionEnvioRequest;
import com.rentaherramientas.application.dto.response.ApiResponse;
import com.rentaherramientas.application.dto.response.DireccionEnvioResponse;
import com.rentaherramientas.domain.model.DireccionEnvio;
import com.rentaherramientas.domain.ports.in.DireccionEnvioUseCase;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador REST: Direcciones de Envío
 */
@RestController
@RequestMapping("/api/direcciones-envio")
@RequiredArgsConstructor
@Tag(name = "Direcciones de Envío", description = "Gestión de direcciones de envío de los usuarios")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class DireccionEnvioController {
    
    private final DireccionEnvioUseCase direccionEnvioService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Crear nueva dirección de envío")
    public ResponseEntity<ApiResponse<DireccionEnvioResponse>> crearDireccion(
            @Valid @RequestBody DireccionEnvioRequest request) {
        
        try {
            DireccionEnvio direccion = mapearRequestADomain(request);
            DireccionEnvio creada = direccionEnvioService.crearDireccion(direccion);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Dirección creada exitosamente", 
                            mapearDomainAResponse(creada)));
                            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear dirección: " + e.getMessage()));
        }
    }
    
    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROVEEDOR', 'ADMIN')")
    @Operation(summary = "Obtener todas las direcciones de un usuario")
    public ResponseEntity<ApiResponse<List<DireccionEnvioResponse>>> obtenerDireccionesPorUsuario(
            @PathVariable String usuarioId) {
        
        try {
            List<DireccionEnvioResponse> direcciones = direccionEnvioService
                    .obtenerDireccionesPorUsuario(usuarioId)
                    .stream()
                    .map(this::mapearDomainAResponse)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success(direcciones));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener direcciones: " + e.getMessage()));
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROVEEDOR', 'ADMIN')")
    @Operation(summary = "Obtener dirección por ID")
    public ResponseEntity<ApiResponse<DireccionEnvioResponse>> obtenerDireccionPorId(
            @PathVariable String id) {
        
        try {
            DireccionEnvio direccion = direccionEnvioService.obtenerDireccionPorId(id)
                    .orElseThrow(() -> new RuntimeException("Dirección no encontrada"));
            
            return ResponseEntity.ok(ApiResponse.success(mapearDomainAResponse(direccion)));
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener dirección: " + e.getMessage()));
        }
    }
    
    @GetMapping("/usuario/{usuarioId}/predeterminada")
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROVEEDOR', 'ADMIN')")
    @Operation(summary = "Obtener dirección predeterminada de un usuario")
    public ResponseEntity<ApiResponse<DireccionEnvioResponse>> obtenerDireccionPredeterminada(
            @PathVariable String usuarioId) {
        
        try {
            DireccionEnvio direccion = direccionEnvioService.obtenerDireccionPredeterminada(usuarioId)
                    .orElseThrow(() -> new RuntimeException("El usuario no tiene dirección predeterminada"));
            
            return ResponseEntity.ok(ApiResponse.success(mapearDomainAResponse(direccion)));
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener dirección: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Actualizar dirección existente")
    public ResponseEntity<ApiResponse<DireccionEnvioResponse>> actualizarDireccion(
            @PathVariable String id,
            @Valid @RequestBody DireccionEnvioRequest request) {
        
        try {
            DireccionEnvio direccion = mapearRequestADomain(request);
            DireccionEnvio actualizada = direccionEnvioService.actualizarDireccion(id, direccion);
            
            return ResponseEntity.ok(ApiResponse.success("Dirección actualizada", 
                    mapearDomainAResponse(actualizada)));
                    
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar dirección: " + e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/predeterminada")
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Establecer dirección como predeterminada")
    public ResponseEntity<ApiResponse<DireccionEnvioResponse>> establecerComoPredeterminada(
            @PathVariable String id,
            @RequestParam String usuarioId) {
        
        try {
            DireccionEnvio direccion = direccionEnvioService.establecerComoPredeterminada(id, usuarioId);
            
            return ResponseEntity.ok(ApiResponse.success("Dirección establecida como predeterminada", 
                    mapearDomainAResponse(direccion)));
                    
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Eliminar dirección")
    public ResponseEntity<ApiResponse<Void>> eliminarDireccion(@PathVariable String id) {
        try {
            direccionEnvioService.eliminarDireccion(id);
            return ResponseEntity.ok(ApiResponse.success("Dirección eliminada", null));
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar: " + e.getMessage()));
        }
    }
    
    // ========== MÉTODOS DE MAPEO ==========
    
    private DireccionEnvio mapearRequestADomain(DireccionEnvioRequest request) {
        return DireccionEnvio.builder()
                .usuarioId(request.getUsuarioId())
                .alias(request.getAlias())
                .nombreCompleto(request.getNombreCompleto())
                .telefono(request.getTelefono())
                .direccion(request.getDireccion())
                .ciudad(request.getCiudad())
                .departamento(request.getDepartamento())
                .codigoPostal(request.getCodigoPostal())
                .referencia(request.getReferencia())
                .esPredeterminada(request.getEsPredeterminada())
                .build();
    }
    
    private DireccionEnvioResponse mapearDomainAResponse(DireccionEnvio domain) {
        return DireccionEnvioResponse.builder()
                .id(domain.getId())
                .usuarioId(domain.getUsuarioId())
                .alias(domain.getAlias())
                .nombreCompleto(domain.getNombreCompleto())
                .telefono(domain.getTelefono())
                .direccion(domain.getDireccion())
                .ciudad(domain.getCiudad())
                .departamento(domain.getDepartamento())
                .codigoPostal(domain.getCodigoPostal())
                .referencia(domain.getReferencia())
                .esPredeterminada(domain.getEsPredeterminada())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}