package br.com.anacarla.erp.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClienteMetricasDTO {
    private Integer totalPedidos;
    private BigDecimal ticketMedio;
    private BigDecimal valorTotal;
    private Instant ultimaCompra;
    private Integer recenciaDias;
    private Integer intervaloMedioRecompra;
    private BigDecimal ltv;
    private Map<String, Object> rfm;
}

