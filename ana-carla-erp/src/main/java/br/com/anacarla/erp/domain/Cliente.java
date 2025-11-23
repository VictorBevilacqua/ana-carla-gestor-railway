package br.com.anacarla.erp.domain;

import io.hypersistence.utils.hibernate.type.json.JsonBinaryType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.Type;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;

@Entity
@Table(name = "clientes", indexes = {
    @Index(name = "idx_cliente_email", columnList = "email"),
    @Index(name = "idx_cliente_cpf_cnpj", columnList = "cpf_cnpj"),
    @Index(name = "idx_cliente_recencia", columnList = "recencia_dias"),
    @Index(name = "idx_cliente_ativo", columnList = "ativo")
})

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Cliente extends BaseEntity {

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(length = 500)
    private String telefones;

    @Column(length = 200)
    private String email;

    @Column(length = 500)
    private String endereco;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(name = "cpf_cnpj", length = 20)
    private String cpfCnpj;

    @Column(name = "consentimento_marketing")
    private Boolean consentimentoMarketing = false;

    @Column(name = "canal_aquisicao", length = 50)
    private String canalAquisicao;

    // JSONB fields
    @Type(JsonBinaryType.class)
    @Column(name = "preferencias_contato", columnDefinition = "jsonb")
    private Map<String, Object> preferenciasContato;

    @Type(JsonBinaryType.class)
    @Column(name = "nutricional", columnDefinition = "jsonb")
    private Map<String, Object> nutricional;

    @Type(JsonBinaryType.class)
    @Column(name = "enderecos", columnDefinition = "jsonb")
    private Map<String, Object> enderecos;

    // Métricas materializadas
    @Column(name = "total_pedidos")
    private Integer totalPedidos = 0;

    @Column(name = "ticket_medio", precision = 12, scale = 2)
    private BigDecimal ticketMedio = BigDecimal.ZERO;

    @Column(name = "valor_total", precision = 12, scale = 2)
    private BigDecimal valorTotal = BigDecimal.ZERO;

    @Column(name = "ultima_compra")
    private Instant ultimaCompra;

    @Column(name = "recencia_dias")
    private Integer recenciaDias;

    @Column(name = "intervalo_medio_recompra")
    private Integer intervaloMedioRecompra;

    @Column(name = "ltv", precision = 12, scale = 2)
    private BigDecimal ltv = BigDecimal.ZERO;

    @Type(JsonBinaryType.class)
    @Column(name = "rfm", columnDefinition = "jsonb")
    private Map<String, Object> rfm;

    @Column(nullable = false)
    private Boolean ativo = true;

    @Column(columnDefinition = "TEXT")
    private String observacoes;
}


