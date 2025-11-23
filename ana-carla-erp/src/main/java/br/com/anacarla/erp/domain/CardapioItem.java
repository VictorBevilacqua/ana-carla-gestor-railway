package br.com.anacarla.erp.domain;

import br.com.anacarla.erp.domain.enums.CategoriaCardapio;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "cardapio_item", indexes = {
    @Index(name = "idx_cardapio_ativo", columnList = "ativo"),
    @Index(name = "idx_cardapio_categoria", columnList = "categoria"),
    @Index(name = "idx_cardapio_ordem", columnList = "ordem")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class CardapioItem extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CategoriaCardapio categoria;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal preco;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column
    private Integer ordem;
}

