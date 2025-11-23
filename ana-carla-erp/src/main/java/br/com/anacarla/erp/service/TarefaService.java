package br.com.anacarla.erp.service;

import br.com.anacarla.erp.domain.Tarefa;
import br.com.anacarla.erp.domain.enums.StatusTarefa;
import br.com.anacarla.erp.repository.TarefaRepository;
import br.com.anacarla.erp.web.dto.TarefaDTO;
import br.com.anacarla.erp.web.mapper.TarefaMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TarefaService {

    private final TarefaRepository tarefaRepository;
    private final TarefaMapper tarefaMapper;

    @Transactional(readOnly = true)
    public List<TarefaDTO> listarPorCliente(UUID clienteId) {
        log.debug("Listando tarefas do cliente: {}", clienteId);
        return tarefaRepository.findByClienteIdOrderByDueDateAsc(clienteId).stream()
                .map(tarefaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<TarefaDTO> listarPorStatus(StatusTarefa status, Pageable pageable) {
        log.debug("Listando tarefas por status: {}", status);
        return tarefaRepository.findByStatusOrderByDueDateAsc(status, pageable)
                .map(tarefaMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public List<TarefaDTO> listarPorResponsavel(String responsavel, StatusTarefa status) {
        log.debug("Listando tarefas do responsável {} com status {}", responsavel, status);
        return tarefaRepository.findByResponsavelAndStatusOrderByDueDateAsc(responsavel, status).stream()
                .map(tarefaMapper::toDTO)
                .collect(Collectors.toList());
    }

    public TarefaDTO criar(TarefaDTO dto) {
        log.info("Criando nova tarefa: {}", dto.getTitulo());
        
        Tarefa entity = tarefaMapper.toEntity(dto);
        entity = tarefaRepository.save(entity);
        return tarefaMapper.toDTO(entity);
    }

    @Transactional(readOnly = true)
    public TarefaDTO buscarPorId(UUID id) {
        log.debug("Buscando tarefa por ID: {}", id);
        Tarefa tarefa = tarefaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tarefa não encontrada"));
        return tarefaMapper.toDTO(tarefa);
    }

    public TarefaDTO atualizar(UUID id, TarefaDTO dto) {
        log.info("Atualizando tarefa: {}", id);
        Tarefa entity = tarefaRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tarefa não encontrada"));
        
        tarefaMapper.updateEntity(dto, entity);
        entity = tarefaRepository.save(entity);
        return tarefaMapper.toDTO(entity);
    }

    public void deletar(UUID id) {
        log.info("Deletando tarefa: {}", id);
        if (!tarefaRepository.existsById(id)) {
            throw new IllegalArgumentException("Tarefa não encontrada");
        }
        tarefaRepository.deleteById(id);
    }
}

