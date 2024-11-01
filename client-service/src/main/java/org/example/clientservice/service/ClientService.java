package org.example.clientservice.service;

import org.example.clientservice.dto.AddClientDTO;
import org.example.clientservice.dto.ClientDTO;
import org.example.clientservice.entity.Client;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Stream;

public interface ClientService {
  ClientDTO addClient(String clientDTO, MultipartFile logo);

  List<Client> getClients();

  AddClientDTO getById(Long idClient);

  ClientDTO updateClient(AddClientDTO clientDTO);

  ClientDTO deleteClient(Long idClient);

    int getDeadline(Long idClient);
}
