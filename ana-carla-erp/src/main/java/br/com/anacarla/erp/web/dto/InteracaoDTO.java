package br.com.anacarla.erp.web.dto;

import br.com.anacarla.erp.domain.enums.TipoInteracao;
import com.fasterxml.jackson.annotation.JsonInclude;
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
public class InteracaoDTO {
    
    private UUID id;
    
    @NotNull(message = "Cliente é obrigatório")
    private UUID clienteId;
    
    @NotNull(message = "Tipo é obrigatório")
    private TipoInteracao tipo;
    
    private String resumo;
    
    private String anexoUrl;
    
    private String autor;
    
    private Instant dataHora;
    
    private Instant createdAt;
}

