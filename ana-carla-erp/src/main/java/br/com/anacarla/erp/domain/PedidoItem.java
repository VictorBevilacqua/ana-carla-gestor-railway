package br.com.anacarla.erp.domain;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "pedido_item", indexes = {
    @Index(name = "idx_pedido_item_pedido", columnList = "pedido_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PedidoItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @Column(name = "item_id")
    private UUID itemId; // Referência opcional ao CardapioItem

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(name = "preco_unit", nullable = false, precision = 12, scale = 2)
    private BigDecimal precoUnit;

    @Column(name = "quantidade", nullable = false)
    private Integer quantidade;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    public BigDecimal getSubtotal() {
        return precoUnit.multiply(BigDecimal.valueOf(quantidade));
    }
}

