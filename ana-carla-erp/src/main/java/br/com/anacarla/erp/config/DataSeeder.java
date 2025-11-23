package br.com.anacarla.erp.config;

import br.com.anacarla.erp.domain.User;
import br.com.anacarla.erp.domain.enums.UserRole;
import br.com.anacarla.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {
            try {
                // Tentar buscar o usuário admin
                var existingUser = userRepository.findByEmail("admin@anacarla.com.br");
                
                if (existingUser.isEmpty()) {
                    // Criar usuário admin
                    User admin = User.builder()
                            .email("admin@anacarla.com.br")
                            .senha(passwordEncoder.encode("admin123"))
                            .nome("Administrador")
                            .role(UserRole.ADMIN)
                            .ativo(true)
                            .build();
                    
                    userRepository.save(admin);
                    userRepository.flush();
                    
                    log.info("===========================================");
                    log.info("✅ Usuário admin CRIADO com sucesso!");
                    log.info("   Email: admin@anacarla.com.br");
                    log.info("   Senha: admin123");
                    log.info("===========================================");
                } else {
                    log.info("ℹ️ Usuário admin já existe no banco");
                    log.info("   Email: admin@anacarla.com.br");
                }
            } catch (Exception e) {
                log.error("❌ ERRO ao criar usuário admin: {}", e.getMessage());
                e.printStackTrace();
            }
        };
    }
}

