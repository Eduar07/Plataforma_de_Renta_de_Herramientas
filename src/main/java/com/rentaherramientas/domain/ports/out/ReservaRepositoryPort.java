package com.rentaherramientas.domain.ports.out;

import com.rentaherramientas.domain.model.Reserva;
import java.util.List;
import java.util.Optional;

public interface ReservaRepositoryPort {
    Reserva save(Reserva reserva);
    Optional<Reserva> findById(Long id);
    List<Reserva> findAll();
    List<Reserva> findByClienteId(Long clienteId);
    List<Reserva> findByProveedorId(Long proveedorId);
    List<Reserva> findByEstado(String estado);
    void deleteById(Long id);
}