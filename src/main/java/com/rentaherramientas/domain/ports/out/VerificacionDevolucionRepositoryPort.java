package com.rentaherramientas.domain.ports.out;

import com.rentaherramientas.domain.model.VerificacionDevolucion;

import java.util.Optional;

/**
 * Puerto de salida para persistencia de VerificacionDevolucion
 */
public interface VerificacionDevolucionRepositoryPort {

    VerificacionDevolucion save(VerificacionDevolucion verificacion);

    Optional<VerificacionDevolucion> findByReservaId(String reservaId);

    boolean existsByReservaId(String reservaId);
}
