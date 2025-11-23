package br.com.anacarla.erp.web.mapper;

import br.com.anacarla.erp.domain.CardapioItem;
import br.com.anacarla.erp.web.dto.CardapioItemDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CardapioMapper {

    CardapioItemDTO toDTO(CardapioItem entity);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    CardapioItem toEntity(CardapioItemDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(CardapioItemDTO dto, @MappingTarget CardapioItem entity);
}

