package com.rentaherramientas.infrastructure.config;

import com.rentaherramientas.application.services.*;
import com.rentaherramientas.domain.ports.in.*;
import com.rentaherramientas.domain.ports.out.*;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.DetalleReservaMapper;
import com.rentaherramientas.infrastructure.adapters.out.persistence.mapper.DireccionEnvioMapper;
import com.rentaherramientas.infrastructure.adapters.out.persistence.repository.DetalleReservaRepository;
import com.rentaherramientas.infrastructure.adapters.out.persistence.repository.DireccionEnvioRepository;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Configuración de Beans para Inyección de Dependencias
 * Arquitectura Hexagonal: Los beans retornan interfaces (Use Cases)
 */
@Configuration
public class BeanConfiguration {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ========== USUARIO USE CASE ==========
    @Bean
    public UsuarioUseCase usuarioUseCase(
            UsuarioRepositoryPort usuarioRepository,
            PasswordEncoder passwordEncoder,
            PerfilProveedorRepositoryPort perfilProveedorRepository) {
        return new UsuarioService(usuarioRepository, passwordEncoder, perfilProveedorRepository);
    }

    // ========== PERFIL PROVEEDOR USE CASE ==========
    @Bean
    public PerfilProveedorUseCase perfilProveedorUseCase(
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

    // ========== RESERVA USE CASE ==========
    @Bean
    public ReservaUseCase reservaUseCase(
            ReservaRepositoryPort reservaRepositoryPort,
            HerramientaUseCase herramientaUseCase,
            DetalleReservaUseCase detalleReservaUseCase,
            VerificacionDevolucionRepositoryPort verificacionDevolucionRepositoryPort) {
        return new ReservaService(
                reservaRepositoryPort,
                herramientaUseCase,
                detalleReservaUseCase,
                verificacionDevolucionRepositoryPort
        );
    }

    // ========== PAGO USE CASE ==========
    @Bean
    public PagoUseCase pagoUseCase(
            PagoRepositoryPort pagoRepository,
            ReservaRepositoryPort reservaRepository) {
        return new PagoService(pagoRepository, reservaRepository);
    }

    // ========== FACTURA USE CASE ==========
    @Bean
    public FacturaUseCase facturaUseCase(
            FacturaRepositoryPort facturaRepository,
            ReservaRepositoryPort reservaRepository) {
        return new FacturaService(facturaRepository, reservaRepository);
    }
}
