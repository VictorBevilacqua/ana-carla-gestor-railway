package br.com.anacarla.erp.service;

import br.com.anacarla.erp.domain.Cliente;
import br.com.anacarla.erp.repository.ClienteRepository;
import br.com.anacarla.erp.repository.PedidoRepository;
import br.com.anacarla.erp.web.dto.ClienteDTO;
import br.com.anacarla.erp.web.dto.ClienteMetricasDTO;
import br.com.anacarla.erp.web.mapper.ClienteMapper;
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
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final PedidoRepository pedidoRepository;
    private final ClienteMapper clienteMapper;

    @Transactional(readOnly = true)
    public List<ClienteDTO> listarTodos(String busca) {
        log.debug("Listando todos os clientes com termo: {}", busca);
        List<Cliente> clientes;

        if (busca == null || busca.isBlank()) {
            clientes = clienteRepository.findByAtivoTrue();
        } else {
            clientes = clienteRepository.findByAtivoTrue().stream()
                    .filter(c -> c.getNome().toLowerCase().contains(busca.toLowerCase())
                            || (c.getEmail() != null && c.getEmail().toLowerCase().contains(busca.toLowerCase()))
                            || (c.getTelefones() != null && c.getTelefones().contains(busca)))
                    .collect(Collectors.toList());
        }

        return clientes.stream()
                .map(clienteMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ClienteDTO> buscar(String busca, Pageable pageable) {
        log.debug("Buscando clientes com termo: {}", busca);
        if (busca == null || busca.isBlank()) {
            return clienteRepository.findByAtivoTrue(pageable)   // se quiser, cria esse método
                    .map(clienteMapper::toDTO);
        }
        return clienteRepository.buscar(busca, pageable)
                .map(clienteMapper::toDTO);
    }

    public ClienteDTO criar(ClienteDTO dto) {
        log.info("Criando novo cliente: {}", dto.getNome());

        if (dto.getEmail() != null && clienteRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email já cadastrado");
        }

        if (dto.getCpfCnpj() != null && clienteRepository.findByCpfCnpj(dto.getCpfCnpj()).isPresent()) {
            throw new IllegalArgumentException("CPF/CNPJ já cadastrado");
        }

        Cliente entity = clienteMapper.toEntity(dto);
        // garante que começa ativo
        entity.setAtivo(true);

        entity = clienteRepository.save(entity);
        return clienteMapper.toDTO(entity);
    }

    @Transactional(readOnly = true)
    public ClienteDTO buscarPorId(UUID id) {
        log.debug("Buscando cliente por ID: {}", id);
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
        return clienteMapper.toDTO(cliente);
    }

    public ClienteDTO atualizar(UUID id, ClienteDTO dto) {
        log.info("Atualizando cliente: {}", id);
        Cliente entity = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        if (dto.getEmail() != null && !dto.getEmail().equals(entity.getEmail())) {
            if (clienteRepository.findByEmail(dto.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email já cadastrado");
            }
        }

        clienteMapper.updateEntity(dto, entity);
        entity = clienteRepository.save(entity);
        return clienteMapper.toDTO(entity);
    }

    @Transactional(readOnly = true)
    public ClienteMetricasDTO obterMetricas(UUID id) {
        log.debug("Obtendo métricas do cliente: {}", id);
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));
        return clienteMapper.toMetricasDTO(cliente);
    }

    public void deletar(UUID id) {
        log.info("Inativando / deletando cliente: {}", id);

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado"));

        // Se tiver pedidos, só inativa
        if (pedidoRepository.existsByCliente_Id(id)) {
            cliente.setAtivo(false);
            clienteRepository.save(cliente);
            return;
        }

        // Se não tiver pedidos, pode excluir de verdade
        clienteRepository.delete(cliente);
    }
}
