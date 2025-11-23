package br.com.anacarla.erp.domain;

import br.com.anacarla.erp.domain.enums.TipoInteracao;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "interacoes", indexes = {
    @Index(name = "idx_interacao_cliente", columnList = "cliente_id"),
    @Index(name = "idx_interacao_data", columnList = "data_hora"),
    @Index(name = "idx_interacao_tipo", columnList = "tipo")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Interacao extends BaseEntity {

    @Column(name = "cliente_id", nullable = false)
    private UUID clienteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", insertable = false, updatable = false)
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TipoInteracao tipo;

    @Column(columnDefinition = "TEXT")
    private String resumo;

    @Column(name = "anexo_url", length = 500)
    private String anexoUrl;

    @Column(length = 100)
    private String autor;

    @Column(name = "data_hora", nullable = false)
    private Instant dataHora;
}

