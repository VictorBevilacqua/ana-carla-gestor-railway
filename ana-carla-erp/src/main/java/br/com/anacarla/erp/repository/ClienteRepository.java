package br.com.anacarla.erp.repository;

import br.com.anacarla.erp.domain.Cliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, UUID> {

    Optional<Cliente> findByEmail(String email);

    Optional<Cliente> findByCpfCnpj(String cpfCnpj);

    @Query("SELECT c FROM Cliente c WHERE " +
           "LOWER(c.nome) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "LOWER(c.email) LIKE LOWER(CONCAT('%', :busca, '%')) OR " +
           "c.telefones LIKE CONCAT('%', :busca, '%')")
    Page<Cliente> buscar(@Param("busca") String busca, Pageable pageable);

    @Query("SELECT c FROM Cliente c WHERE c.recenciaDias > :limiar")
    List<Cliente> findClientesEmRiscoChurn(@Param("limiar") Integer limiar);

    @Query("SELECT AVG(c.intervaloMedioRecompra) FROM Cliente c WHERE c.intervaloMedioRecompra IS NOT NULL")
    Double calcularIntervaloMedioGlobal();
}

