package org.example.vendorservice.dto;

import lombok.*;
import org.example.vendorservice.enums.Services;
import org.example.vendorservice.enums.Status;

import java.time.LocalDate;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class VendorDTO {
    private Long idVendor;
    private String name;
    private Status status;
    private String phone;
    private String email;
    private String address;
    private LocalDate createdAt;
    private String bankAccountNumber;
    private Services service;
}
