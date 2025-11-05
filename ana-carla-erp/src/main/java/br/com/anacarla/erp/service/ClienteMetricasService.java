package br.com.anacarla.erp.service;

import br.com.anacarla.erp.domain.Cliente;
import br.com.anacarla.erp.domain.Pedido;
import br.com.anacarla.erp.repository.ClienteRepository;
import br.com.anacarla.erp.repository.PedidoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClienteMetricasService {

    private final ClienteRepository clienteRepository;
    private final PedidoRepository pedidoRepository;

    @Transactional
    public void recalcularMetricasCliente(UUID clienteId) {
        log.debug("Recalculando métricas do cliente: {}", clienteId);
        
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        List<Pedido> pedidosEntregues = pedidoRepository.findPedidosEntreguesDoCliente(clienteId);

        if (pedidosEntregues.isEmpty()) {
            resetarMetricas(cliente);
            clienteRepository.save(cliente);
            return;
        }

        // Total de pedidos
        cliente.setTotalPedidos(pedidosEntregues.size());

        // Valor total
        BigDecimal valorTotal = pedidosEntregues.stream()
                .map(Pedido::getValorTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        cliente.setValorTotal(valorTotal);

        // Ticket médio
        BigDecimal ticketMedio = valorTotal.divide(
                BigDecimal.valueOf(pedidosEntregues.size()),
                2,
                RoundingMode.HALF_UP
        );
        cliente.setTicketMedio(ticketMedio);

        // Última compra
        Instant ultimaCompra = pedidosEntregues.stream()
                .map(Pedido::getDataEntrega)
                .filter(Objects::nonNull)
                .max(Instant::compareTo)
                .orElse(null);
        cliente.setUltimaCompra(ultimaCompra);

        // Recência em dias
        if (ultimaCompra != null) {
            long dias = ChronoUnit.DAYS.between(ultimaCompra, Instant.now());
            cliente.setRecenciaDias((int) dias);
        }

        // Intervalo médio de recompra
        if (pedidosEntregues.size() > 1) {
            List<Instant> datas = pedidosEntregues.stream()
                    .map(Pedido::getDataEntrega)
                    .filter(Objects::nonNull)
                    .sorted()
                    .toList();

            long somaIntervalos = 0;
            for (int i = 1; i < datas.size(); i++) {
                somaIntervalos += ChronoUnit.DAYS.between(datas.get(i - 1), datas.get(i));
            }
            int intervaloMedio = (int) (somaIntervalos / (datas.size() - 1));
            cliente.setIntervaloMedioRecompra(intervaloMedio);
        }

        // LTV simples (valor total até agora)
        cliente.setLtv(valorTotal);

        // RFM
        Map<String, Object> rfm = calcularRFM(cliente);
        cliente.setRfm(rfm);

        clienteRepository.save(cliente);
        log.info("Métricas recalculadas para cliente {}: {} pedidos, ticket médio R$ {}", 
                 clienteId, cliente.getTotalPedidos(), cliente.getTicketMedio());
    }

    private void resetarMetricas(Cliente cliente) {
        cliente.setTotalPedidos(0);
        cliente.setValorTotal(BigDecimal.ZERO);
        cliente.setTicketMedio(BigDecimal.ZERO);
        cliente.setUltimaCompra(null);
        cliente.setRecenciaDias(null);
        cliente.setIntervaloMedioRecompra(null);
        cliente.setLtv(BigDecimal.ZERO);
        cliente.setRfm(null);
    }

    private Map<String, Object> calcularRFM(Cliente cliente) {
        Map<String, Object> rfm = new HashMap<>();

        // Recency: quanto menor a recência, melhor (5 = melhor)
        int r = calcularScoreRecencia(cliente.getRecenciaDias());
        rfm.put("R", r);

        // Frequency: quanto mais pedidos, melhor
        int f = calcularScoreFrequencia(cliente.getTotalPedidos());
        rfm.put("F", f);

        // Monetary: quanto maior o ticket médio, melhor
        int m = calcularScoreMonetario(cliente.getTicketMedio());
        rfm.put("M", m);

        // Cluster simples
        String cluster = determinarCluster(r, f, m);
        rfm.put("cluster", cluster);

        return rfm;
    }

    private int calcularScoreRecencia(Integer recenciaDias) {
        if (recenciaDias == null) return 1;
        if (recenciaDias <= 7) return 5;
        if (recenciaDias <= 14) return 4;
        if (recenciaDias <= 30) return 3;
        if (recenciaDias <= 60) return 2;
        return 1;
    }

    private int calcularScoreFrequencia(Integer totalPedidos) {
        if (totalPedidos == null || totalPedidos == 0) return 1;
        if (totalPedidos >= 20) return 5;
        if (totalPedidos >= 10) return 4;
        if (totalPedidos >= 5) return 3;
        if (totalPedidos >= 2) return 2;
        return 1;
    }

    private int calcularScoreMonetario(BigDecimal ticketMedio) {
        if (ticketMedio == null) return 1;
        if (ticketMedio.compareTo(BigDecimal.valueOf(50)) >= 0) return 5;
        if (ticketMedio.compareTo(BigDecimal.valueOf(35)) >= 0) return 4;
        if (ticketMedio.compareTo(BigDecimal.valueOf(25)) >= 0) return 3;
        if (ticketMedio.compareTo(BigDecimal.valueOf(15)) >= 0) return 2;
        return 1;
    }

    private String determinarCluster(int r, int f, int m) {
        double media = (r + f + m) / 3.0;
        
        if (r >= 4 && f >= 4) return "LEAL";
        if (r >= 4 && f <= 2) return "NOVO";
        if (r <= 2 && f >= 4) return "EM_RISCO";
        if (r <= 2 && f <= 2) return "PERDIDO";
        if (media >= 3.5) return "PROMISSOR";
        
        return "REGULAR";
    }
}

