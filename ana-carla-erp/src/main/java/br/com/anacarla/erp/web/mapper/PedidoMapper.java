package br.com.anacarla.erp.web.mapper;

import br.com.anacarla.erp.domain.Pedido;
import br.com.anacarla.erp.domain.PedidoItem;
import br.com.anacarla.erp.web.dto.PedidoDTO;
import br.com.anacarla.erp.web.dto.PedidoItemDTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PedidoMapper {

    @Mapping(target = "nomeCliente", source = "cliente.nome")
    PedidoDTO toDTO(Pedido entity);

    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "itens", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Pedido toEntity(PedidoDTO dto);

    @Mapping(target = "pedido", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PedidoItem toItemEntity(PedidoItemDTO dto);

    PedidoItemDTO toItemDTO(PedidoItem entity);

    List<PedidoItemDTO> toItemDTOList(List<PedidoItem> entities);
}

