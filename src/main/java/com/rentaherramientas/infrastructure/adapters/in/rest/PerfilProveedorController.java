package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.request.PerfilProveedorRequest;
import com.rentaherramientas.application.dto.response.PerfilProveedorResponse;
import com.rentaherramientas.domain.model.PerfilProveedor;
import com.rentaherramientas.domain.ports.in.PerfilProveedorUseCase;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.PerfilProveedorDtoMapper;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * REST Controller: Perfil Proveedor
 * Expone los endpoints para gestionar perfiles de proveedor
 */
@RestController
@RequestMapping("/api/perfiles-proveedor")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PerfilProveedorController {
    
    private final PerfilProveedorUseCase perfilProveedorUseCase;
    private final PerfilProveedorDtoMapper mapper;
    
    /**
     * GET /api/perfiles-proveedor
     * Listar todos los perfiles de proveedor
     */
    @GetMapping
    public ResponseEntity<List<PerfilProveedorResponse>> listarPerfiles() {
        List<PerfilProveedorResponse> perfiles = perfilProveedorUseCase.listarPerfilesProveedor()
                .stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(perfiles);
    }
    
    /**
     * GET /api/perfiles-proveedor/{id}
     * Obtener un perfil por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PerfilProveedorResponse> obtenerPerfilPorId(@PathVariable String id) {
        return perfilProveedorUseCase.obtenerPerfilProveedorPorId(id)
                .map(perfil -> ResponseEntity.ok(mapper.toResponse(perfil)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * GET /api/perfiles-proveedor/usuario/{usuarioId}
     * Obtener perfil por usuario ID
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<PerfilProveedorResponse> obtenerPerfilPorUsuarioId(@PathVariable String usuarioId) {
        return perfilProveedorUseCase.obtenerPerfilProveedorPorUsuarioId(usuarioId)
                .map(perfil -> ResponseEntity.ok(mapper.toResponse(perfil)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * POST /api/perfiles-proveedor
     * Crear un nuevo perfil de proveedor
     */
    @PostMapping
    public ResponseEntity<PerfilProveedorResponse> crearPerfilProveedor(
            @Valid @RequestBody PerfilProveedorRequest request) {
        
        PerfilProveedor perfilProveedor = mapper.toDomain(request);
        PerfilProveedor creado = perfilProveedorUseCase.crearPerfilProveedor(perfilProveedor);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(mapper.toResponse(creado));
    }
    
    /**
     * PUT /api/perfiles-proveedor/{id}
     * Actualizar un perfil existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<PerfilProveedorResponse> actualizarPerfil(
            @PathVariable String id,
            @Valid @RequestBody PerfilProveedorRequest request) {
        
        PerfilProveedor perfilProveedor = mapper.toDomain(request);
        PerfilProveedor actualizado = perfilProveedorUseCase.actualizarPerfilProveedor(id, perfilProveedor);
        
        return ResponseEntity.ok(mapper.toResponse(actualizado));
    }
    
    /**
     * DELETE /api/perfiles-proveedor/{id}
     * Eliminar un perfil
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarPerfil(@PathVariable String id) {
        perfilProveedorUseCase.eliminarPerfilProveedor(id);
        return ResponseEntity.noContent().build();
    }
}