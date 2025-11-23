package br.com.anacarla.erp.service;

import br.com.anacarla.erp.domain.Interacao;
import br.com.anacarla.erp.repository.InteracaoRepository;
import br.com.anacarla.erp.web.dto.InteracaoDTO;
import br.com.anacarla.erp.web.mapper.InteracaoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class InteracaoService {

    private final InteracaoRepository interacaoRepository;
    private final InteracaoMapper interacaoMapper;

    @Transactional(readOnly = true)
    public List<InteracaoDTO> listarPorCliente(UUID clienteId) {
        log.debug("Listando interações do cliente: {}", clienteId);
        return interacaoRepository.findByClienteIdOrderByDataHoraDesc(clienteId).stream()
                .map(interacaoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<InteracaoDTO> listarPorClientePaginado(UUID clienteId, Pageable pageable) {
        log.debug("Listando interações do cliente (paginado): {}", clienteId);
        return interacaoRepository.findByClienteIdOrderByDataHoraDesc(clienteId, pageable)
                .map(interacaoMapper::toDTO);
    }

    public InteracaoDTO criar(InteracaoDTO dto) {
        log.info("Criando nova interação para cliente: {}", dto.getClienteId());
        
        Interacao entity = interacaoMapper.toEntity(dto);
        
        // Configurar data/hora se não fornecida
        if (entity.getDataHora() == null) {
            entity.setDataHora(Instant.now());
        }
        
        entity = interacaoRepository.save(entity);
        return interacaoMapper.toDTO(entity);
    }

    @Transactional(readOnly = true)
    public InteracaoDTO buscarPorId(UUID id) {
        log.debug("Buscando interação por ID: {}", id);
        Interacao interacao = interacaoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Interação não encontrada"));
        return interacaoMapper.toDTO(interacao);
    }

    public void deletar(UUID id) {
        log.info("Deletando interação: {}", id);
        if (!interacaoRepository.existsById(id)) {
            throw new IllegalArgumentException("Interação não encontrada");
        }
        interacaoRepository.deleteById(id);
    }
}

