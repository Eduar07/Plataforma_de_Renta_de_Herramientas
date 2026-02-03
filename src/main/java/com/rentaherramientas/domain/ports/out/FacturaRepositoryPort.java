package com.rentaherramientas.domain.ports.out;

import com.rentaherramientas.domain.model.Factura;
import java.util.List;
import java.util.Optional;

public interface FacturaRepositoryPort {
    Factura save(Factura factura);
    Optional<Factura> findById(Long id);
    Optional<Factura> findByReservaId(Long reservaId);
    List<Factura> findByClienteId(Long clienteId);
}