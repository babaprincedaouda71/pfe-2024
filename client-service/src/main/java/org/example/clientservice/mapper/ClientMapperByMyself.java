package org.example.clientservice.mapper;

import org.example.clientservice.dto.ClientDTO;
import org.example.clientservice.entity.Client;
import org.springframework.stereotype.Service;

import java.util.function.Function;

@Service
public class ClientMapperByMyself implements Function<Client, ClientDTO> {
    @Override
    public ClientDTO apply(Client client) {
        return new ClientDTO(
                client.getIdClient(),
                client.getCorporateName(),
                client.getAddress(),
                client.getEmail(),
                client.getNameMainContact(),
                client.getWebsite(),
                client.getColor(),
                client.getPhoneNumber());
    }
}
