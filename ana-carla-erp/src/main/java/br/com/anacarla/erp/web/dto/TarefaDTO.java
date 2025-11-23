package br.com.anacarla.erp.web.dto;

import br.com.anacarla.erp.domain.enums.OrigemTarefa;
import br.com.anacarla.erp.domain.enums.PrioridadeTarefa;
import br.com.anacarla.erp.domain.enums.StatusTarefa;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TarefaDTO {
    
    private UUID id;
    
    private UUID clienteId;
    
    @NotBlank(message = "Título é obrigatório")
    private String titulo;
    
    private String descricao;
    
    private String responsavel;
    
    @NotNull(message = "Prioridade é obrigatória")
    private PrioridadeTarefa prioridade;
    
    private Instant dueDate;
    
    @NotNull(message = "Status é obrigatório")
    private StatusTarefa status;
    
    @NotNull(message = "Origem é obrigatória")
    private OrigemTarefa origem;
    
    // Info adicional do cliente
    private String nomeCliente;
    
    private Instant createdAt;
    private Instant updatedAt;
}

