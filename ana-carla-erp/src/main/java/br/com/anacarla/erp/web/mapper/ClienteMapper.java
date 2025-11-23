package br.com.anacarla.erp.web.mapper;

import br.com.anacarla.erp.domain.Cliente;
import br.com.anacarla.erp.web.dto.ClienteDTO;
import br.com.anacarla.erp.web.dto.ClienteMetricasDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ClienteMapper {

    @Mapping(target = "cpfCnpj", source = "cpfCnpj", qualifiedByName = "maskCpfCnpj")
    ClienteDTO toDTO(Cliente entity);

    @Mapping(target = "cpfCnpj", source = "cpfCnpj", qualifiedByName = "unmaskCpfCnpj")
    @Mapping(target = "totalPedidos", ignore = true)
    @Mapping(target = "ticketMedio", ignore = true)
    @Mapping(target = "valorTotal", ignore = true)
    @Mapping(target = "ultimaCompra", ignore = true)
    @Mapping(target = "recenciaDias", ignore = true)
    @Mapping(target = "intervaloMedioRecompra", ignore = true)
    @Mapping(target = "ltv", ignore = true)
    @Mapping(target = "rfm", ignore = true)
    Cliente toEntity(ClienteDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "totalPedidos", ignore = true)
    @Mapping(target = "ticketMedio", ignore = true)
    @Mapping(target = "valorTotal", ignore = true)
    @Mapping(target = "ultimaCompra", ignore = true)
    @Mapping(target = "recenciaDias", ignore = true)
    @Mapping(target = "intervaloMedioRecompra", ignore = true)
    @Mapping(target = "ltv", ignore = true)
    @Mapping(target = "rfm", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(ClienteDTO dto, @MappingTarget Cliente entity);

    ClienteMetricasDTO toMetricasDTO(Cliente entity);

    @Named("maskCpfCnpj")
    default String maskCpfCnpj(String cpfCnpj) {
        if (cpfCnpj == null || cpfCnpj.length() < 4) {
            return cpfCnpj;
        }
        return "***" + cpfCnpj.substring(cpfCnpj.length() - 4);
    }

    @Named("unmaskCpfCnpj")
    default String unmaskCpfCnpj(String cpfCnpj) {
        // No caso de criação/atualização, recebemos o valor real
        return cpfCnpj;
    }
}

