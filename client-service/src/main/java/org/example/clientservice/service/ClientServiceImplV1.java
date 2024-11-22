package org.example.clientservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.clientservice.dto.AddClientDTO;
import org.example.clientservice.dto.ClientDTO;
import org.example.clientservice.entity.Client;
import org.example.clientservice.exceptions.ApiRequestException;
import org.example.clientservice.exceptions.ClientNotFoundException;
import org.example.clientservice.mapper.ClientMapper;
import org.example.clientservice.repo.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class ClientServiceImplV1 implements ClientService {
  private final ClientRepository clientRepository;
  private final ClientMapper clientMapper;

    public ClientServiceImplV1(ClientRepository clientRepository, ClientMapper clientMapper) {
        this.clientRepository = clientRepository;
        this.clientMapper = clientMapper;
    }

    @Override
  public ClientDTO addClient(String clientDTO, MultipartFile logo) {
    ObjectMapper objectMapper = new ObjectMapper();
    try {
      Client client = objectMapper.readValue(clientDTO, Client.class);
      client.setLogo(logo.getBytes());
      try {
        Client savedClient = clientRepository.save(client);
        return clientMapper.fromClient(savedClient);
      } catch (ApiRequestException e) {
        throw new ApiRequestException("L'ajout du Client a échoué");
      }
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public List<Client> getClients() {
    List<Client> clients = clientRepository.findAll();
    if (clients.isEmpty()) {
      throw new ClientNotFoundException("Aucun Client trouvé dans la Base de Données");
    }
    return clients;
  }

  @Override
  public AddClientDTO getById(Long idClient) {
    Client client =
        clientRepository
            .findById(idClient)
            .orElseThrow(() -> new ClientNotFoundException("Le Client demandé n'existe pas"));
    return clientMapper.fromClient1(client);
  }

  @Override
  public ClientDTO updateClient(AddClientDTO clientDTO) {
    Client client =
        clientRepository
            .findById(clientDTO.getIdClient())
            .orElseThrow(
                () ->
                    new ClientNotFoundException(
                        "Le client que vous éssayé de mettre à jour n'existe pas"));
    Client client1 = clientMapper.fromAddClientDTO(clientDTO);
    client1.setLogo(client.getLogo());
    Client save = clientRepository.save(client1);
    return clientMapper.fromClient(save);
  }

  @Override
  public ClientDTO deleteClient(Long idClient) {
    Client byID =
        clientRepository
            .findById(idClient)
            .orElseThrow(
                () ->
                    new ClientNotFoundException(
                        "Le Client que vous essayé de supprimer n'existe pas"));
    clientRepository.delete(byID);
    return clientMapper.fromClient(byID);
  }

  @Override
  public int getDeadline(Long idClient) {
    Client client = clientRepository.findById(idClient).orElseThrow(() -> new ClientNotFoundException("Le Client n'existe pas"));
    return client.getDeadline();
  }

  @Override
  public List<Client> findAllById(Set<Long> ids) {
      return clientRepository.findAllById(ids);
  }
}
