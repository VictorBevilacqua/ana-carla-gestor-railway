package br.com.anacarla.erp.domain.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum CategoriaCardapio {
    PROTEINA("Proteína"),
    SALADA("Salada"),
    ACOMPANHAMENTO("Acompanhamento"),
    BEBIDA("Bebida"),
    BOWL("Bowl"),
    SOBREMESA("Sobremesa");

    private final String valor;

    CategoriaCardapio(String valor) {
        this.valor = valor;
    }

    @JsonValue
    public String getValor() {
        return valor;
    }
}

