package br.com.anacarla.erp.web.dto;

import br.com.anacarla.erp.domain.enums.CanalPedido;
import br.com.anacarla.erp.domain.enums.StatusPedido;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PedidoDTO {
    
    private UUID id;
    
    @NotNull(message = "Cliente é obrigatório")
    private UUID clienteId;
    
    private BigDecimal valorTotal;
    
    @NotNull(message = "Status é obrigatório")
    private StatusPedido status;
    
    @NotNull(message = "Canal é obrigatório")
    private CanalPedido canal;
    
    private Instant dataCriacao;
    
    private Instant dataEntrega;
    
    private String observacoes;
    
    @NotEmpty(message = "Pedido deve ter pelo menos um item")
    @Valid
    private List<PedidoItemDTO> itens;
    
    // Informações adicionais do cliente (para exibição)
    private String nomeCliente;
    
    private Instant createdAt;
    private Instant updatedAt;
}

