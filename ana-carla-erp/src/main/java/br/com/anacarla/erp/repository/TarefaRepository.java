package br.com.anacarla.erp.repository;

import br.com.anacarla.erp.domain.Tarefa;
import br.com.anacarla.erp.domain.enums.StatusTarefa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, UUID> {

    List<Tarefa> findByClienteIdOrderByDueDateAsc(UUID clienteId);

    Page<Tarefa> findByStatusOrderByDueDateAsc(StatusTarefa status, Pageable pageable);

    List<Tarefa> findByResponsavelAndStatusOrderByDueDateAsc(String responsavel, StatusTarefa status);
}

