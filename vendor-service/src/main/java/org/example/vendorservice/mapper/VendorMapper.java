package org.example.vendorservice.mapper;

import org.modelmapper.ModelMapper;
import org.example.vendorservice.dto.VendorDTO;
import org.example.vendorservice.entity.Vendor;
import org.springframework.stereotype.Service;

@Service
public class VendorMapper {
    private final ModelMapper modelMapper = new ModelMapper();

    public VendorDTO fromVendor(Vendor vendor) {
        return modelMapper.map(vendor, VendorDTO.class);
    }

    public Vendor fromVendorDTO(VendorDTO vendorDTO) {
        return modelMapper.map(vendorDTO, Vendor.class);
    }
}
