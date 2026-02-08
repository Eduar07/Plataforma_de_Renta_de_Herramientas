package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.request.UsuarioFavoritoRequest;
import com.rentaherramientas.application.dto.response.ApiResponse;
import com.rentaherramientas.application.dto.response.UsuarioFavoritoResponse;
import com.rentaherramientas.domain.model.UsuarioFavorito;
import com.rentaherramientas.domain.ports.in.UsuarioFavoritoUseCase;
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
 * Controlador REST: Favoritos de Usuario
 */
@RestController
@RequestMapping("/api/usuarios-favoritos")
@RequiredArgsConstructor
@Tag(name = "Favoritos", description = "Gestión de herramientas favoritas")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class UsuarioFavoritoController {
    
    private final UsuarioFavoritoUseCase favoritoService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Agregar herramienta a favoritos")
    public ResponseEntity<ApiResponse<UsuarioFavoritoResponse>> agregarFavorito(
            @Valid @RequestBody UsuarioFavoritoRequest request) {
        
        try {
            UsuarioFavorito favorito = favoritoService.agregarFavorito(
                    request.getUsuarioId(), 
                    request.getHerramientaId()
            );
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Agregado a favoritos", mapearResponse(favorito)));
                    
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al agregar a favoritos: " + e.getMessage()));
        }
    }
    
    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROVEEDOR', 'ADMIN')")
    @Operation(summary = "Obtener favoritos de un usuario")
    public ResponseEntity<ApiResponse<List<UsuarioFavoritoResponse>>> obtenerFavoritos(
            @PathVariable String usuarioId) {
        
        try {
            List<UsuarioFavoritoResponse> favoritos = favoritoService
                    .obtenerFavoritosPorUsuario(usuarioId)
                    .stream()
                    .map(this::mapearResponse)
                    .collect(Collectors.toList());
            
            return ResponseEntity.ok(ApiResponse.success(favoritos));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al obtener favoritos: " + e.getMessage()));
        }
    }
    
    @GetMapping("/verificar")
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Verificar si una herramienta está en favoritos")
    public ResponseEntity<ApiResponse<Boolean>> verificarFavorito(
            @RequestParam String usuarioId,
            @RequestParam String herramientaId) {
        
        try {
            boolean esFavorito = favoritoService.esFavorito(usuarioId, herramientaId);
            return ResponseEntity.ok(ApiResponse.success(esFavorito));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al verificar favorito: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('CLIENTE', 'PROVEEDOR')")
    @Operation(summary = "Eliminar de favoritos por ID")
    public ResponseEntity<ApiResponse<Void>> eliminarFavorito(@PathVariable String id) {
        try {
            favoritoService.eliminarFavorito(id);
            return ResponseEntity.ok(ApiResponse.success("Eliminado de favoritos", null));
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar: " + e.getMessage()));
        }
    }
    
    private UsuarioFavoritoResponse mapearResponse(UsuarioFavorito favorito) {
        return UsuarioFavoritoResponse.builder()
                .id(favorito.getId())
                .usuarioId(favorito.getUsuarioId())
                .herramientaId(favorito.getHerramientaId())
                .createdAt(favorito.getCreatedAt())
                .build();
    }
}