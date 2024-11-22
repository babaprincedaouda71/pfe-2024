package org.example.trainingservice.clients;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.example.trainingservice.model.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Map;
import java.util.Set;

@FeignClient(name = "CLIENT-SERVICE")
public interface ClientRest {
  Logger logger = LoggerFactory.getLogger(ClientRest.class);

  @GetMapping("/client/find/{idClient}")
  @CircuitBreaker(name = "clientService", fallbackMethod = "getDefaultClient")
  Client findClientById(@PathVariable Long idClient);

  @GetMapping("/client/all")
  @CircuitBreaker(name = "clientService", fallbackMethod = "getAllDefaultClients")
  List<Client> allClients();

  @GetMapping("/client/some")
  @CircuitBreaker(name = "clientService", fallbackMethod = "getDefaultClientsByIds")
  List<Client> findClientsByIds(@RequestParam Set<Long> ids);

  default List<Client> getDefaultClientsByIds(Set<Long> ids, Throwable exception) {
    logger.error("Fallback method for findClientsByIds triggered", exception);
    return ids.stream()
        .map(
            id -> {
                return getClient(id);
            })
        .toList();
  }

    private Client getClient(Long id) {
        Client client = new Client();
        client.setIdClient(id);
        client.setCorporateName("Not Available");
        client.setAddress("Not Available");
        client.setEmail("Not Available");
        client.setPhoneNumber("Not Available");
        client.setNameMainContact("Not Available");
        client.setEmailMainContact("Not Available");
        client.setPositionMainContact("Not Available");
        client.setPhoneNumberMainContact("Not Available");
        return client;
    }

    default Client getDefaultClient(Long idClient, Throwable exception) {
    logger.error("Fallback method for findClientById triggered", exception);
        return getClient(idClient);
    }

  default List<Client> getAllDefaultClients(Throwable exception) {
    logger.error("Fallback method for allClients triggered", exception);
    return List.of();
  }
}
