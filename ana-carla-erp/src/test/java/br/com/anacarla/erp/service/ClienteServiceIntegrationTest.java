package br.com.anacarla.erp.service;

import br.com.anacarla.erp.BaseIntegrationTest;
import br.com.anacarla.erp.web.dto.ClienteDTO;
import br.com.anacarla.erp.web.dto.ClienteMetricasDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@Transactional
class ClienteServiceIntegrationTest extends BaseIntegrationTest {

    @Autowired
    private ClienteService clienteService;

    @Test
    void deveCriarCliente() {
        // Given
        ClienteDTO dto = ClienteDTO.builder()
                .nome("João Silva")
                .email("joao@example.com")
                .telefones("11999999999")
                .dataNascimento(LocalDate.of(1990, 5, 15))
                .cpfCnpj("12345678900")
                .consentimentoMarketing(true)
                .build();

        // When
        ClienteDTO criado = clienteService.criar(dto);

        // Then
        assertThat(criado).isNotNull();
        assertThat(criado.getId()).isNotNull();
        assertThat(criado.getNome()).isEqualTo("João Silva");
        assertThat(criado.getEmail()).isEqualTo("joao@example.com");
        assertThat(criado.getTotalPedidos()).isZero();
    }

    @Test
    void naoDeveCriarClienteComEmailDuplicado() {
        // Given
        ClienteDTO dto1 = ClienteDTO.builder()
                .nome("Maria Santos")
                .email("maria@example.com")
                .build();
        clienteService.criar(dto1);

        ClienteDTO dto2 = ClienteDTO.builder()
                .nome("Maria Oliveira")
                .email("maria@example.com")
                .build();

        // When/Then
        assertThatThrownBy(() -> clienteService.criar(dto2))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Email já cadastrado");
    }

    @Test
    void deveAtualizarCliente() {
        // Given
        ClienteDTO criado = clienteService.criar(ClienteDTO.builder()
                .nome("Pedro Costa")
                .email("pedro@example.com")
                .build());

        UUID id = criado.getId();

        // When
        ClienteDTO atualizado = ClienteDTO.builder()
                .nome("Pedro Costa Junior")
                .telefones("11988887777")
                .build();

        ClienteDTO resultado = clienteService.atualizar(id, atualizado);

        // Then
        assertThat(resultado.getNome()).isEqualTo("Pedro Costa Junior");
        assertThat(resultado.getTelefones()).isEqualTo("11988887777");
        assertThat(resultado.getEmail()).isEqualTo("pedro@example.com"); // Email não mudou
    }

    @Test
    void deveObterMetricasCliente() {
        // Given
        ClienteDTO criado = clienteService.criar(ClienteDTO.builder()
                .nome("Ana Paula")
                .email("ana@example.com")
                .build());

        // When
        ClienteMetricasDTO metricas = clienteService.obterMetricas(criado.getId());

        // Then
        assertThat(metricas).isNotNull();
        assertThat(metricas.getTotalPedidos()).isZero();
        assertThat(metricas.getValorTotal()).isNotNull();
    }

    @Test
    void deveBuscarClientePorId() {
        // Given
        ClienteDTO criado = clienteService.criar(ClienteDTO.builder()
                .nome("Carlos Eduardo")
                .email("carlos@example.com")
                .build());

        // When
        ClienteDTO encontrado = clienteService.buscarPorId(criado.getId());

        // Then
        assertThat(encontrado).isNotNull();
        assertThat(encontrado.getId()).isEqualTo(criado.getId());
        assertThat(encontrado.getNome()).isEqualTo("Carlos Eduardo");
    }

    @Test
    void deveLancarExcecaoQuandoClienteNaoEncontrado() {
        // Given
        UUID idInexistente = UUID.randomUUID();

        // When/Then
        assertThatThrownBy(() -> clienteService.buscarPorId(idInexistente))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Cliente não encontrado");
    }
}

