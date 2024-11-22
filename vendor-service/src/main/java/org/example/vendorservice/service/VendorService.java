package org.example.vendorservice.service;


import org.example.vendorservice.dto.VendorDTO;
import org.example.vendorservice.entity.Vendor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

public interface VendorService {
    VendorDTO addVendor(String vendor, MultipartFile rib, MultipartFile cv, MultipartFile contract, MultipartFile convention, MultipartFile ctr);

    List<VendorDTO> getAllVendors();

    Vendor getVendor(Long id);

    Vendor deleteVendor(Long id);

    Vendor updateVendor(Vendor vendor);

    List<Vendor> findAllById(Set<Long> ids);
}
