package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.request.HerramientaRequest;
import com.rentaherramientas.application.dto.response.ApiResponse;
import com.rentaherramientas.application.dto.response.HerramientaResponse;
import com.rentaherramientas.domain.model.Herramienta;
import com.rentaherramientas.domain.ports.in.HerramientaUseCase;
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
 * Controlador REST: Herramienta
 */
@RestController
@RequestMapping("/api/herramientas")
@RequiredArgsConstructor
@Tag(name = "Herramientas", description = "Gestión de herramientas")
@SecurityRequirement(name = "bearerAuth")
@CrossOrigin(origins = "*")
public class HerramientaController {
    
    private final HerramientaUseCase herramientaService;
    
    @GetMapping
    @Operation(summary = "Listar todas las herramientas (público)")
    public ResponseEntity<ApiResponse<List<HerramientaResponse>>> listarHerramientas() {
        List<HerramientaResponse> herramientas = herramientaService.listarHerramientas().stream()
                .map(this::mapearHerramientaResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(herramientas));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener herramienta por ID (público)")
    public ResponseEntity<ApiResponse<HerramientaResponse>> obtenerHerramienta(@PathVariable String id) {
        Herramienta herramienta = herramientaService.obtenerHerramientaPorId(id)
                .orElseThrow(() -> new RuntimeException("Herramienta no encontrada"));
        
        return ResponseEntity.ok(ApiResponse.success(mapearHerramientaResponse(herramienta)));
    }
    
    // ========== ✅ NUEVO MÉTODO: LISTAR POR PROVEEDOR (USUARIO_ID) ==========
    @GetMapping("/proveedor/{proveedorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @Operation(summary = "Listar herramientas por proveedor (acepta usuario_id o perfil_proveedor_id)")
    public ResponseEntity<ApiResponse<List<HerramientaResponse>>> listarPorProveedor(@PathVariable String proveedorId) {
        try {
            System.out.println("=== LISTAR HERRAMIENTAS POR PROVEEDOR ===");
            System.out.println("Proveedor ID recibido: " + proveedorId);
            
            // Listar todas las herramientas del proveedor
            List<HerramientaResponse> herramientas = herramientaService.listarHerramientasPorProveedor(proveedorId).stream()
                    .map(this::mapearHerramientaResponse)
                    .collect(Collectors.toList());
            
            System.out.println("Herramientas encontradas: " + herramientas.size());
            
            return ResponseEntity.ok(ApiResponse.success(herramientas));
            
        } catch (Exception e) {
            System.err.println("Error al listar herramientas: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al listar herramientas: " + e.getMessage()));
        }
    }
    
    @GetMapping("/categoria/{categoriaId}")
    @Operation(summary = "Listar herramientas por categoría (público)")
    public ResponseEntity<ApiResponse<List<HerramientaResponse>>> listarPorCategoria(@PathVariable String categoriaId) {
        List<HerramientaResponse> herramientas = herramientaService.listarHerramientasPorCategoria(categoriaId).stream()
                .map(this::mapearHerramientaResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(herramientas));
    }
    
    @GetMapping("/estado/{estado}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar herramientas por estado (Admin)")
    public ResponseEntity<ApiResponse<List<HerramientaResponse>>> listarPorEstado(@PathVariable String estado) {
        List<HerramientaResponse> herramientas = herramientaService.listarHerramientasPorEstado(estado).stream()
                .map(this::mapearHerramientaResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(herramientas));
    }
    
    // ========== MÉTODO CORREGIDO PARA CREAR HERRAMIENTA ==========
    @PostMapping
    @PreAuthorize("hasRole('PROVEEDOR')")
    @Operation(summary = "Crear herramienta (Proveedor)")
    public ResponseEntity<ApiResponse<HerramientaResponse>> crearHerramienta(
            @Valid @RequestBody HerramientaRequest request) {
        
        try {
            // Log para debugging
            System.out.println("=== CREAR HERRAMIENTA ===");
            System.out.println("Request recibido: " + request);
            System.out.println("Proveedor ID: " + request.getProveedorId());
            System.out.println("Categoria ID: " + request.getCategoriaId());
            
            // Validar que proveedorId no sea null
            if (request.getProveedorId() == null || request.getProveedorId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("El ID del proveedor es obligatorio"));
            }
            
            // Validar que categoriaId no sea null
            if (request.getCategoriaId() == null || request.getCategoriaId().trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("El ID de la categoría es obligatorio"));
            }
            
            // Mapear el DTO al dominio
            Herramienta herramienta = mapearHerramientaDomain(request);
            
            System.out.println("Herramienta mapeada: " + herramienta);
            System.out.println("Proveedor ID en herramienta: " + herramienta.getProveedorId());
            System.out.println("Categoria ID en herramienta: " + herramienta.getCategoriaId());
            
            // Crear la herramienta
            Herramienta creada = herramientaService.crearHerramienta(herramienta);
            
            System.out.println("Herramienta creada exitosamente con ID: " + creada.getId());
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Herramienta creada exitosamente", 
                            mapearHerramientaResponse(creada)));
            
        } catch (IllegalArgumentException e) {
            System.err.println("Error de validación: " + e.getMessage());
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error de validación: " + e.getMessage()));
                    
        } catch (RuntimeException e) {
            System.err.println("Error al crear herramienta: " + e.getMessage());
            e.printStackTrace();
            
            // Verificar si es un error de foreign key
            String errorMessage = e.getMessage() != null ? e.getMessage().toLowerCase() : "";
            
            if (errorMessage.contains("foreign key") || errorMessage.contains("constraint")) {
                if (errorMessage.contains("proveedor") || errorMessage.contains("usuario")) {
                    return ResponseEntity.badRequest()
                            .body(ApiResponse.error(
                                "El proveedor especificado no existe en el sistema. " +
                                "Verifica que tu cuenta esté correctamente registrada como PROVEEDOR."));
                } else if (errorMessage.contains("categoria")) {
                    return ResponseEntity.badRequest()
                            .body(ApiResponse.error(
                                "La categoría especificada no existe en el sistema. " +
                                "Por favor selecciona una categoría válida."));
                }
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al crear la herramienta: " + e.getMessage()));
                    
        } catch (Exception e) {
            System.err.println("Error inesperado: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error inesperado: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @Operation(summary = "Actualizar herramienta")
    public ResponseEntity<ApiResponse<HerramientaResponse>> actualizarHerramienta(
            @PathVariable String id,
            @Valid @RequestBody HerramientaRequest request) {
        
        try {
            System.out.println("=== ACTUALIZAR HERRAMIENTA ===");
            System.out.println("ID: " + id);
            System.out.println("Request: " + request);
            
            Herramienta herramienta = mapearHerramientaDomain(request);
            herramienta.setId(id);
            
            Herramienta actualizada = herramientaService.actualizarHerramienta(id, herramienta);
            
            System.out.println("Herramienta actualizada exitosamente");
            
            return ResponseEntity.ok(ApiResponse.success("Herramienta actualizada", 
                    mapearHerramientaResponse(actualizada)));
                    
        } catch (Exception e) {
            System.err.println("Error al actualizar herramienta: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al actualizar: " + e.getMessage()));
        }
    }
    
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @Operation(summary = "Cambiar estado de herramienta")
    public ResponseEntity<ApiResponse<HerramientaResponse>> cambiarEstado(
            @PathVariable String id,
            @RequestParam String estado) {
        
        try {
            System.out.println("=== CAMBIAR ESTADO HERRAMIENTA ===");
            System.out.println("ID: " + id);
            System.out.println("Nuevo estado: " + estado);
            
            // Validar que el estado sea válido
            if (!estado.matches("ACTIVO|PAUSADO|ELIMINADO")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Estado inválido. Valores permitidos: ACTIVO, PAUSADO, ELIMINADO"));
            }
            
            Herramienta actualizada = herramientaService.cambiarEstado(id, estado);
            
            System.out.println("Estado cambiado exitosamente a: " + actualizada.getEstado());
            
            return ResponseEntity.ok(ApiResponse.success("Estado actualizado a " + estado, 
                    mapearHerramientaResponse(actualizada)));
                    
        } catch (RuntimeException e) {
            System.err.println("Error al cambiar estado: " + e.getMessage());
            e.printStackTrace();
            
            if (e.getMessage() != null && e.getMessage().contains("no encontrada")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Herramienta no encontrada"));
            }
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al cambiar estado: " + e.getMessage()));
                    
        } catch (Exception e) {
            System.err.println("Error inesperado: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error inesperado: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @Operation(summary = "Eliminar herramienta (cambia estado a ELIMINADO)")
    public ResponseEntity<ApiResponse<Void>> eliminarHerramienta(@PathVariable String id) {
        try {
            System.out.println("=== ELIMINAR HERRAMIENTA ===");
            System.out.println("ID: " + id);
            
            herramientaService.eliminarHerramienta(id);
            
            System.out.println("Herramienta eliminada (estado cambiado a ELIMINADO)");
            
            return ResponseEntity.ok(ApiResponse.success("Herramienta eliminada", null));
            
        } catch (Exception e) {
            System.err.println("Error al eliminar: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Error al eliminar: " + e.getMessage()));
        }
    }
    
    // ========== MÉTODOS DE MAPEO ==========
    private Herramienta mapearHerramientaDomain(HerramientaRequest request) {
        return Herramienta.builder()
                .proveedorId(request.getProveedorId())
                .categoriaId(request.getCategoriaId())
                .nombre(request.getNombre())
                .marca(request.getMarca())
                .modelo(request.getModelo())
                .sku(request.getSku())
                .descripcion(request.getDescripcion())
                .fotos(request.getFotos())
                .precioBaseDia(request.getPrecioBaseDia())
                .envioIncluido(request.getEnvioIncluido() != null ? request.getEnvioIncluido() : false)
                .diasMinimoAlquiler(request.getDiasMinimoAlquiler() != null ? request.getDiasMinimoAlquiler() : 1)
                .diasMaximoAlquiler(request.getDiasMaximoAlquiler())
                .depositoSeguridad(request.getDepositoSeguridad())
                .build();
    }
    
    private HerramientaResponse mapearHerramientaResponse(Herramienta herramienta) {
        return HerramientaResponse.builder()
                .id(herramienta.getId())
                .proveedorId(herramienta.getProveedorId())
                .categoriaId(herramienta.getCategoriaId())
                .nombre(herramienta.getNombre())
                .marca(herramienta.getMarca())
                .modelo(herramienta.getModelo())
                .sku(herramienta.getSku())
                .descripcion(herramienta.getDescripcion())
                .fotos(herramienta.getFotos())
                .precioBaseDia(herramienta.getPrecioBaseDia())
                .envioIncluido(herramienta.getEnvioIncluido())
                .diasMinimoAlquiler(herramienta.getDiasMinimoAlquiler())
                .diasMaximoAlquiler(herramienta.getDiasMaximoAlquiler())
                .depositoSeguridad(herramienta.getDepositoSeguridad())
                .estado(herramienta.getEstado() != null ? herramienta.getEstado().name() : null)
                .calificacionPromedio(herramienta.getCalificacionPromedio())
                .totalCalificaciones(herramienta.getTotalCalificaciones())
                .totalAlquileres(herramienta.getTotalAlquileres())
                .vistas(herramienta.getVistas())
                .createdAt(herramienta.getCreatedAt())
                .updatedAt(herramienta.getUpdatedAt())
                .build();
    }
}