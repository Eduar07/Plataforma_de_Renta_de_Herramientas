package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.Pago;
import java.util.List;
import java.util.Optional;

public interface PagoUseCase {
    Pago registrarPago(Pago pago);
    Optional<Pago> buscarPorId(Long id);
    List<Pago> buscarPorReserva(Long reservaId);
    List<Pago> buscarPorCliente(Long clienteId);
}