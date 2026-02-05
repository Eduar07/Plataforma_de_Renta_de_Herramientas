package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.request.HerramientaRequest;
import com.rentaherramientas.application.dto.response.ApiResponse;
import com.rentaherramientas.application.dto.response.HerramientaResponse;
import com.rentaherramientas.domain.model.Herramienta;
import com.rentaherramientas.domain.model.enums.EstadoHerramienta;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controlador REST: Herramienta
 */
@RestController
@RequestMapping("/api/herramientas")
@RequiredArgsConstructor
@Tag(name = "Herramientas", description = "Gestión de herramientas")
@CrossOrigin(origins = "*")
public class HerramientaController {
    
    private final HerramientaUseCase herramientaService;
    
    @GetMapping
    @Operation(summary = "Listar todas las herramientas (público)")
    public ResponseEntity<ApiResponse<List<HerramientaResponse>>> listarHerramientas() {
        List<HerramientaResponse> herramientas = herramientaService.listarHerramientas().stream()
                .filter(h -> h.getEstado() == EstadoHerramienta.ACTIVO)
                .map(this::mapearHerramientaResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(herramientas));
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Obtener herramienta por ID (público)")
    public ResponseEntity<ApiResponse<HerramientaResponse>> obtenerHerramienta(@PathVariable String id) {
        Herramienta herramienta = herramientaService.obtenerHerramientaPorId(id)
                .orElseThrow(() -> new RuntimeException("Herramienta no encontrada"));
        
        // Incrementar vistas
        herramientaService.incrementarVistas(id);
        
        return ResponseEntity.ok(ApiResponse.success(mapearHerramientaResponse(herramienta)));
    }
    
    @GetMapping("/buscar")
    @Operation(summary = "Buscar herramientas por término (público)")
    public ResponseEntity<ApiResponse<List<HerramientaResponse>>> buscarHerramientas(
            @RequestParam String termino) {
        
        List<HerramientaResponse> herramientas = herramientaService.buscarHerramientas(termino).stream()
                .filter(h -> h.getEstado() == EstadoHerramienta.ACTIVO)
                .map(this::mapearHerramientaResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(herramientas));
    }
    
    @GetMapping("/categoria/{categoriaId}")
    @Operation(summary = "Listar herramientas por categoría (público)")
    public ResponseEntity<ApiResponse<List<HerramientaResponse>>> listarPorCategoria(
            @PathVariable String categoriaId) {
        
        List<HerramientaResponse> herramientas = herramientaService.listarHerramientasPorCategoria(categoriaId).stream()
                .filter(h -> h.getEstado() == EstadoHerramienta.ACTIVO)
                .map(this::mapearHerramientaResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(herramientas));
    }
    
    @GetMapping("/proveedor/{proveedorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Listar herramientas por proveedor")
    public ResponseEntity<ApiResponse<List<HerramientaResponse>>> listarPorProveedor(
            @PathVariable String proveedorId) {
        
        List<HerramientaResponse> herramientas = herramientaService.listarHerramientasPorProveedor(proveedorId).stream()
                .map(this::mapearHerramientaResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(ApiResponse.success(herramientas));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('PROVEEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear herramienta (Proveedor)")
    public ResponseEntity<ApiResponse<HerramientaResponse>> crearHerramienta(
            @Valid @RequestBody HerramientaRequest request) {
        
        Herramienta herramienta = mapearHerramientaDomain(request);
        Herramienta creada = herramientaService.crearHerramienta(herramienta);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Herramienta creada exitosamente", mapearHerramientaResponse(creada)));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Actualizar herramienta")
    public ResponseEntity<ApiResponse<HerramientaResponse>> actualizarHerramienta(
            @PathVariable String id,
            @Valid @RequestBody HerramientaRequest request) {
        
        Herramienta herramienta = mapearHerramientaDomain(request);
        Herramienta actualizada = herramientaService.actualizarHerramienta(id, herramienta);
        
        return ResponseEntity.ok(ApiResponse.success("Herramienta actualizada", mapearHerramientaResponse(actualizada)));
    }
    
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Cambiar estado de herramienta")
    public ResponseEntity<ApiResponse<HerramientaResponse>> cambiarEstado(
            @PathVariable String id,
            @RequestParam String estado) {
        
        Herramienta actualizada = herramientaService.cambiarEstado(id, estado);
        return ResponseEntity.ok(ApiResponse.success("Estado actualizado", mapearHerramientaResponse(actualizada)));
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PROVEEDOR')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar herramienta")
    public ResponseEntity<ApiResponse<Void>> eliminarHerramienta(@PathVariable String id) {
        herramientaService.eliminarHerramienta(id);
        return ResponseEntity.ok(ApiResponse.success("Herramienta eliminada", null));
    }
    
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
                .envioIncluido(request.getEnvioIncluido())
                .diasMinimoAlquiler(request.getDiasMinimoAlquiler())
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
                .estado(herramienta.getEstado().name())
                .calificacionPromedio(herramienta.getCalificacionPromedio())
                .totalCalificaciones(herramienta.getTotalCalificaciones())
                .totalAlquileres(herramienta.getTotalAlquileres())
                .vistas(herramienta.getVistas())
                .createdAt(herramienta.getCreatedAt())
                .updatedAt(herramienta.getUpdatedAt())
                .build();
    }
}