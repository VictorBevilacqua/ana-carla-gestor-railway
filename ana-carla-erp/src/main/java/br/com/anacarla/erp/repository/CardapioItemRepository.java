package br.com.anacarla.erp.repository;

import br.com.anacarla.erp.domain.CardapioItem;
import br.com.anacarla.erp.domain.enums.CategoriaCardapio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CardapioItemRepository extends JpaRepository<CardapioItem, UUID> {

    List<CardapioItem> findByAtivoOrderByOrdemAsc(Boolean ativo);

    List<CardapioItem> findByCategoriaAndAtivoOrderByOrdemAsc(CategoriaCardapio categoria, Boolean ativo);

    List<CardapioItem> findAllByOrderByCategoriaAscOrdemAsc();
}

