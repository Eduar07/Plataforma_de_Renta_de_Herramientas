package com.rentaherramientas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Clase principal de la aplicación Renta de Herramientas
 * Arquitectura: Hexagonal (Ports & Adapters)
 * 
 * @author Equipo de Desarrollo
 * @version 1.0.0
 */
@SpringBootApplication
@EnableJpaAuditing
public class RentaHerramientasApplication {

    public static void main(String[] args) {
        SpringApplication.run(RentaHerramientasApplication.class, args);
        System.out.println("\n" +
            "========================================\n" +
            "🚀 Renta Herramientas Platform STARTED\n" +
            "========================================\n" +
            "📊 Swagger UI: http://localhost:8080/swagger-ui.html\n" +
            "🌐 Application: http://localhost:8080\n" +
            "========================================\n"
        );
    }
}