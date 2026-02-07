package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoriaController {

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> obtenerCategorias() {
        // Categorías hardcodeadas (en el futuro deberían venir de la BD)
        List<Map<String, String>> categorias = Arrays.asList(
            Map.of("id", "1", "nombre", "Construcción"),
            Map.of("id", "2", "nombre", "Carpintería"),
            Map.of("id", "3", "nombre", "Jardinería"),
            Map.of("id", "4", "nombre", "Electricidad"),
            Map.of("id", "5", "nombre", "Pintura"),
            Map.of("id", "6", "nombre", "Plomería"),
            Map.of("id", "7", "nombre", "Mecánica"),
            Map.of("id", "8", "nombre", "Limpieza")
        );
        
        return ResponseEntity.ok(ApiResponse.success(categorias));
    }
}