package br.com.anacarla.erp.web.dto;

import br.com.anacarla.erp.domain.enums.StatusPedido;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateStatusRequest {
    
    @NotNull(message = "Status é obrigatório")
    private StatusPedido status;
}

