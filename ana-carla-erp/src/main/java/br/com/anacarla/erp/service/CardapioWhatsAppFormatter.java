package br.com.anacarla.erp.service;

import br.com.anacarla.erp.domain.CardapioItem;
import br.com.anacarla.erp.domain.enums.CategoriaCardapio;
import br.com.anacarla.erp.repository.CardapioItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CardapioWhatsAppFormatter {

    private final CardapioItemRepository cardapioItemRepository;
    private static final NumberFormat CURRENCY_FORMAT = NumberFormat.getCurrencyInstance(new Locale("pt", "BR"));

    @Transactional(readOnly = true)
    public String formatarParaWhatsApp() {
        log.debug("Formatando cardápio para WhatsApp");
        
        List<CardapioItem> itensAtivos = cardapioItemRepository.findByAtivoOrderByOrdemAsc(true);
        
        if (itensAtivos.isEmpty()) {
            return "Cardápio não disponível no momento.";
        }

        // Agrupar por categoria
        Map<CategoriaCardapio, List<CardapioItem>> itensPorCategoria = itensAtivos.stream()
                .collect(Collectors.groupingBy(CardapioItem::getCategoria));

        StringBuilder sb = new StringBuilder();
        sb.append("🍱 *Cardápio da Semana*\n\n");

        // Ordenar categorias
        List<CategoriaCardapio> categoriasOrdenadas = itensPorCategoria.keySet().stream()
                .sorted()
                .toList();

        for (CategoriaCardapio categoria : categoriasOrdenadas) {
            List<CardapioItem> itens = itensPorCategoria.get(categoria);
            
            sb.append("*").append(formatarCategoria(categoria)).append("*\n");
            
            for (CardapioItem item : itens) {
                sb.append("• ").append(item.getNome())
                  .append(" - ").append(formatarPreco(item.getPreco()))
                  .append("\n");
                
                if (item.getDescricao() != null && !item.getDescricao().isBlank()) {
                    sb.append("  _").append(item.getDescricao()).append("_\n");
                }
            }
            sb.append("\n");
        }

        sb.append("📱 Faça seu pedido pelo WhatsApp!");

        return sb.toString();
    }

    private String formatarCategoria(CategoriaCardapio categoria) {
        return switch (categoria) {
            case BOVINO -> "Bovino";
            case FRANGO -> "Frango";
            case PORCO -> "Porco";
            case PEIXE -> "Peixe";
            case VEGETARIANO -> "Vegetariano";
            case ACOMPANHAMENTO -> "Acompanhamentos";
            case SALADA -> "Saladas";
            case SOBREMESA -> "Sobremesas";
            case BEBIDA -> "Bebidas";
        };
    }

    private String formatarPreco(BigDecimal preco) {
        return CURRENCY_FORMAT.format(preco);
    }
}

