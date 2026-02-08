package com.rentaherramientas.infrastructure.adapters.out.persistence.mapper;

import com.rentaherramientas.domain.model.UsuarioFavorito;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.UsuarioFavoritoEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper: UsuarioFavorito Domain ↔ UsuarioFavoritoEntity JPA
 */
@Component
public class UsuarioFavoritoMapper {
    
    public UsuarioFavorito toDomain(UsuarioFavoritoEntity entity) {
        if (entity == null) return null;
        
        return UsuarioFavorito.builder()
                .id(entity.getId())
                .usuarioId(entity.getUsuarioId())
                .herramientaId(entity.getHerramientaId())
                .createdAt(entity.getCreatedAt())
                .build();
    }
    
    public UsuarioFavoritoEntity toEntity(UsuarioFavorito domain) {
        if (domain == null) return null;
        
        return UsuarioFavoritoEntity.builder()
                .id(domain.getId())
                .usuarioId(domain.getUsuarioId())
                .herramientaId(domain.getHerramientaId())
                .createdAt(domain.getCreatedAt())
                .build();
    }
}