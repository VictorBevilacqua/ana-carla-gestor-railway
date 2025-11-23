package br.com.anacarla.erp.web.controller;

import br.com.anacarla.erp.service.CardapioService;
import br.com.anacarla.erp.service.CardapioWhatsAppFormatter;
import br.com.anacarla.erp.web.dto.CardapioItemDTO;
import br.com.anacarla.erp.web.dto.UpdateAtivoRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/cardapio")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Cardápio", description = "Gestão do cardápio")
public class CardapioController {

    private final CardapioService cardapioService;
    private final CardapioWhatsAppFormatter whatsAppFormatter;

    @GetMapping
    @Operation(summary = "Listar cardápio", description = "Lista itens do cardápio, opcionalmente filtrado por status ativo")
    public ResponseEntity<List<CardapioItemDTO>> listar(
            @RequestParam(required = false) Boolean ativo
    ) {
        List<CardapioItemDTO> itens = cardapioService.listar(ativo);
        return ResponseEntity.ok(itens);
    }

    @PostMapping
    @Operation(summary = "Criar item do cardápio", description = "Adiciona um novo item ao cardápio")
    // @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR')") // TEMPORÁRIO: Desabilitado
    public ResponseEntity<CardapioItemDTO> criar(@Valid @RequestBody CardapioItemDTO dto) {
        CardapioItemDTO criado = cardapioService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(criado);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar item do cardápio", description = "Busca item por ID")
    public ResponseEntity<CardapioItemDTO> buscarPorId(@PathVariable UUID id) {
        CardapioItemDTO item = cardapioService.buscarPorId(id);
        return ResponseEntity.ok(item);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar item do cardápio", description = "Atualiza dados do item")
    // @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR')") // TEMPORÁRIO: Desabilitado
    public ResponseEntity<CardapioItemDTO> atualizar(
            @PathVariable UUID id,
            @Valid @RequestBody CardapioItemDTO dto
    ) {
        CardapioItemDTO atualizado = cardapioService.atualizar(id, dto);
        return ResponseEntity.ok(atualizado);
    }

    @PatchMapping("/{id}/ativo")
    @Operation(summary = "Ativar/desativar item", description = "Altera o status ativo do item")
    // @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR')") // TEMPORÁRIO: Desabilitado
    public ResponseEntity<CardapioItemDTO> atualizarAtivo(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateAtivoRequest request
    ) {
        CardapioItemDTO atualizado = cardapioService.atualizarAtivo(id, request.getAtivo());
        return ResponseEntity.ok(atualizado);
    }

    @GetMapping(value = "/whatsapp-text", produces = MediaType.TEXT_PLAIN_VALUE)
    @Operation(summary = "Texto do cardápio para WhatsApp", description = "Gera texto formatado do cardápio para envio no WhatsApp")
    public ResponseEntity<String> obterTextoWhatsApp() {
        String texto = whatsAppFormatter.formatarParaWhatsApp();
        return ResponseEntity.ok(texto);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar item do cardápio", description = "Remove um item do cardápio")
    // @PreAuthorize("hasRole('ADMIN')") // TEMPORÁRIO: Desabilitado
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        cardapioService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}

