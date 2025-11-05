package br.com.anacarla.erp.service;

import br.com.anacarla.erp.domain.Pedido;
import br.com.anacarla.erp.domain.PedidoItem;
import br.com.anacarla.erp.domain.enums.StatusPedido;
import br.com.anacarla.erp.repository.PedidoRepository;
import br.com.anacarla.erp.web.dto.PedidoDTO;
import br.com.anacarla.erp.web.dto.PedidoItemDTO;
import br.com.anacarla.erp.web.mapper.PedidoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final PedidoMapper pedidoMapper;
    private final ClienteMetricasService clienteMetricasService;

    @Transactional(readOnly = true)
    public List<PedidoDTO> listarPorStatus(StatusPedido status) {
        log.debug("Listando pedidos por status: {}", status);
        List<Pedido> pedidos;
        
        if (status != null) {
            pedidos = pedidoRepository.findByStatusOrderByDataCriacaoDesc(status);
        } else {
            pedidos = pedidoRepository.findAll();
        }
        
        return pedidos.stream()
                .map(pedidoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<PedidoDTO> listarPorCliente(UUID clienteId, Pageable pageable) {
        log.debug("Listando pedidos do cliente: {}", clienteId);
        return pedidoRepository.findByClienteIdOrderByDataCriacaoDesc(clienteId, pageable)
                .map(pedidoMapper::toDTO);
    }

    public PedidoDTO criar(PedidoDTO dto) {
        log.info("Criando novo pedido para cliente: {}", dto.getClienteId());
        
        Pedido entity = pedidoMapper.toEntity(dto);
        
        // Configurar data de criação se não fornecida
        if (entity.getDataCriacao() == null) {
            entity.setDataCriacao(Instant.now());
        }
        
        // Configurar status inicial se não fornecido
        if (entity.getStatus() == null) {
            entity.setStatus(StatusPedido.RECEBIDO);
        }
        
        // Adicionar itens ao pedido
        if (dto.getItens() != null && !dto.getItens().isEmpty()) {
            for (PedidoItemDTO itemDto : dto.getItens()) {
                PedidoItem item = pedidoMapper.toItemEntity(itemDto);
                entity.addItem(item);
            }
        }
        
        // Calcular valor total
        BigDecimal valorTotal = entity.getItens().stream()
                .map(PedidoItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        entity.setValorTotal(valorTotal);
        
        entity = pedidoRepository.save(entity);
        log.info("Pedido criado: {} - R$ {}", entity.getId(), entity.getValorTotal());
        
        return pedidoMapper.toDTO(entity);
    }

    @Transactional(readOnly = true)
    public PedidoDTO buscarPorId(UUID id) {
        log.debug("Buscando pedido por ID: {}", id);
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado"));
        return pedidoMapper.toDTO(pedido);
    }

    public PedidoDTO atualizarStatus(UUID id, StatusPedido novoStatus) {
        log.info("Atualizando status do pedido {} para {}", id, novoStatus);
        
        Pedido entity = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado"));
        
        StatusPedido statusAnterior = entity.getStatus();
        entity.setStatus(novoStatus);
        
        // Se mudou para ENTREGUE, registrar data de entrega e atualizar métricas
        if (novoStatus == StatusPedido.ENTREGUE && statusAnterior != StatusPedido.ENTREGUE) {
            entity.setDataEntrega(Instant.now());
            log.info("Pedido {} entregue. Recalculando métricas do cliente {}", id, entity.getClienteId());
            
            // Salvar primeiro para garantir que a data de entrega está registrada
            entity = pedidoRepository.save(entity);
            
            // Recalcular métricas do cliente
            clienteMetricasService.recalcularMetricasCliente(entity.getClienteId());
        } else {
            entity = pedidoRepository.save(entity);
        }
        
        return pedidoMapper.toDTO(entity);
    }

    public void deletar(UUID id) {
        log.info("Deletando pedido: {}", id);
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado"));
        
        UUID clienteId = pedido.getClienteId();
        boolean eraEntregue = pedido.getStatus() == StatusPedido.ENTREGUE;
        
        pedidoRepository.deleteById(id);
        
        // Se era entregue, recalcular métricas
        if (eraEntregue) {
            log.info("Pedido entregue deletado. Recalculando métricas do cliente {}", clienteId);
            clienteMetricasService.recalcularMetricasCliente(clienteId);
        }
    }
}

