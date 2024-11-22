package org.example.trainingservice.clients;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.example.trainingservice.model.Vendor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.util.Set;

import static org.example.trainingservice.clients.ClientRest.logger;

@FeignClient(name = "VENDOR-SERVICE")
public interface VendorRest {
    @GetMapping("/vendor/find/{idVendor}")
    @CircuitBreaker(name = "vendorService", fallbackMethod = "getDefaultVendor")
    Vendor findVendorById(@PathVariable Long idVendor);

    @GetMapping("/vendor/all")
    @CircuitBreaker(name = "vendorService", fallbackMethod = "getDefaultVendors")
    List<Vendor> all();

    @GetMapping("/vendor/some")
    @CircuitBreaker(name = "vendorService", fallbackMethod = "getDefaultVendorsByIds")
    List<Vendor> findVendorsByIds(@RequestParam Set<Long> ids);

    default List<Vendor> getDefaultVendorsByIds(Set<Long> ids, Throwable exception) {
        logger.error("Fallback method for findClientsByIds triggered", exception);
        return ids.stream()
                .map(
                        id -> {
                            return getVendor(id);
                        })
                .toList();
    }

    private Vendor getVendor(Long id) {
        Vendor vendor = new Vendor();
        vendor.setIdVendor(id);
        vendor.setName("Not Available");
        vendor.setPhone("Not Available");
        vendor.setEmail("Not Available");
        vendor.setAddress("Not Available");
        vendor.setBankAccountNumber("Not Available");
        vendor.setCreatedAt(null);
        return vendor;
    }

    default Vendor getDefaultVendor(Long idVendor, Throwable exception){
        logger.error("Fallback method for findClientsByIds triggered", exception);
        return getVendor(idVendor);
    }

    default List<Vendor> getDefaultVendors(Throwable exception) {
        logger.error("Fallback method for allClients triggered", exception);
        return List.of();
    }
}
