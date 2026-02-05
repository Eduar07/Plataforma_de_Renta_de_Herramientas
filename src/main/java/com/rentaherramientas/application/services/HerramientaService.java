package com.rentaherramientas.application.services;

import com.rentaherramientas.domain.exceptions.ResourceNotFoundException;
import com.rentaherramientas.domain.exceptions.ValidationException;
import com.rentaherramientas.domain.model.Herramienta;
import com.rentaherramientas.domain.model.enums.EstadoHerramienta;
import com.rentaherramientas.ports.in.HerramientaUseCase;
import com.rentaherramientas.ports.out.HerramientaRepositoryPort;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio de Aplicación: Herramienta
 */
@Service
@RequiredArgsConstructor
@Transactional
public class HerramientaService implements HerramientaUseCase {
    
    private final HerramientaRepositoryPort herramientaRepository;
    
    @Override
    public Herramienta crearHerramienta(Herramienta herramienta) {
        // Validar SKU único si existe
        if (herramienta.getSku() != null && herramientaRepository.existsBySku(herramienta.getSku())) {
            throw new ValidationException("El SKU ya está registrado");
        }
        
        // Valores por defecto
        herramienta.setEstado(EstadoHerramienta.ACTIVO);
        herramienta.setVistas(0);
        herramienta.setTotalAlquileres(0);
        herramienta.setTotalCalificaciones(0);
        
        return herramientaRepository.save(herramienta);
    }
    
    @Override
    public Herramienta actualizarHerramienta(String id, Herramienta herramienta) {
        Herramienta existente = obtenerHerramientaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Herramienta", "id", id));
        
        // Validar SKU único si cambió
        if (herramienta.getSku() != null && 
            !herramienta.getSku().equals(existente.getSku()) &&
            herramientaRepository.existsBySku(herramienta.getSku())) {
            throw new ValidationException("El SKU ya está registrado");
        }
        
        // Actualizar campos
        existente.setNombre(herramienta.getNombre());
        existente.setMarca(herramienta.getMarca());
        existente.setModelo(herramienta.getModelo());
        existente.setDescripcion(herramienta.getDescripcion());
        existente.setFotos(herramienta.getFotos());
        existente.setPrecioBaseDia(herramienta.getPrecioBaseDia());
        existente.setEnvioIncluido(herramienta.getEnvioIncluido());
        existente.setDiasMinimoAlquiler(herramienta.getDiasMinimoAlquiler());
        existente.setDiasMaximoAlquiler(herramienta.getDiasMaximoAlquiler());
        existente.setDepositoSeguridad(herramienta.getDepositoSeguridad());
        
        return herramientaRepository.save(existente);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Herramienta> obtenerHerramientaPorId(String id) {
        return herramientaRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Herramienta> listarHerramientas() {
        return herramientaRepository.findAll();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Herramienta> listarHerramientasPorProveedor(String proveedorId) {
        return herramientaRepository.findByProveedorId(proveedorId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Herramienta> listarHerramientasPorCategoria(String categoriaId) {
        return herramientaRepository.findByCategoriaId(categoriaId);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Herramienta> buscarHerramientas(String termino) {
        return herramientaRepository.searchByNombreOrMarcaOrModelo(termino);
    }
    
    @Override
    public void eliminarHerramienta(String id) {
        if (!herramientaRepository.findById(id).isPresent()) {
            throw new ResourceNotFoundException("Herramienta", "id", id);
        }
        herramientaRepository.deleteById(id);
    }
    
    @Override
    public Herramienta cambiarEstado(String id, String estado) {
        Herramienta herramienta = obtenerHerramientaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Herramienta", "id", id));
        
        herramienta.setEstado(EstadoHerramienta.valueOf(estado));
        return herramientaRepository.save(herramienta);
    }
    
    @Override
    public void incrementarVistas(String id) {
        Herramienta herramienta = obtenerHerramientaPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Herramienta", "id", id));
        
        herramienta.incrementarVistas();
        herramientaRepository.save(herramienta);
    }
}