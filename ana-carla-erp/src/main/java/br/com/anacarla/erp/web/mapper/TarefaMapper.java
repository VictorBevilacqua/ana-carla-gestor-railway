package br.com.anacarla.erp.web.mapper;

import br.com.anacarla.erp.domain.Tarefa;
import br.com.anacarla.erp.web.dto.TarefaDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface TarefaMapper {

    @Mapping(target = "nomeCliente", source = "cliente.nome")
    TarefaDTO toDTO(Tarefa entity);

    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Tarefa toEntity(TarefaDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(TarefaDTO dto, @MappingTarget Tarefa entity);
}

