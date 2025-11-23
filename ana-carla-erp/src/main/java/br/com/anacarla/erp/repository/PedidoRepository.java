package br.com.anacarla.erp.repository;

import br.com.anacarla.erp.domain.Pedido;
import br.com.anacarla.erp.domain.enums.StatusPedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, UUID> {

    List<Pedido> findByStatusOrderByDataCriacaoDesc(StatusPedido status);

    Page<Pedido> findByClienteIdOrderByDataCriacaoDesc(UUID clienteId, Pageable pageable);

    @Query("SELECT p FROM Pedido p WHERE p.clienteId = :clienteId AND p.dataEntrega IS NOT NULL ORDER BY p.dataEntrega DESC")
    List<Pedido> findPedidosEntreguesDoCliente(@Param("clienteId") UUID clienteId);

    @Query("SELECT p FROM Pedido p WHERE p.clienteId = :clienteId AND p.dataEntrega BETWEEN :inicio AND :fim")
    List<Pedido> findPedidosClienteNoPeriodo(@Param("clienteId") UUID clienteId,
                                              @Param("inicio") Instant inicio,
                                              @Param("fim") Instant fim);

    Long countByClienteId(UUID clienteId);
}

