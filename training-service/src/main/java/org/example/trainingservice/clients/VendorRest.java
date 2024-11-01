package org.example.trainingservice.clients;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.example.trainingservice.model.Vendor;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "VENDOR-SERVICE")
public interface VendorRest {
    @GetMapping("/vendor/find/{idVendor}")
    @CircuitBreaker(name = "vendorService", fallbackMethod = "getDefaultVendor")
    Vendor findVendorById(@PathVariable Long idVendor);

    @GetMapping("/vendor/all")
    @CircuitBreaker(name = "vendorService", fallbackMethod = "getDefaultVendors")
    List<Vendor> all();

    default Vendor getDefaultVendor(Long idVendor, Exception exception){
        Vendor vendor = new Vendor();
        vendor.setIdVendor(idVendor);
        vendor.setName("Not Available");
        vendor.setPhone("Not Available");
        vendor.setEmail("Not Available");
        vendor.setAddress("Not Available");
        vendor.setBankAccountNumber("Not Available");
        vendor.setCreatedAt(null);
        return vendor;
    }

    default List<Vendor> getDefaultVendors(Exception exception) {
        return List.of();
    }
}
