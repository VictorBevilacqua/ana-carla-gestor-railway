package br.com.anacarla.erp.service;

import br.com.anacarla.erp.BaseIntegrationTest;
import br.com.anacarla.erp.domain.enums.CanalPedido;
import br.com.anacarla.erp.domain.enums.StatusPedido;
import br.com.anacarla.erp.web.dto.ClienteDTO;
import br.com.anacarla.erp.web.dto.ClienteMetricasDTO;
import br.com.anacarla.erp.web.dto.PedidoDTO;
import br.com.anacarla.erp.web.dto.PedidoItemDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@Transactional
class PedidoServiceIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private ClienteService clienteService;

    private UUID clienteId;

    @BeforeEach
    void setUp() {
        ClienteDTO cliente = clienteService.criar(ClienteDTO.builder()
                .nome("Teste Cliente")
                .email("teste@example.com")
                .build());
        clienteId = cliente.getId();
    }

    @Test
    void deveCriarPedido() {
        // Given
        PedidoDTO dto = PedidoDTO.builder()
                .clienteId(clienteId)
                .canal(CanalPedido.WHATSAPP)
                .status(StatusPedido.RECEBIDO)
                .dataCriacao(Instant.now())
                .itens(List.of(
                        PedidoItemDTO.builder()
                                .nome("Patinho Moído")
                                .precoUnit(BigDecimal.valueOf(18.00))
                                .quantidade(2)
                                .build()
                ))
                .build();

        // When
        PedidoDTO criado = pedidoService.criar(dto);

        // Then
        assertThat(criado).isNotNull();
        assertThat(criado.getId()).isNotNull();
        assertThat(criado.getValorTotal()).isEqualByComparingTo(BigDecimal.valueOf(36.00));
        assertThat(criado.getStatus()).isEqualTo(StatusPedido.RECEBIDO);
        assertThat(criado.getItens()).hasSize(1);
    }

    @Test
    void deveAtualizarStatusParaEntregueERecalcularMetricas() {
        // Given - Criar pedido
        PedidoDTO pedido = pedidoService.criar(PedidoDTO.builder()
                .clienteId(clienteId)
                .canal(CanalPedido.WHATSAPP)
                .status(StatusPedido.RECEBIDO)
                .dataCriacao(Instant.now())
                .itens(List.of(
                        PedidoItemDTO.builder()
                                .nome("Frango Grelhado")
                                .precoUnit(BigDecimal.valueOf(16.00))
                                .quantidade(3)
                                .build()
                ))
                .build());

        // When - Atualizar para ENTREGUE
        PedidoDTO atualizado = pedidoService.atualizarStatus(pedido.getId(), StatusPedido.ENTREGUE);

        // Then - Verificar pedido
        assertThat(atualizado.getStatus()).isEqualTo(StatusPedido.ENTREGUE);
        assertThat(atualizado.getDataEntrega()).isNotNull();

        // Verificar que métricas do cliente foram atualizadas
        ClienteMetricasDTO metricas = clienteService.obterMetricas(clienteId);
        assertThat(metricas.getTotalPedidos()).isEqualTo(1);
        assertThat(metricas.getValorTotal()).isEqualByComparingTo(BigDecimal.valueOf(48.00));
        assertThat(metricas.getTicketMedio()).isEqualByComparingTo(BigDecimal.valueOf(48.00));
        assertThat(metricas.getUltimaCompra()).isNotNull();
    }

    @Test
    void deveListarPedidosPorStatus() {
        // Given - Criar pedidos com diferentes status
        pedidoService.criar(createPedidoDTO(StatusPedido.RECEBIDO));
        pedidoService.criar(createPedidoDTO(StatusPedido.RECEBIDO));
        pedidoService.criar(createPedidoDTO(StatusPedido.PREPARANDO));

        // When
        List<PedidoDTO> recebidos = pedidoService.listarPorStatus(StatusPedido.RECEBIDO);
        List<PedidoDTO> preparando = pedidoService.listarPorStatus(StatusPedido.PREPARANDO);

        // Then
        assertThat(recebidos).hasSize(2);
        assertThat(preparando).hasSize(1);
    }

    @Test
    void deveCalcularValorTotalAutomaticamente() {
        // Given
        PedidoDTO dto = PedidoDTO.builder()
                .clienteId(clienteId)
                .canal(CanalPedido.WEB)
                .status(StatusPedido.RECEBIDO)
                .dataCriacao(Instant.now())
                .itens(List.of(
                        PedidoItemDTO.builder()
                                .nome("Item 1")
                                .precoUnit(BigDecimal.valueOf(10.50))
                                .quantidade(2)
                                .build(),
                        PedidoItemDTO.builder()
                                .nome("Item 2")
                                .precoUnit(BigDecimal.valueOf(15.75))
                                .quantidade(1)
                                .build()
                ))
                .build();

        // When
        PedidoDTO criado = pedidoService.criar(dto);

        // Then
        // (10.50 * 2) + (15.75 * 1) = 21.00 + 15.75 = 36.75
        assertThat(criado.getValorTotal()).isEqualByComparingTo(BigDecimal.valueOf(36.75));
    }

    private PedidoDTO createPedidoDTO(StatusPedido status) {
        return pedidoService.criar(PedidoDTO.builder()
                .clienteId(clienteId)
                .canal(CanalPedido.WHATSAPP)
                .status(status)
                .dataCriacao(Instant.now())
                .itens(List.of(
                        PedidoItemDTO.builder()
                                .nome("Test Item")
                                .precoUnit(BigDecimal.valueOf(20.00))
                                .quantidade(1)
                                .build()
                ))
                .build());
    }
}

