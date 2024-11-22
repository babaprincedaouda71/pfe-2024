package org.example.vendorservice.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.example.vendorservice.dto.VendorDTO;
import org.example.vendorservice.entity.Vendor;
import org.example.vendorservice.exceptions.VendorNotFoundException;
import org.example.vendorservice.mapper.VendorMapper;
import org.example.vendorservice.repo.VendorRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@Transactional
public class VendorServiceImplv1 implements VendorService {
  private final VendorRepo vendorRepo;
  private final VendorMapper vendorMapper;

  public VendorServiceImplv1(VendorRepo vendorRepo, VendorMapper vendorMapper) {
    this.vendorRepo = vendorRepo;
    this.vendorMapper = vendorMapper;
  }

  @Override
  public VendorDTO addVendor(String vendor, MultipartFile rib, MultipartFile cv, MultipartFile contract, MultipartFile convention, MultipartFile ctr) {
    ObjectMapper objectMapper = new ObjectMapper();
    try {
      Vendor vendor1 = objectMapper.readValue(vendor, Vendor.class);
      if (rib != null) {
        vendor1.setRib(cv.getBytes());
      }
      if (cv != null) {
        vendor1.setCv(cv.getBytes());
      }
      if (contract != null) {
        vendor1.setContract(contract.getBytes());
      }
      if (convention != null) {
        vendor1.setConvention(convention.getBytes());
      }
      if (ctr != null) {
        vendor1.setCtr(ctr.getBytes());
      }
      vendor1.setCreatedAt(LocalDate.now());
      vendorRepo.save(vendor1);
      return vendorMapper.fromVendor(vendor1);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public List<VendorDTO> getAllVendors() {
    List<VendorDTO> vendorDTOS = new ArrayList<>();
    List<Vendor> all = vendorRepo.findAll();
    if (all.isEmpty()) {
      throw new VendorNotFoundException("Aucun Fournisseur trouvé dans la Base de Données");
    }
    all.forEach(
        vendor -> {
          vendorDTOS.add(vendorMapper.fromVendor(vendor));
        });
    return vendorDTOS;
  }

  @Override
  public Vendor getVendor(Long idVendor) {
    return vendorRepo
        .findById(idVendor)
        .orElseThrow(() -> new VendorNotFoundException("Le Fournisseur demandé n'existe pas"));
  }

  @Override
  public Vendor updateVendor(Vendor vendor) {
    getVendor(vendor.getIdVendor());
    return vendorRepo.save(vendor);
  }

  @Override
  public List<Vendor> findAllById(Set<Long> ids) {
    return vendorRepo.findAllById(ids);
  }

  @Override
  public Vendor deleteVendor(Long id) {
    try {
      Vendor vendor =
          vendorRepo
              .findById(id)
              .orElseThrow(() -> new RuntimeException("Le fournisseur n'existe pas"));
      vendorRepo.deleteById(id);
      return vendor;
    } catch (VendorNotFoundException e) {
      throw new VendorNotFoundException("La suppression n'a pas été éffectuée");
    }
  }
}
