package br.com.anacarla.erp.web.controller;

import br.com.anacarla.erp.domain.enums.StatusPedido;
import br.com.anacarla.erp.service.PedidoService;
import br.com.anacarla.erp.web.dto.PedidoDTO;
import br.com.anacarla.erp.web.dto.UpdateStatusRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/pedidos")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Pedidos", description = "Gestão de pedidos e Kanban")
public class PedidoController {

    private final PedidoService pedidoService;

    @GetMapping
    @Operation(summary = "Listar pedidos", description = "Lista pedidos, opcionalmente filtrado por status (Kanban)")
    public ResponseEntity<List<PedidoDTO>> listar(
            @RequestParam(required = false) StatusPedido status
    ) {
        List<PedidoDTO> pedidos = pedidoService.listarPorStatus(status);
        return ResponseEntity.ok(pedidos);
    }

    @PostMapping
    @Operation(summary = "Criar pedido", description = "Cria um novo pedido")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR', 'ATENDENTE')")
    public ResponseEntity<PedidoDTO> criar(@Valid @RequestBody PedidoDTO dto) {
        PedidoDTO criado = pedidoService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar pedido", description = "Busca pedido por ID")
    public ResponseEntity<PedidoDTO> buscarPorId(@PathVariable UUID id) {
        PedidoDTO pedido = pedidoService.buscarPorId(id);
        return ResponseEntity.ok(pedido);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status do pedido", description = "Atualiza o status do pedido (fluxo Kanban: RECEBIDO → PREPARANDO → PRONTO → ENTREGUE)")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR', 'ATENDENTE')")
    public ResponseEntity<PedidoDTO> atualizarStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        PedidoDTO atualizado = pedidoService.atualizarStatus(id, request.getStatus());
        return ResponseEntity.ok(atualizado);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar pedido", description = "Remove um pedido")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        pedidoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

