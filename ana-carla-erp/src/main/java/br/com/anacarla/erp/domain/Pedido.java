package br.com.anacarla.erp.domain;

import br.com.anacarla.erp.domain.enums.CanalPedido;
import br.com.anacarla.erp.domain.enums.StatusPedido;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "pedidos", indexes = {
    @Index(name = "idx_pedido_status", columnList = "status"),
    @Index(name = "idx_pedido_cliente", columnList = "cliente_id"),
    @Index(name = "idx_pedido_data_criacao", columnList = "data_criacao"),
    @Index(name = "idx_pedido_status_data", columnList = "status,data_criacao")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Pedido extends BaseEntity {

    @Column(name = "cliente_id", nullable = false)
    private UUID clienteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", insertable = false, updatable = false)
    private Cliente cliente;

    @Column(name = "valor_total", nullable = false, precision = 12, scale = 2)
    private BigDecimal valorTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private StatusPedido status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private CanalPedido canal;

    @Column(name = "data_criacao", nullable = false)
    private Instant dataCriacao;

    @Column(name = "data_entrega")
    private Instant dataEntrega;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoItem> itens = new ArrayList<>();

    public void addItem(PedidoItem item) {
        itens.add(item);
        item.setPedido(this);
    }

    public void removeItem(PedidoItem item) {
        itens.remove(item);
        item.setPedido(null);
    }
}

