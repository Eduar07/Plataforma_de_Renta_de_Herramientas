package com.rentaherramientas.application.services;

import com.rentaherramientas.domain.model.DireccionEnvio;
import com.rentaherramientas.domain.ports.in.DireccionEnvioUseCase;
import com.rentaherramientas.infrastructure.adapters.out.persistence.entity.DireccionEnvioEntity;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.DireccionEnvioMapper;
import com.rentaherramientas.infrastructure.adapters.out.persistence.repository.DireccionEnvioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Servicio: Gestión de Direcciones de Envío
 */
@Service
@RequiredArgsConstructor
public class DireccionEnvioService implements DireccionEnvioUseCase {
    
    private final DireccionEnvioRepository repository;
    private final DireccionEnvioMapper mapper;
    
    @Override
    @Transactional
    public DireccionEnvio crearDireccion(DireccionEnvio direccion) {
        // Si esta dirección se marca como predeterminada, quitar la marca de las demás
        if (Boolean.TRUE.equals(direccion.getEsPredeterminada())) {
            repository.quitarPredeterminadaDeTodasLasDirecciones(direccion.getUsuarioId());
        }
        
        // Si es la primera dirección del usuario, marcarla como predeterminada automáticamente
        if (!repository.existsByUsuarioIdAndEsPredeterminadaTrue(direccion.getUsuarioId())) {
            direccion.setEsPredeterminada(true);
        }
        
        direccion.setCreatedAt(LocalDateTime.now());
        direccion.setUpdatedAt(LocalDateTime.now());
        
        DireccionEnvioEntity entity = mapper.toEntity(direccion);
        DireccionEnvioEntity guardada = repository.save(entity);
        
        return mapper.toDomain(guardada);
    }
    
    @Override
    public List<DireccionEnvio> obtenerDireccionesPorUsuario(String usuarioId) {
        return repository.findByUsuarioIdOrderByEsPredeterminadaDescCreatedAtDesc(usuarioId)
                .stream()
                .map(mapper::toDomain)
                .collect(Collectors.toList());
    }
    
    @Override
    public Optional<DireccionEnvio> obtenerDireccionPorId(String id) {
        return repository.findById(id)
                .map(mapper::toDomain);
    }
    
    @Override
    public Optional<DireccionEnvio> obtenerDireccionPredeterminada(String usuarioId) {
        return repository.findByUsuarioIdAndEsPredeterminadaTrue(usuarioId)
                .map(mapper::toDomain);
    }
    
    @Override
    @Transactional
    public DireccionEnvio actualizarDireccion(String id, DireccionEnvio direccion) {
        DireccionEnvioEntity existente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada con ID: " + id));
        
        // Si se está estableciendo como predeterminada, quitar la marca de las demás
        if (Boolean.TRUE.equals(direccion.getEsPredeterminada()) && 
            !Boolean.TRUE.equals(existente.getEsPredeterminada())) {
            repository.quitarPredeterminadaDeTodasLasDirecciones(existente.getUsuarioId());
        }
        
        // Actualizar campos
        existente.setAlias(direccion.getAlias());
        existente.setNombreCompleto(direccion.getNombreCompleto());
        existente.setTelefono(direccion.getTelefono());
        existente.setDireccion(direccion.getDireccion());
        existente.setCiudad(direccion.getCiudad());
        existente.setDepartamento(direccion.getDepartamento());
        existente.setCodigoPostal(direccion.getCodigoPostal());
        existente.setReferencia(direccion.getReferencia());
        existente.setEsPredeterminada(direccion.getEsPredeterminada());
        existente.setUpdatedAt(LocalDateTime.now());
        
        DireccionEnvioEntity actualizada = repository.save(existente);
        return mapper.toDomain(actualizada);
    }
    
    @Override
    @Transactional
    public DireccionEnvio establecerComoPredeterminada(String id, String usuarioId) {
        DireccionEnvioEntity direccion = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada con ID: " + id));
        
        // Verificar que la dirección pertenece al usuario
        if (!direccion.getUsuarioId().equals(usuarioId)) {
            throw new RuntimeException("La dirección no pertenece al usuario especificado");
        }
        
        // Quitar la marca de predeterminada de todas las direcciones del usuario
        repository.quitarPredeterminadaDeTodasLasDirecciones(usuarioId);
        
        // Establecer esta como predeterminada
        direccion.setEsPredeterminada(true);
        direccion.setUpdatedAt(LocalDateTime.now());
        
        DireccionEnvioEntity actualizada = repository.save(direccion);
        return mapper.toDomain(actualizada);
    }
    
    @Override
    @Transactional
    public void eliminarDireccion(String id) {
        DireccionEnvioEntity direccion = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dirección no encontrada con ID: " + id));
        
        // Si era la predeterminada, establecer otra como predeterminada (la más antigua)
        if (Boolean.TRUE.equals(direccion.getEsPredeterminada())) {
            List<DireccionEnvioEntity> otrasDirecciones = repository
                    .findByUsuarioIdOrderByEsPredeterminadaDescCreatedAtDesc(direccion.getUsuarioId())
                    .stream()
                    .filter(d -> !d.getId().equals(id))
                    .collect(Collectors.toList());
            
            if (!otrasDirecciones.isEmpty()) {
                DireccionEnvioEntity nuevaPredeterminada = otrasDirecciones.get(0);
                nuevaPredeterminada.setEsPredeterminada(true);
                repository.save(nuevaPredeterminada);
            }
        }
        
        repository.deleteById(id);
    }
}