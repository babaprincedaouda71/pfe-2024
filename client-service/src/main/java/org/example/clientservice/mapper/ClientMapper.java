package org.example.clientservice.mapper;

import org.example.clientservice.dto.AddClientDTO;
import org.example.clientservice.dto.ClientDTO;
import org.example.clientservice.entity.Client;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
public class ClientMapper {
    private final ModelMapper modelMapper = new ModelMapper();

    public ClientDTO fromClient(Client client) {
        return modelMapper.map(client, ClientDTO.class);
    }

    public AddClientDTO fromClient1(Client client) {
        return modelMapper.map(client, AddClientDTO.class);
    }

    public Client fromClientDTO(ClientDTO clientDTO) {
        return modelMapper.map(clientDTO, Client.class);
    }

    public Client fromAddClientDTO(AddClientDTO clientDTO) {
        return modelMapper.map(clientDTO, Client.class);
    }
}
