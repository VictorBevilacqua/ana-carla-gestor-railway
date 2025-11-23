package br.com.anacarla.erp.web.dto;

import br.com.anacarla.erp.domain.enums.CategoriaCardapio;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CardapioItemDTO {
    
    private UUID id;
    
    @NotNull(message = "Categoria é obrigatória")
    private CategoriaCardapio categoria;
    
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    @NotNull(message = "Preço é obrigatório")
    @Positive(message = "Preço deve ser positivo")
    private BigDecimal preco;
    
    private String descricao;
    
    private Boolean ativo;
    
    private Integer ordem;
    
    private Instant createdAt;
    private Instant updatedAt;
}

