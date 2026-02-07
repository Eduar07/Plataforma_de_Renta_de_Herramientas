package com.rentaherramientas.application.services;

import com.rentaherramientas.domain.exceptions.ResourceNotFoundException;
import com.rentaherramientas.domain.exceptions.ValidationException;
import com.rentaherramientas.domain.model.PerfilProveedor;
import com.rentaherramientas.domain.ports.in.PerfilProveedorUseCase;
import com.rentaherramientas.domain.ports.out.PerfilProveedorRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Servicio de Aplicación: Perfil Proveedor
 * Implementa los casos de uso de Perfil Proveedor
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PerfilProveedorService implements PerfilProveedorUseCase {
    
    private final PerfilProveedorRepositoryPort perfilProveedorRepository;
    
    @Override
    public PerfilProveedor crearPerfilProveedor(PerfilProveedor perfilProveedor) {
        // Validar que no exista un perfil para este usuario
        if (perfilProveedorRepository.existsByUsuarioId(perfilProveedor.getUsuarioId())) {
            throw new ValidationException("Ya existe un perfil de proveedor para este usuario");
        }
        
        return perfilProveedorRepository.save(perfilProveedor);
    }
    
    @Override
    public PerfilProveedor actualizarPerfilProveedor(String id, PerfilProveedor perfilProveedor) {
        PerfilProveedor existente = obtenerPerfilProveedorPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("PerfilProveedor", "id", id));
        
        // Actualizar campos
        existente.setNombreComercial(perfilProveedor.getNombreComercial());
        existente.setMision(perfilProveedor.getMision());
        existente.setVision(perfilProveedor.getVision());
        existente.setLogoUrl(perfilProveedor.getLogoUrl());
        
        return perfilProveedorRepository.save(existente);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<PerfilProveedor> obtenerPerfilProveedorPorId(String id) {
        return perfilProveedorRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<PerfilProveedor> obtenerPerfilProveedorPorUsuarioId(String usuarioId) {
        return perfilProveedorRepository.findByUsuarioId(usuarioId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PerfilProveedor> listarPerfilesProveedor() {
        return perfilProveedorRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<PerfilProveedor> listarPerfilesVerificados(Boolean verificado) {
        return perfilProveedorRepository.findByVerificado(verificado);
    }
    
    @Override
    public void eliminarPerfilProveedor(String id) {
        if (!perfilProveedorRepository.findById(id).isPresent()) {
            throw new ResourceNotFoundException("PerfilProveedor", "id", id);
        }
        perfilProveedorRepository.deleteById(id);
    }
}