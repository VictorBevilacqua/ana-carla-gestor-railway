package br.com.anacarla.erp.domain;

import br.com.anacarla.erp.domain.enums.OrigemTarefa;
import br.com.anacarla.erp.domain.enums.PrioridadeTarefa;
import br.com.anacarla.erp.domain.enums.StatusTarefa;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "tarefas", indexes = {
    @Index(name = "idx_tarefa_cliente", columnList = "cliente_id"),
    @Index(name = "idx_tarefa_status", columnList = "status"),
    @Index(name = "idx_tarefa_responsavel", columnList = "responsavel"),
    @Index(name = "idx_tarefa_due_date", columnList = "due_date")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Tarefa extends BaseEntity {

    @Column(name = "cliente_id")
    private UUID clienteId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", insertable = false, updatable = false)
    private Cliente cliente;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(length = 100)
    private String responsavel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private PrioridadeTarefa prioridade;

    @Column(name = "due_date")
    private Instant dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private StatusTarefa status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private OrigemTarefa origem;
}

