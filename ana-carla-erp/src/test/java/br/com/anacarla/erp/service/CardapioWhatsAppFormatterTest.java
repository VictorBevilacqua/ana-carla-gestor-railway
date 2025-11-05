package br.com.anacarla.erp.service;

import br.com.anacarla.erp.BaseIntegrationTest;
import br.com.anacarla.erp.domain.enums.CategoriaCardapio;
import br.com.anacarla.erp.web.dto.CardapioItemDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

@Transactional
class CardapioWhatsAppFormatterTest extends BaseIntegrationTest {

    @Autowired
    private CardapioWhatsAppFormatter formatter;

    @Autowired
    private CardapioService cardapioService;

    @BeforeEach
    void setUp() {
        // Criar alguns itens do cardápio
        cardapioService.criar(CardapioItemDTO.builder()
                .categoria(CategoriaCardapio.BOVINO)
                .nome("Patinho Moído Acebolado")
                .preco(BigDecimal.valueOf(18.00))
                .descricao("Alecrim e pimenta-do-reino")
                .ativo(true)
                .ordem(1)
                .build());

        cardapioService.criar(CardapioItemDTO.builder()
                .categoria(CategoriaCardapio.FRANGO)
                .nome("Filé de Frango ao Forno")
                .preco(BigDecimal.valueOf(16.00))
                .descricao("Tomilho e limão siciliano")
                .ativo(true)
                .ordem(1)
                .build());

        cardapioService.criar(CardapioItemDTO.builder()
                .categoria(CategoriaCardapio.ACOMPANHAMENTO)
                .nome("Arroz Integral")
                .preco(BigDecimal.valueOf(5.00))
                .ativo(true)
                .ordem(1)
                .build());
    }

    @Test
    void deveFormatarCardapioParaWhatsApp() {
        // When
        String texto = formatter.formatarParaWhatsApp();

        // Then
        assertThat(texto).isNotBlank();
        assertThat(texto).contains("🍱 *Cardápio da Semana*");
        assertThat(texto).contains("*Bovino*");
        assertThat(texto).contains("Patinho Moído Acebolado");
        assertThat(texto).contains("R$");
        assertThat(texto).contains("18,00");
        assertThat(texto).contains("*Frango*");
        assertThat(texto).contains("Filé de Frango ao Forno");
        assertThat(texto).contains("_Alecrim e pimenta-do-reino_");
        assertThat(texto).contains("📱 Faça seu pedido pelo WhatsApp!");
    }

    @Test
    void deveIncluirApenasItensAtivos() {
        // Given - Criar um item inativo
        cardapioService.criar(CardapioItemDTO.builder()
                .categoria(CategoriaCardapio.SOBREMESA)
                .nome("Item Inativo")
                .preco(BigDecimal.valueOf(10.00))
                .ativo(false)
                .ordem(1)
                .build());

        // When
        String texto = formatter.formatarParaWhatsApp();

        // Then
        assertThat(texto).doesNotContain("Item Inativo");
    }

    @Test
    void deveRetornarMensagemQuandoCardapioVazio() {
        // Given - Desativar todos os itens
        cardapioService.listar(true).forEach(item -> 
                cardapioService.atualizarAtivo(item.getId(), false));

        // When
        String texto = formatter.formatarParaWhatsApp();

        // Then
        assertThat(texto).isEqualTo("Cardápio não disponível no momento.");
    }
}

