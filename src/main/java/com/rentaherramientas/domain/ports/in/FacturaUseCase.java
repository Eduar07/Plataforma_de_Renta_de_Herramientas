package com.rentaherramientas.domain.ports.in;

import com.rentaherramientas.domain.model.Factura;

import java.util.List;
import java.util.Optional;

/**
 * Puerto de entrada para casos de uso de Factura
 */
public interface FacturaUseCase {
    
    Factura crearFactura(Factura factura);
    
    Factura actualizarFactura(String id, Factura factura);
    
    Optional<Factura> obtenerFacturaPorId(String id);
    
    Optional<Factura> obtenerFacturaPorNumero(String numeroFactura);
    
    Optional<Factura> obtenerFacturaPorReserva(String reservaId);
    
    List<Factura> listarFacturas();
    
    List<Factura> listarFacturasPorCliente(String clienteId);
    
    List<Factura> listarFacturasPorProveedor(String proveedorId);
    
    Factura marcarComoPagada(String id);
    
    Factura anularFactura(String id, String motivo);
}