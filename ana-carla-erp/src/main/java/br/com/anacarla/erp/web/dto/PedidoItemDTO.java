package br.com.anacarla.erp.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PedidoItemDTO {
    
    private UUID id;
    
    private UUID itemId; // Referência opcional ao CardapioItem
    
    @NotBlank(message = "Nome do item é obrigatório")
    private String nome;
    
    @NotNull(message = "Preço unitário é obrigatório")
    @Positive(message = "Preço deve ser positivo")
    private BigDecimal precoUnit;
    
    @NotNull(message = "Quantidade é obrigatória")
    @Positive(message = "Quantidade deve ser positiva")
    private Integer quantidade;
    
    private String observacoes;
}

