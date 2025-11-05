package br.com.anacarla.erp.web.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClienteDTO {
    
    private UUID id;
    
    @NotBlank(message = "Nome é obrigatório")
    private String nome;
    
    private String telefones;
    
    @Email(message = "Email inválido")
    private String email;
    
    private LocalDate dataNascimento;
    
    private String cpfCnpj; // Mascarado na saída
    
    private Boolean consentimentoMarketing;
    
    private String canalAquisicao;
    
    private Map<String, Object> preferenciasContato;
    
    private Map<String, Object> nutricional;
    
    private Map<String, Object> enderecos;
    
    // Métricas (apenas leitura)
    private Integer totalPedidos;
    private BigDecimal ticketMedio;
    private BigDecimal valorTotal;
    private Instant ultimaCompra;
    private Integer recenciaDias;
    private Integer intervaloMedioRecompra;
    private BigDecimal ltv;
    private Map<String, Object> rfm;
    
    private Instant createdAt;
    private Instant updatedAt;
}

