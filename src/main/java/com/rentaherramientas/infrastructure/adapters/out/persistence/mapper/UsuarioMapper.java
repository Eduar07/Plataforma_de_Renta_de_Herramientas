package com.rentaherramientas.infrastructure.adapters.out.persistence.mapper;

import com.rentaherramientas.domain.model.Usuario;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.UsuarioEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper: Usuario Domain <-> UsuarioEntity
 */
@Component
public class UsuarioMapper {
    
    public Usuario toDomain(UsuarioEntity entity) {
        if (entity == null) {
            return null;
        }
        
        return Usuario.builder()
                .id(entity.getId())
                .email(entity.getEmail())
                .passwordHash(entity.getPasswordHash())
                .tipo(entity.getTipo())
                .nombre(entity.getNombre())
                .apellido(entity.getApellido())
                .telefono(entity.getTelefono())
                .direccion(entity.getDireccion())
                .ciudad(entity.getCiudad())
                .departamento(entity.getDepartamento())
                .documentoTipo(entity.getDocumentoTipo())
                .documentoNumero(entity.getDocumentoNumero())
                .score(entity.getScore())
                .estado(entity.getEstado())
                .razonBloqueo(entity.getRazonBloqueo())
                .advertencias(entity.getAdvertencias())
                .fechaRegistro(entity.getFechaRegistro())
                .ultimaActividad(entity.getUltimaActividad())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
    
    public UsuarioEntity toEntity(Usuario domain) {
        if (domain == null) {
            return null;
        }
        
        return UsuarioEntity.builder()
                .id(domain.getId())
                .email(domain.getEmail())
                .passwordHash(domain.getPasswordHash())
                .tipo(domain.getTipo())
                .nombre(domain.getNombre())
                .apellido(domain.getApellido())
                .telefono(domain.getTelefono())
                .direccion(domain.getDireccion())
                .ciudad(domain.getCiudad())
                .departamento(domain.getDepartamento())
                .documentoTipo(domain.getDocumentoTipo())
                .documentoNumero(domain.getDocumentoNumero())
                .score(domain.getScore())
                .estado(domain.getEstado())
                .razonBloqueo(domain.getRazonBloqueo())
                .advertencias(domain.getAdvertencias())
                .fechaRegistro(domain.getFechaRegistro())
                .ultimaActividad(domain.getUltimaActividad())
                .createdAt(domain.getCreatedAt())
                .updatedAt(domain.getUpdatedAt())
                .build();
    }
}