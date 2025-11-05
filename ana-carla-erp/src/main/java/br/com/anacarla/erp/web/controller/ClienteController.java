package br.com.anacarla.erp.web.controller;

import br.com.anacarla.erp.service.ClienteService;
import br.com.anacarla.erp.service.InteracaoService;
import br.com.anacarla.erp.service.TarefaService;
import br.com.anacarla.erp.web.dto.ClienteDTO;
import br.com.anacarla.erp.web.dto.ClienteMetricasDTO;
import br.com.anacarla.erp.web.dto.InteracaoDTO;
import br.com.anacarla.erp.web.dto.TarefaDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Clientes", description = "Gestão de clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final InteracaoService interacaoService;
    private final TarefaService tarefaService;

    @GetMapping
    @Operation(summary = "Listar clientes", description = "Lista clientes com busca e paginação")
    public ResponseEntity<Page<ClienteDTO>> listar(
            @RequestParam(required = false) String buscar,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ClienteDTO> clientes = clienteService.buscar(buscar, pageable);
        return ResponseEntity.ok(clientes);
    }

    @PostMapping
    @Operation(summary = "Criar cliente", description = "Cria um novo cliente")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR', 'ATENDENTE')")
    public ResponseEntity<ClienteDTO> criar(@Valid @RequestBody ClienteDTO dto) {
        ClienteDTO criado = clienteService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar cliente", description = "Busca cliente por ID")
    public ResponseEntity<ClienteDTO> buscarPorId(@PathVariable UUID id) {
        ClienteDTO cliente = clienteService.buscarPorId(id);
        return ResponseEntity.ok(cliente);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar cliente", description = "Atualiza dados do cliente")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR', 'ATENDENTE')")
    public ResponseEntity<ClienteDTO> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody ClienteDTO dto
    ) {
        ClienteDTO atualizado = clienteService.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    @GetMapping("/{id}/metricas")
    @Operation(summary = "Obter métricas do cliente", description = "Retorna métricas calculadas do cliente")
    public ResponseEntity<ClienteMetricasDTO> obterMetricas(@PathVariable UUID id) {
        ClienteMetricasDTO metricas = clienteService.obterMetricas(id);
        return ResponseEntity.ok(metricas);
    }

    @GetMapping("/{id}/interacoes")
    @Operation(summary = "Listar interações do cliente", description = "Lista todas as interações do cliente")
    public ResponseEntity<List<InteracaoDTO>> listarInteracoes(@PathVariable UUID id) {
        List<InteracaoDTO> interacoes = interacaoService.listarPorCliente(id);
        return ResponseEntity.ok(interacoes);
    }

    @PostMapping("/{id}/tarefas")
    @Operation(summary = "Criar tarefa para cliente", description = "Cria uma nova tarefa para o cliente")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR', 'ATENDENTE')")
    public ResponseEntity<TarefaDTO> criarTarefa(
            @PathVariable UUID id,
            @Valid @RequestBody TarefaDTO dto
    ) {
        dto.setClienteId(id);
        TarefaDTO criada = tarefaService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criada);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar cliente", description = "Remove um cliente")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        clienteService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

