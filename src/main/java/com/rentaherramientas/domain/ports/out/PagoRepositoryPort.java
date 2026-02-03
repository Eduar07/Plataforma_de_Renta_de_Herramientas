package com.rentaherramientas.domain.ports.out;

import com.rentaherramientas.domain.model.Pago;
import java.util.List;
import java.util.Optional;

public interface PagoRepositoryPort {
    Pago save(Pago pago);
    Optional<Pago> findById(Long id);
    List<Pago> findByReservaId(Long reservaId);
    List<Pago> findByClienteId(Long clienteId);
}