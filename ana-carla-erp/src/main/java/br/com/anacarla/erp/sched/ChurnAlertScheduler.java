package br.com.anacarla.erp.sched;

import br.com.anacarla.erp.domain.Cliente;
import br.com.anacarla.erp.domain.enums.OrigemTarefa;
import br.com.anacarla.erp.domain.enums.PrioridadeTarefa;
import br.com.anacarla.erp.domain.enums.StatusTarefa;
import br.com.anacarla.erp.repository.ClienteRepository;
import br.com.anacarla.erp.service.TarefaService;
import br.com.anacarla.erp.web.dto.TarefaDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ChurnAlertScheduler {

    private final ClienteRepository clienteRepository;
    private final TarefaService tarefaService;

    @Value("${app.scheduling.churn-alert-enabled:true}")
    private boolean churnAlertEnabled;

    @Value("${app.scheduling.churn-threshold-days:15}")
    private int churnThresholdDays;

    /**
     * Executa diariamente às 8h para identificar clientes em risco de churn
     * e criar tarefas de follow-up.
     */
    @Scheduled(cron = "0 0 8 * * *") // Todos os dias às 8h
    public void verificarClientesEmRisco() {
        if (!churnAlertEnabled) {
            log.debug("Alertas de churn desabilitados");
            return;
        }

        log.info("Iniciando verificação de clientes em risco de churn...");

        try {
            // Calcular limiar dinâmico baseado na média global
            Double intervaloMedioGlobal = clienteRepository.calcularIntervaloMedioGlobal();
            int limiar = intervaloMedioGlobal != null 
                    ? (int) (intervaloMedioGlobal + churnThresholdDays) 
                    : churnThresholdDays;

            log.info("Limiar de recência calculado: {} dias", limiar);

            List<Cliente> clientesEmRisco = clienteRepository.findClientesEmRiscoChurn(limiar);
            
            if (clientesEmRisco.isEmpty()) {
                log.info("Nenhum cliente em risco de churn identificado");
                return;
            }

            log.info("Encontrados {} clientes em risco de churn", clientesEmRisco.size());

            int tarefasCriadas = 0;
            for (Cliente cliente : clientesEmRisco) {
                try {
                    criarTarefaFollowUp(cliente);
                    tarefasCriadas++;
                } catch (Exception e) {
                    log.error("Erro ao criar tarefa para cliente {}: {}", 
                              cliente.getId(), e.getMessage());
                }
            }

            log.info("Verificação de churn concluída. {} tarefas de follow-up criadas", tarefasCriadas);

        } catch (Exception e) {
            log.error("Erro ao executar verificação de churn", e);
        }
    }

    private void criarTarefaFollowUp(Cliente cliente) {
        String titulo = String.format("Follow-up: %s - Risco de churn", cliente.getNome());
        
        String descricao = String.format(
                "Cliente não compra há %d dias (último pedido em %s). " +
                "Intervalo médio de recompra: %d dias. " +
                "Total de pedidos: %d. " +
                "Realizar contato para reativar cliente.",
                cliente.getRecenciaDias(),
                cliente.getUltimaCompra() != null ? cliente.getUltimaCompra().toString() : "N/A",
                cliente.getIntervaloMedioRecompra() != null ? cliente.getIntervaloMedioRecompra() : 0,
                cliente.getTotalPedidos()
        );

        TarefaDTO tarefa = TarefaDTO.builder()
                .clienteId(cliente.getId())
                .titulo(titulo)
                .descricao(descricao)
                .prioridade(determinarPrioridade(cliente))
                .status(StatusTarefa.PENDENTE)
                .origem(OrigemTarefa.ALERTA_CHURN)
                .dueDate(Instant.now().plus(3, ChronoUnit.DAYS)) // 3 dias para ação
                .build();

        tarefaService.criar(tarefa);
        log.info("Tarefa de follow-up criada para cliente {} (recência: {} dias)", 
                 cliente.getId(), cliente.getRecenciaDias());
    }

    private PrioridadeTarefa determinarPrioridade(Cliente cliente) {
        // Clientes com LTV alto e recência alta = prioridade alta
        if (cliente.getLtv() != null && cliente.getLtv().doubleValue() > 200.0) {
            return PrioridadeTarefa.ALTA;
        }
        
        // Clientes com muitos pedidos = prioridade média
        if (cliente.getTotalPedidos() != null && cliente.getTotalPedidos() > 5) {
            return PrioridadeTarefa.MEDIA;
        }
        
        return PrioridadeTarefa.BAIXA;
    }
}

