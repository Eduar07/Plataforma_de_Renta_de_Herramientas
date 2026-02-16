package com.rentaherramientas.infrastructure.adapters.in.rest;

import com.rentaherramientas.application.dto.response.ApiResponse;
import com.rentaherramientas.infrastructure.adapters.out.persistence.repository.CategoriaJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoriaController {

    private final CategoriaJpaRepository categoriaJpaRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, String>>>> obtenerCategorias() {
        List<Map<String, String>> categorias = categoriaJpaRepository.findByActivaTrueOrderByOrdenAscNombreAsc()
                .stream()
                .map(categoria -> Map.of(
                        "id", categoria.getId(),
                        "nombre", categoria.getNombre(),
                        "slug", categoria.getSlug()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(categorias));
    }
}
