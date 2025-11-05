package br.com.anacarla.erp.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String tipo = "Bearer";
    private String role;
    private String nome;
    private String email;
    
    public LoginResponse(String token, String role, String nome, String email) {
        this.token = token;
        this.tipo = "Bearer";
        this.role = role;
        this.nome = nome;
        this.email = email;
    }
}

