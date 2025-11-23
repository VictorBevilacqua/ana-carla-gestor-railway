package br.com.anacarla.erp.web.mapper;

import br.com.anacarla.erp.domain.Interacao;
import br.com.anacarla.erp.web.dto.InteracaoDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface InteracaoMapper {

    InteracaoDTO toDTO(Interacao entity);

    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Interacao toEntity(InteracaoDTO dto);
}

