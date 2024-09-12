package org.example.trainingservice.model;

import lombok.*;

import java.time.LocalDate;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Vendor {
    private Long idVendor;
    private String name;
    private String phone;
    private String email;
    private String address;
    private Date createdAt;
    private String bankAccountNumber;
}
