package org.example.invoicingservice.client;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.example.invoicingservice.model.Client;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "CLIENT-SERVICE")
public interface ClientRest {
    Logger logger = LoggerFactory.getLogger(ClientRest.class);

    @GetMapping("/client/find/{idClient}")
    @CircuitBreaker(name = "clientService", fallbackMethod = "getDefaultClient")
    Client findClientById(@PathVariable Long idClient);

    @GetMapping("/client/all")
    @CircuitBreaker(name = "clientService", fallbackMethod = "getAllDefaultClients")
    List<Client> allClients();

    default Client getDefaultClient(Long idClient, Throwable exception) {
        logger.error("Fallback method for findClientById triggered", exception);
        Client client = new Client();
        client.setIdClient(idClient);
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

    default List<Client> getAllDefaultClients(Throwable exception) {
        logger.error("Fallback method for allClients triggered", exception);
        return List.of();
    }
}
