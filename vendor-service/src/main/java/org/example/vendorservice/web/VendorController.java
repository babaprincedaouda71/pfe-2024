package org.example.vendorservice.web;

import org.example.vendorservice.dto.VendorDTO;
import org.example.vendorservice.entity.Vendor;
import org.example.vendorservice.service.VendorService;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/vendor")
public class VendorController {
    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @PostMapping(value = {"/add"}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    @PreAuthorize("hasAuthority('admin')")
    public VendorDTO addVendor(
            @RequestParam(value = "vendorData") String vendor,
            @RequestParam(value = "rib", required = false) MultipartFile rib,
            @RequestParam(value = "cv", required = false) MultipartFile cv,
            @RequestParam(value = "contract", required = false) MultipartFile contract,
            @RequestParam(value = "convention", required = false) MultipartFile convention,
            @RequestParam(value = "ctr", required = false) MultipartFile ctr) {
        return vendorService.addVendor(vendor, rib, cv, contract, convention, ctr);
    }

    @GetMapping("/find/all")
    public List<VendorDTO> getAllVendors() {
        return vendorService.getAllVendors();
    }

    @GetMapping("/find/{idVendor}")
    public Vendor getVendor(@PathVariable long idVendor) {
        return vendorService.getVendor(idVendor);
    }

    @PutMapping("/update")
    public Vendor updateVendor(@RequestBody Vendor vendor) {
        return vendorService.updateVendor(vendor);
    }

    @DeleteMapping("/delete/{idVendor}")
    public Vendor deleteVendor(@PathVariable long idVendor) {
        return vendorService.deleteVendor(idVendor);
    }

    @GetMapping("/some")
    @PreAuthorize("hasAnyAuthority('admin','user')")
    public List<Vendor> findVendorsByIds(@RequestParam Set<Long> ids) {
        return vendorService.findAllById(ids);
    }
}
