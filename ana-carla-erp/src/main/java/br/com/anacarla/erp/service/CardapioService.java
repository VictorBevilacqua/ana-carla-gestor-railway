package br.com.anacarla.erp.service;

import br.com.anacarla.erp.domain.CardapioItem;
import br.com.anacarla.erp.repository.CardapioItemRepository;
import br.com.anacarla.erp.web.dto.CardapioItemDTO;
import br.com.anacarla.erp.web.mapper.CardapioMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CardapioService {

    private final CardapioItemRepository cardapioItemRepository;
    private final CardapioMapper cardapioMapper;

    @Transactional(readOnly = true)
    @Cacheable(value = "cardapio", key = "#ativo != null ? #ativo : 'all'")
    public List<CardapioItemDTO> listar(Boolean ativo) {
        log.debug("Listando itens do cardápio (ativo: {})", ativo);
        List<CardapioItem> itens;
        
        if (ativo != null) {
            itens = cardapioItemRepository.findByAtivoOrderByOrdemAsc(ativo);
        } else {
            itens = cardapioItemRepository.findAllByOrderByCategoriaAscOrdemAsc();
        }
        
        return itens.stream()
                .map(cardapioMapper::toDTO)
                .collect(Collectors.toList());
    }

    @CacheEvict(value = "cardapio", allEntries = true)
    public CardapioItemDTO criar(CardapioItemDTO dto) {
        log.info("Criando novo item do cardápio: {}", dto.getNome());
        CardapioItem entity = cardapioMapper.toEntity(dto);
        entity = cardapioItemRepository.save(entity);
        return cardapioMapper.toDTO(entity);
    }

    @Transactional(readOnly = true)
    public CardapioItemDTO buscarPorId(UUID id) {
        log.debug("Buscando item do cardápio por ID: {}", id);
        CardapioItem item = cardapioItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado"));
        return cardapioMapper.toDTO(item);
    }

    @CacheEvict(value = "cardapio", allEntries = true)
    public CardapioItemDTO atualizar(UUID id, CardapioItemDTO dto) {
        log.info("Atualizando item do cardápio: {}", id);
        CardapioItem entity = cardapioItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado"));
        
        cardapioMapper.updateEntity(dto, entity);
        entity = cardapioItemRepository.save(entity);
        return cardapioMapper.toDTO(entity);
    }

    @CacheEvict(value = "cardapio", allEntries = true)
    public CardapioItemDTO atualizarAtivo(UUID id, Boolean ativo) {
        log.info("Atualizando status ativo do item {}: {}", id, ativo);
        CardapioItem entity = cardapioItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado"));
        
        entity.setAtivo(ativo);
        entity = cardapioItemRepository.save(entity);
        return cardapioMapper.toDTO(entity);
    }

    @CacheEvict(value = "cardapio", allEntries = true)
    public void deletar(UUID id) {
        log.info("Deletando item do cardápio: {}", id);
        if (!cardapioItemRepository.existsById(id)) {
            throw new IllegalArgumentException("Item não encontrado");
        }
        cardapioItemRepository.deleteById(id);
    }
}

