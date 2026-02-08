package com.rentaherramientas.application.services;

import com.rentaherramientas.domain.model.UsuarioFavorito;
import com.rentaherramientas.domain.ports.in.UsuarioFavoritoUseCase;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.UsuarioFavoritoEntity;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.UsuarioFavoritoMapper;
import com.rentaherramientas.infrastructure.adapters.out.persistence.repository.UsuarioFavoritoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio: Gestión de Favoritos
 */
@Service
@Transactional
public class UsuarioFavoritoService implements UsuarioFavoritoUseCase {
    
    private final UsuarioFavoritoRepository repository;
    private final UsuarioFavoritoMapper mapper;
    
    // ✅ CONSTRUCTOR MANUAL (para VS Code sin Lombok)
    public UsuarioFavoritoService(
            UsuarioFavoritoRepository repository,
            UsuarioFavoritoMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }
    
    @Override
    public UsuarioFavorito agregarFavorito(String usuarioId, String herramientaId) {
        System.out.println("=== AGREGAR A FAVORITOS ===");
        System.out.println("Usuario ID: " + usuarioId);
        System.out.println("Herramienta ID: " + herramientaId);
        
        // Verificar si ya existe
        if (repository.existsByUsuarioIdAndHerramientaId(usuarioId, herramientaId)) {
            throw new RuntimeException("La herramienta ya está en favoritos");
        }
        
        UsuarioFavorito favorito = UsuarioFavorito.builder()
                .usuarioId(usuarioId)
                .herramientaId(herramientaId)
                .createdAt(LocalDateTime.now())
                .build();
        
        UsuarioFavoritoEntity entity = mapper.toEntity(favorito);
        UsuarioFavoritoEntity guardado = repository.save(entity);
        
        System.out.println("✅ Favorito agregado con ID: " + guardado.getId());
        
        return mapper.toDomain(guardado);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<UsuarioFavorito> obtenerFavoritosPorUsuario(String usuarioId) {
        System.out.println("=== OBTENER FAVORITOS DEL USUARIO ===");
        System.out.println("Usuario ID: " + usuarioId);
        
        List<UsuarioFavorito> favoritos = repository.findByUsuarioIdOrderByCreatedAtDesc(usuarioId)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
        
        System.out.println("✅ Favoritos encontrados: " + favoritos.size());
        
        return favoritos;
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean esFavorito(String usuarioId, String herramientaId) {
        return repository.existsByUsuarioIdAndHerramientaId(usuarioId, herramientaId);
    }
    
    @Override
    public void eliminarFavorito(String id) {
        System.out.println("=== ELIMINAR FAVORITO ===");
        System.out.println("Favorito ID: " + id);
        
        if (!repository.existsById(id)) {
            throw new RuntimeException("Favorito no encontrado con ID: " + id);
        }
        
        repository.deleteById(id);
        
        System.out.println("✅ Favorito eliminado");
    }
    
    @Override
    public void eliminarFavoritoPorUsuarioYHerramienta(String usuarioId, String herramientaId) {
        System.out.println("=== ELIMINAR FAVORITO POR USUARIO Y HERRAMIENTA ===");
        System.out.println("Usuario ID: " + usuarioId);
        System.out.println("Herramienta ID: " + herramientaId);
        
        repository.deleteByUsuarioIdAndHerramientaId(usuarioId, herramientaId);
        
        System.out.println("✅ Favorito eliminado");
    }
}