package com.rentaherramientas.infrastructure.adapters.out.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.rentaherramientas.domain.model.Reserva;

@Entity
public class ReporteDano {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descripcion;

    private Double costoReparacion;

    private LocalDateTime fechaReporte;

    @ManyToOne
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    // Getters y Setters
}

