package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.Factura;
import java.util.List;
import java.util.Optional;

public interface FacturaUseCase {
    Factura generarFactura(Long reservaId);
    Optional<Factura> buscarPorId(Long id);
    Optional<Factura> buscarPorReserva(Long reservaId);
    List<Factura> buscarPorCliente(Long clienteId);
}