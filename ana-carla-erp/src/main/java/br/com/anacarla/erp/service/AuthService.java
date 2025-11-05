package br.com.anacarla.erp.service;

import br.com.anacarla.erp.domain.User;
import br.com.anacarla.erp.repository.UserRepository;
import br.com.anacarla.erp.web.dto.LoginRequest;
import br.com.anacarla.erp.web.dto.LoginResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        log.info("Tentativa de login para: {}", request.getEmail());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getSenha()
                    )
            );

            User user = (User) authentication.getPrincipal();
            String token = jwtService.generateToken(user);

            log.info("Login bem-sucedido para: {}", request.getEmail());

            return new LoginResponse(
                    token,
                    user.getRole().name(),
                    user.getNome(),
                    user.getEmail()
            );
        } catch (AuthenticationException e) {
            log.warn("Falha no login para: {}", request.getEmail());
            throw new IllegalArgumentException("Email ou senha inválidos");
        }
    }
}

