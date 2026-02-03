package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.Reserva;
import java.util.List;
import java.util.Optional;

public interface ReservaUseCase {
    Reserva crearReserva(Reserva reserva);
    Reserva actualizarReserva(Long id, Reserva reserva);
    void cancelarReserva(Long id);
    Optional<Reserva> buscarPorId(Long id);
    List<Reserva> listarTodas();
    List<Reserva> buscarPorCliente(Long clienteId);
    List<Reserva> buscarPorProveedor(Long proveedorId);
    List<Reserva> buscarPorEstado(String estado);
}