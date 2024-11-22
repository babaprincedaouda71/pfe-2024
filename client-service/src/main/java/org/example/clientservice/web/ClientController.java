package org.example.clientservice.web;

import lombok.AllArgsConstructor;
import org.example.clientservice.dto.AddClientDTO;
import org.example.clientservice.dto.ClientDTO;
import org.example.clientservice.entity.Client;
import org.example.clientservice.service.ClientService;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@RestController
@AllArgsConstructor
@RequestMapping("/client")
public class ClientController {
  private ClientService clientService;

  @PostMapping(
      value = {"/add"},
      consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
  @PreAuthorize("hasAuthority('admin')")
  public ClientDTO addClient(
      @RequestParam("clientData") String clientDTO,
      @RequestParam(value = "logo", required = false) MultipartFile logo) {
    return clientService.addClient(clientDTO, logo);
  }

  @GetMapping("/all")
  @PreAuthorize("hasAnyAuthority('admin','user')")
  public List<Client> getClients() {
    return clientService.getClients();
  }

  @GetMapping("/find/{idClient}")
  @PreAuthorize("hasAnyAuthority('admin','user')")
  public AddClientDTO getById(@PathVariable Long idClient) {
    return clientService.getById(idClient);
  }

  @GetMapping("/find/getDeadline/{idClient}")
  @PreAuthorize("hasAnyAuthority('admin','user')")
  public int getDeadline(@PathVariable Long idClient) {
    return clientService.getDeadline(idClient);
  }

  @PutMapping("/update")
  @PreAuthorize("hasAuthority('admin')")
  public ClientDTO updateClient(@RequestBody AddClientDTO clientDTO) {
    return clientService.updateClient(clientDTO);
  }

  @DeleteMapping("/delete/{idClient}")
  @PreAuthorize("hasAuthority('admin')")
  public ClientDTO deleteClient(@PathVariable Long idClient) {
    return clientService.deleteClient(idClient);
  }

  @GetMapping("/some")
  @PreAuthorize("hasAnyAuthority('admin','user')")
  public List<Client> findClientsByIds(@RequestParam Set<Long> ids) {
    return clientService.findAllById(ids);
  }

}
