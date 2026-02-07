package com.rentaherramientas.infrastructure.config;

import com.rentaherramientas.application.services.*;
import com.rentaherramientas.domain.ports.out.*;
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

    // ✅ NUEVO BEAN
    @Bean
    public PerfilProveedorService perfilProveedorService(
            PerfilProveedorRepositoryPort perfilProveedorRepository) {
        return new PerfilProveedorService(perfilProveedorRepository);
    }

    @Bean
    public HerramientaService herramientaService(
            HerramientaRepositoryPort herramientaRepository) {
        return new HerramientaService(herramientaRepository);
    }

    @Bean
    public ReservaService reservaService(
            ReservaRepositoryPort reservaRepository,
            HerramientaRepositoryPort herramientaRepository) {
        return new ReservaService(reservaRepository, herramientaRepository);
    }

    @Bean
    public PagoService pagoService(
            PagoRepositoryPort pagoRepository,
            ReservaRepositoryPort reservaRepository) {
        return new PagoService(pagoRepository, reservaRepository);
    }

    @Bean
    public FacturaService facturaService(
            FacturaRepositoryPort facturaRepository,
            ReservaRepositoryPort reservaRepository) {
        return new FacturaService(facturaRepository, reservaRepository);
    }
}