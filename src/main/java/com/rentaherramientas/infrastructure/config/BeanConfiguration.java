package com.rentaherramientas.infrastructure.config;

import com.rentaherramientas.application.services.*;
import com.rentaherramientas.domain.ports.in.DetalleReservaUseCase;
import com.rentaherramientas.domain.ports.in.DireccionEnvioUseCase;
import com.rentaherramientas.domain.ports.in.HerramientaUseCase;
import com.rentaherramientas.domain.ports.in.ReservaUseCase;
import com.rentaherramientas.domain.ports.out.*;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.DetalleReservaMapper;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.DireccionEnvioMapper;
import com.rentaherramientas.infrastructure.adapters.out.persistence.repository.DetalleReservaRepository;
import com.rentaherramientas.infrastructure.adapters.out.persistence.repository.DireccionEnvioRepository;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class BeanConfiguration {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UsuarioService usuarioService(
            UsuarioRepositoryPort usuarioRepository,
            PasswordEncoder passwordEncoder,
            PerfilProveedorRepositoryPort perfilProveedorRepository) {
        return new UsuarioService(usuarioRepository, passwordEncoder, perfilProveedorRepository);
    }

    @Bean
    public PerfilProveedorService perfilProveedorService(
            PerfilProveedorRepositoryPort perfilProveedorRepository) {
        return new PerfilProveedorService(perfilProveedorRepository);
    }

    // ========== HERRAMIENTA USE CASE ==========
    @Bean
    public HerramientaUseCase herramientaUseCase(
            HerramientaRepositoryPort herramientaRepository) {
        return new HerramientaService(herramientaRepository);
    }

    // ========== DIRECCIONES DE ENVÍO ==========
    @Bean
    public DireccionEnvioUseCase direccionEnvioUseCase(
            DireccionEnvioRepository direccionEnvioRepository,
            DireccionEnvioMapper direccionEnvioMapper) {
        return new DireccionEnvioService(direccionEnvioRepository, direccionEnvioMapper);
    }

    // ========== DETALLE DE RESERVA ==========
    @Bean
    public DetalleReservaUseCase detalleReservaUseCase(
            DetalleReservaRepository detalleReservaRepository,
            DetalleReservaMapper detalleReservaMapper) {
        return new DetalleReservaService(detalleReservaRepository, detalleReservaMapper);
    }

    // ========== RESERVA USE CASE (CON DEPENDENCIAS ACTUALIZADAS) ==========
    @Bean
    public ReservaUseCase reservaUseCase(
            ReservaRepositoryPort reservaRepositoryPort,
            HerramientaUseCase herramientaUseCase,
            DetalleReservaUseCase detalleReservaUseCase) {
        return new ReservaService(
                reservaRepositoryPort,
                herramientaUseCase,
                detalleReservaUseCase
        );
    }

    // ========== PAGO SERVICE ==========
    @Bean
    public PagoService pagoService(
            PagoRepositoryPort pagoRepository,
            ReservaRepositoryPort reservaRepository) {
        return new PagoService(pagoRepository, reservaRepository);
    }

    // ========== FACTURA SERVICE ==========
    @Bean
    public FacturaService facturaService(
            FacturaRepositoryPort facturaRepository,
            ReservaRepositoryPort reservaRepository) {
        return new FacturaService(facturaRepository, reservaRepository);
    }
    
    // ❌ ELIMINADO - Ya existe con @Service
    // NO NECESITAS ESTE BEAN porque UsuarioFavoritoService tiene @Service
}