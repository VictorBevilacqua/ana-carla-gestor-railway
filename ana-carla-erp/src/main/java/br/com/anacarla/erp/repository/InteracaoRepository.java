package br.com.anacarla.erp.repository;

import br.com.anacarla.erp.domain.Interacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface InteracaoRepository extends JpaRepository<Interacao, UUID> {

    List<Interacao> findByClienteIdOrderByDataHoraDesc(UUID clienteId);

    Page<Interacao> findByClienteIdOrderByDataHoraDesc(UUID clienteId, Pageable pageable);
}

