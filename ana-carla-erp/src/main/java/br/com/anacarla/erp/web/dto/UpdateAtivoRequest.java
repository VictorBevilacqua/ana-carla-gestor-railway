package br.com.anacarla.erp.web.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateAtivoRequest {
    
    @NotNull(message = "Ativo é obrigatório")
    private Boolean ativo;
}

