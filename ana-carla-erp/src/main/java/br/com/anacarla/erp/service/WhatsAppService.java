package br.com.anacarla.erp.service;

import br.com.anacarla.erp.domain.enums.TipoInteracao;
import br.com.anacarla.erp.web.dto.InteracaoDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

/**
 * Serviço para integração com WhatsApp.
 * Inicialmente é um stub que simula envios e registra interações.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WhatsAppService {

    private final InteracaoService interacaoService;

    public void enviarTemplate(String templateId, UUID clienteId, String mensagem) {
        log.info("Simulando envio de template WhatsApp '{}' para cliente {}", templateId, clienteId);
        
        // TODO: Integrar com API real do WhatsApp Business
        // Por enquanto, apenas simula o envio
        
        // Registrar a interação
        InteracaoDTO interacao = InteracaoDTO.builder()
                .clienteId(clienteId)
                .tipo(TipoInteracao.WHATSAPP)
                .resumo("Template enviado: " + templateId)
                .autor("Sistema")
                .dataHora(Instant.now())
                .build();
        
        interacaoService.criar(interacao);
        
        log.info("Template enviado e interação registrada para cliente {}", clienteId);
    }

    public void enviarMensagem(UUID clienteId, String mensagem) {
        log.info("Simulando envio de mensagem WhatsApp para cliente {}", clienteId);
        
        // TODO: Integrar com API real do WhatsApp Business
        
        // Registrar a interação
        InteracaoDTO interacao = InteracaoDTO.builder()
                .clienteId(clienteId)
                .tipo(TipoInteracao.WHATSAPP)
                .resumo(mensagem.length() > 100 ? mensagem.substring(0, 100) + "..." : mensagem)
                .autor("Sistema")
                .dataHora(Instant.now())
                .build();
        
        interacaoService.criar(interacao);
        
        log.info("Mensagem enviada e interação registrada para cliente {}", clienteId);
    }
}

