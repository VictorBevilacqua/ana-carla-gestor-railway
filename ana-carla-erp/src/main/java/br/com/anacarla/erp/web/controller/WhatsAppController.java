package br.com.anacarla.erp.web.controller;

import br.com.anacarla.erp.service.WhatsAppService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/whatsapp")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "WhatsApp", description = "Integração com WhatsApp")
public class WhatsAppController {

    private final WhatsAppService whatsAppService;

    @PostMapping("/templates/{templateId}/enviar")
    @Operation(summary = "Enviar template WhatsApp", description = "Envia um template de mensagem WhatsApp para um cliente")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR', 'ATENDENTE')")
    public ResponseEntity<Map<String, Object>> enviarTemplate(
            @PathVariable String templateId,
            @RequestParam UUID clienteId,
            @RequestBody(required = false) Map<String, String> parametros
    ) {
        String mensagem = parametros != null ? parametros.getOrDefault("mensagem", "") : "";
        whatsAppService.enviarTemplate(templateId, clienteId, mensagem);
        
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Template enviado com sucesso",
                "templateId", templateId,
                "clienteId", clienteId.toString()
        ));
    }

    @PostMapping("/mensagem")
    @Operation(summary = "Enviar mensagem WhatsApp", description = "Envia uma mensagem direta para um cliente")
    @PreAuthorize("hasAnyRole('ADMIN', 'GESTOR', 'ATENDENTE')")
    public ResponseEntity<Map<String, Object>> enviarMensagem(
            @RequestParam UUID clienteId,
            @RequestBody Map<String, String> payload
    ) {
        String mensagem = payload.get("mensagem");
        whatsAppService.enviarMensagem(clienteId, mensagem);
        
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Mensagem enviada com sucesso"
        ));
    }
}

